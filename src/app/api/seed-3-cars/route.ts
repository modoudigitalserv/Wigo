import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
  }

  // Find the company for the current user
  let { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  
  if (!company) {
    return NextResponse.json({ error: "Aucune entreprise trouvée pour cet utilisateur." }, { status: 400 });
  }

  // 1. Insert 3 new cars
  const carsToInsert = [
    {
      company_id: company.id,
      brand: "Mercedes",
      model: "Classe G 63 AMG",
      year: 2024,
      fuel: "Essence",
      transmission: "Automatique",
      city: "Paris",
      price_day: 800,
      status: "disponible"
    },
    {
      company_id: company.id,
      brand: "Porsche",
      model: "911 Carrera S",
      year: 2023,
      fuel: "Essence",
      transmission: "Automatique",
      city: "Paris",
      price_day: 650,
      status: "disponible"
    },
    {
      company_id: company.id,
      brand: "Range Rover",
      model: "Sport HSE",
      year: 2024,
      fuel: "Hybride",
      transmission: "Automatique",
      city: "Paris",
      price_day: 500,
      status: "disponible"
    }
  ];

  const { data: insertedCars, error: carsError } = await supabase
    .from("cars")
    .insert(carsToInsert)
    .select();

  if (carsError || !insertedCars) {
    return NextResponse.json({ error: "Erreur lors de l'insertion des voitures : " + carsError?.message }, { status: 500 });
  }

  // 2. Insert images for the 3 cars
  const imagesToInsert = [
    {
      car_id: insertedCars[0].id, // Mercedes G63
      image_url: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2000&auto=format&fit=crop"
    },
    {
      car_id: insertedCars[1].id, // Porsche 911
      image_url: "https://images.unsplash.com/photo-1503376710356-698f1212879a?q=80&w=2000&auto=format&fit=crop"
    },
    {
      car_id: insertedCars[2].id, // Range Rover
      image_url: "https://images.unsplash.com/photo-1606016159991-d17f65320c87?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  const { error: imagesError } = await supabase
    .from("car_images")
    .insert(imagesToInsert);

  if (imagesError) {
    return NextResponse.json({ error: "Erreur lors de l'insertion des images : " + imagesError.message }, { status: 500 });
  }

  // Redirection back to the cars page to see the result
  return NextResponse.redirect(new URL("/cars", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
