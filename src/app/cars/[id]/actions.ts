"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const car_id = formData.get("car_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  if (!car_id || !start_date || !end_date) {
    throw new Error("Veuillez remplir tous les champs.");
  }

  // Get car info
  const { data: car } = await supabase.from("cars").select("price_day, company_id").eq("id", car_id).single();
  if (!car) throw new Error("Véhicule introuvable.");

  const days = Math.max(1, Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)));
  const total_price = days * car.price_day;

  const { error } = await supabase.from("bookings").insert({
    car_id,
    customer_id: user.sub,
    company_id: car.company_id,
    start_date,
    end_date,
    total_price,
    status: "pending",
  });

  if (error) {
    console.error("Booking error:", error);
    throw new Error("Impossible de créer la réservation.");
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/company/missions");
  redirect("/dashboard/bookings");
}
