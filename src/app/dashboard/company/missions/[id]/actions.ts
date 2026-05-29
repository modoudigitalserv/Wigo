"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function updateMissionStatus(id: string, status: string) {
  const supabase = await createClient();
  
  // Update the booking status
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
    
  if (error) {
    console.error("Failed to update mission status:", error);
    throw new Error("Impossible de mettre à jour le statut.");
  }
  
  // Revalidate the pages to reflect the new status
  revalidatePath(`/dashboard/company/missions/${id}`);
  revalidatePath(`/dashboard/company/missions`);
}
