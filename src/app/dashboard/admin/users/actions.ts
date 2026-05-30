"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function toggleBlockUser(formData: FormData) {
  const supabase = await createClient();
  const userId = formData.get("userId") as string;
  const currentState = formData.get("currentState") === "true";

  if (!userId) return;

  // We toggle the boolean
  await supabase
    .from("profiles")
    .update({ is_blocked: !currentState })
    .eq("id", userId);

  revalidatePath("/dashboard/admin/users");
}
