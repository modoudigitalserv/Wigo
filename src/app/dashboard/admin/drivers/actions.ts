"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function toggleVerifyDriver(formData: FormData) {
  const supabase = await createClient();
  const driverId = formData.get("driverId") as string;
  const currentState = formData.get("currentState") === "true";

  if (!driverId) return;

  await supabase
    .from("drivers")
    .update({ verified: !currentState })
    .eq("id", driverId);

  revalidatePath("/dashboard/admin/drivers");
}
