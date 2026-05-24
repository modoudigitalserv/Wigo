"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function toggleBlockUser(userId: string, currentStatus: boolean) {
  const supabase = await createClient();

  // 1. Verify user and role
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.sub).single();
  
  if (profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  // 2. Update user
  const { error } = await supabase
    .from("profiles")
    .update({ is_blocked: !currentStatus })
    .eq("id", userId);

  if (error) {
    console.error("Error toggling block status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/dashboard/users");
}
