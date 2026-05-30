"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) throw new Error("Unauthorized");

  // Fetch the booking to verify ownership or admin rights
  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("*, companies(user_id)")
    .eq("id", bookingId)
    .single();

  if (fetchErr || !booking) throw new Error("Booking not found");

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  const isAdmin = profile?.role === "super_admin" || user.email === "admin@wigo.test";
  const isOwner = booking.companies?.user_id === user.sub;

  if (!isAdmin && !isOwner) {
    throw new Error("Unauthorized to update booking status");
  }

  // Update status
  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (updateErr) throw new Error("Failed to update status");

  // Side effect: if completed, also make the car available again
  if (status === "completed" && booking.car_id) {
    await supabase
      .from("cars")
      .update({ status: "disponible" })
      .eq("id", booking.car_id);
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/revenues");
  revalidatePath("/dashboard");
}

export async function updateDriverBookingStatus(bookingId: string, status: string) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) throw new Error("Unauthorized");

  // Fetch driver booking
  const { data: booking, error: fetchErr } = await supabase
    .from("driver_bookings")
    .select("*, drivers(user_id, id)")
    .eq("id", bookingId)
    .single();

  if (fetchErr || !booking) throw new Error("Mission not found");

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  const isAdmin = profile?.role === "super_admin" || user.email === "admin@wigo.test";
  const isDriver = booking.drivers?.user_id === user.sub;

  if (!isAdmin && !isDriver) {
    throw new Error("Unauthorized to update mission status");
  }

  // Update status
  const { error: updateErr } = await supabase
    .from("driver_bookings")
    .update({ status })
    .eq("id", bookingId);

  if (updateErr) throw new Error("Failed to update mission status");

  // If marking as completed, increment completed_missions in driver_usage_stats and check quota
  if (status === "completed" && booking.driver_id) {
    // Check if usage stats exist
    const { data: stats } = await supabase
      .from("driver_usage_stats")
      .select("*")
      .eq("driver_id", booking.driver_id)
      .single();

    if (stats) {
      const newCount = (stats.completed_missions || 0) + 1;
      const limits: Record<string, number> = { starter: 10, pro: 9999, elite: 9999 };
      const currentPlan = stats.current_plan || "starter";
      const limit = limits[currentPlan] || 10;
      const quotaReached = currentPlan === "starter" && newCount >= limit;

      await supabase
        .from("driver_usage_stats")
        .update({
          completed_missions: newCount,
          quota_reached: quotaReached,
          updated_at: new Date().toISOString()
        })
        .eq("driver_id", booking.driver_id);

      // If quota reached, deactivate the driver profile (hide from public search)
      if (quotaReached) {
        await supabase
          .from("drivers")
          .update({ is_available: false })
          .eq("id", booking.driver_id);
      }
    } else {
      // Create first usage record
      await supabase
        .from("driver_usage_stats")
        .insert({
          driver_id: booking.driver_id,
          completed_missions: 1,
          current_plan: "starter",
          quota_reached: false
        });
    }
  }

  revalidatePath("/dashboard/missions");
  revalidatePath("/dashboard/revenues");
  revalidatePath("/dashboard");
}

export async function submitReview(bookingId: string, companyId: string, carId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) return { error: "Unauthorized" };

  try {
    const { error } = await supabase
      .from("reviews")
      .insert({
        booking_id: bookingId,
        company_id: companyId,
        car_id: carId,
        rating,
        comment,
      });

    if (error) {
      console.error("Review insertion error:", error);
      return { error: "Impossible de publier l'avis. Avez-vous déjà évalué cette réservation ?" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true };
  } catch (err: any) {
    console.error("Review error:", err);
    return { error: "Une erreur est survenue." };
  }
}
