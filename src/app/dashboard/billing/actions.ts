"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function simulateUpgrade(plan: string) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  const role = profile?.role;

  if (role === "company") {
    // Update company subscription
    await supabase
      .from("companies")
      .update({
        subscription_plan: plan,
        subscription_status: "active"
      })
      .eq("user_id", user.sub);
  } else if (role === "driver") {
    // Update driver subscription and usage stats
    const { data: driver } = await supabase
      .from("drivers")
      .select("id")
      .eq("user_id", user.sub)
      .single();

    if (driver) {
      await supabase
        .from("drivers")
        .update({
          subscription_plan: plan,
          subscription_status: "active",
          is_available: true // Reactivate driver if they were blocked
        })
        .eq("id", driver.id);

      // We only update the plan and unblock the quota. We keep the completed_missions count as it represents lifetime or current cycle.
      await supabase
        .from("driver_usage_stats")
        .update({
          current_plan: plan,
          quota_reached: false
        })
        .eq("driver_id", driver.id);
    }
  }

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/missions");
  revalidatePath("/dashboard");
}
