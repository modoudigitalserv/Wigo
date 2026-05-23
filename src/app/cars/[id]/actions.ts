"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

export async function createCarBooking(formData: FormData) {
  const supabase = await createClient();

  // 1. Verify user is logged in
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) {
    redirect("/login?message=Connectez-vous pour réserver un véhicule.");
  }

  const carId = formData.get("car_id") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;
  const pickupLocation = formData.get("pickup_location") as string;
  const notes = formData.get("notes") as string;

  // 2. Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    redirect(`/cars/${carId}/book?error=Dates invalides. La date de retour doit être après la date de départ.`);
  }

  // 3. Calculate number of days and total price
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // 4. Fetch car price
  const { data: car } = await supabase
    .from("cars")
    .select("price_day, company_id, status")
    .eq("id", carId)
    .single();

  if (!car || car.status !== "disponible") {
    redirect(`/cars/${carId}/book?error=Ce véhicule n'est plus disponible.`);
  }

  const totalPrice = car.price_day * diffDays;

  // 5. Create booking
  const { error } = await supabase.from("bookings").insert({
    car_id: carId,
    customer_id: user.sub,
    company_id: car.company_id,
    start_date: startDate,
    end_date: endDate,
    pickup_location: pickupLocation,
    total_price: totalPrice,
    notes,
    status: "pending",
  });

  if (error) {
    console.error("Booking error:", error);
    redirect(`/cars/${carId}/book?error=Erreur lors de la réservation. Veuillez réessayer.`);
  }

  // 6. Success redirect
  revalidatePath("/dashboard");
  redirect("/dashboard?message=Réservation envoyée avec succès ! L'entreprise va vous confirmer.");
}
