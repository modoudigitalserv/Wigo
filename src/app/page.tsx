import { createClient } from "@/lib/server";
import LandingClient from "./LandingClient";

const MOCK_FEATURED = [
  { id: "1", brand: "BMW", model: "Série 5 M-Sport", fuel: "essence", transmission: "automatique", price_day: 130, rating_average: 4.9, car_images: [] },
  { id: "2", brand: "Range Rover", model: "Sport", fuel: "diesel", transmission: "automatique", price_day: 180, rating_average: 4.8, car_images: [] },
  { id: "3", brand: "Mercedes", model: "Classe S", fuel: "essence", transmission: "automatique", price_day: 230, rating_average: 5.0, car_images: [] },
];

export default async function Home() {
  const supabase = await createClient();

  // Fetch 3 top-rated cars
  const { data: dbCars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("status", "disponible")
    .order("rating_average", { ascending: false })
    .limit(3);

  const featuredCars = dbCars && dbCars.length > 0 ? dbCars : MOCK_FEATURED;

  // Fetch platform stats
  const [{ count: totalCars }, { count: totalDrivers }] = await Promise.all([
    supabase.from("cars").select("*", { count: "exact", head: true }),
    supabase.from("drivers").select("*", { count: "exact", head: true }).eq("is_verified", true),
  ]);

  return <LandingClient cars={featuredCars} totalCars={totalCars ?? "500+"} totalDrivers={totalDrivers ?? "200+"} />;
}


