import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Vous devez être connecté pour générer des données." }, { status: 401 });
  }

  // 1. Insert company if not exists
  let { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  
  if (!company) {
    const { data: newCompany, error: companyError } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        name: "Elite Auto Rental",
        city: "Paris",
        phone: "+33 6 12 34 56 78",
        subscription_plan: "Pro"
      })
      .select()
      .single();
      
    if (companyError) return NextResponse.json({ error: "Company insert error: " + companyError.message }, { status: 500 });
    company = newCompany;
  }

  // 2. Insert two cars
  const { error: carsError } = await supabase
    .from("cars")
    .insert([
      {
        company_id: company.id,
        brand: "Mercedes-Benz",
        model: "S-Class",
        year: 2024,
        fuel: "Hybride",
        transmission: "Automatique",
        city: "Paris",
        price_day: 450,
        status: "disponible"
      },
      {
        company_id: company.id,
        brand: "Porsche",
        model: "Taycan",
        year: 2024,
        fuel: "Électrique",
        transmission: "Automatique",
        city: "Paris",
        price_day: 350,
        status: "disponible"
      }
    ]);

  if (carsError) return NextResponse.json({ error: "Cars insert error: " + carsError.message }, { status: 500 });

  // 3. Create a dummy mission for testing so the table isn't empty
  const { data: carData } = await supabase.from("cars").select("id").eq("company_id", company.id).limit(1).single();
  
  if (carData) {
    const { error: bookingError } = await supabase.from("bookings").insert({
        car_id: carData.id,
        customer_id: user.id, // using same user as customer for simplicity of testing
        company_id: company.id,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000 * 3).toISOString(), // + 3 days
        total_price: 1350,
        status: "pending"
    });
    if (bookingError) return NextResponse.json({ error: "Booking insert error: " + bookingError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: "1 Entreprise, 2 Voitures et 1 Mission générées avec succès !",
    instructions: "Retournez sur http://localhost:3000/dashboard/company/missions pour voir le résultat."
  });
}
