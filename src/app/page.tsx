import { createClient } from "@/lib/server";
import LandingClient from "./LandingClient";

export default async function Home() {
  const supabase = await createClient();

  const { data: dbCars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("status", "disponible")
    .order("rating_average", { ascending: false })
    .limit(9);

  const vehicles = dbCars ?? [];

  return <LandingClient cars={vehicles} />;
}


