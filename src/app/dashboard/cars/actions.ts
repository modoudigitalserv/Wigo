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

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.sub)
    .single();

  if (companyError || !company) {
    throw new Error("Vous devez avoir un profil entreprise pour ajouter un véhicule.");
  }

  // 2. Extract form data
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const fuel = formData.get("fuel") as string;
  const transmission = formData.get("transmission") as string;
  const seats = parseInt(formData.get("seats") as string) || 5;
  const price_day = parseFloat(formData.get("price_day") as string);
  const city = formData.get("city") as string;
  const description = formData.get("description") as string;
  const mileage = parseInt(formData.get("mileage") as string);
  
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
      seats,
      price_day,
      city,
      description,
      mileage,
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
  revalidatePath("/dashboard");
  revalidatePath("/cars");
  redirect("/dashboard");
}
