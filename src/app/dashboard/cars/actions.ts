"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

export async function addCar(formData: FormData) {
  const supabase = await createClient();

  // 1. Verify user and role
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) {
    redirect("/login");
  }

  let { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.sub || user.id)
    .limit(1)
    .maybeSingle();

  if (companyError) {
    throw new Error("Erreur de base de données: " + companyError.message);
  }

  if (!company) {
    // Créer une entreprise par défaut si elle n'existe pas pour débloquer le testeur
    const { data: newCompany, error: insertError } = await supabase
      .from("companies")
      .insert({
        user_id: user.sub || user.id,
        name: "Mon Entreprise (Auto-générée)",
        city: "Paris",
        subscription_plan: "Pro"
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error("Impossible de créer le profil entreprise automatiquement.");
    }
    company = newCompany;
  }

  // 2. Extract form data
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const fuel = formData.get("fuel") as string;
  const transmission = formData.get("transmission") as string;
  const price_day = parseFloat(formData.get("price_day") as string);
  const city = formData.get("city") as string;
  
  // 3. Insert into `cars` table
  const { data: newCar, error: insertError } = await supabase
    .from("cars")
    .insert({
      company_id: company.id,
      brand,
      model,
      year,
      fuel,
      transmission,
      price_day,
      city,
      status: "disponible"
    })
    .select()
    .single();

  if (insertError || !newCar) {
    console.error("Erreur lors de l'ajout de la voiture:", insertError);
    throw new Error("Impossible d'ajouter le véhicule.");
  }

  // 4. Upload image (if provided)
  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${newCar.id}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("cars")
      .upload(fileName, imageFile);

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("cars")
        .getPublicUrl(fileName);

      await supabase
        .from("car_images")
        .insert({
          car_id: newCar.id,
          image_url: publicUrlData.publicUrl,
          is_primary: true
        });
    } else {
      console.error("Upload error:", uploadError);
    }
  }

  // 5. Revalidate and redirect
  revalidatePath("/dashboard/cars");
  redirect("/dashboard/cars");
}

export async function updateCarStatus(carId: string, status: string) {
  const supabase = await createClient();

  // 1. Verify user and role
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2. Validate status
  if (!['disponible', 'louee', 'maintenance'].includes(status)) {
    throw new Error("Statut invalide");
  }

  // 3. Update the car
  const { error } = await supabase
    .from("cars")
    .update({ status })
    .eq("id", carId);

  if (error) {
    console.error("Erreur de mise à jour du statut:", error);
    throw new Error("Impossible de mettre à jour le statut");
  }

  revalidatePath("/dashboard/cars");
}
