import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_blocked")
      .eq("id", user.sub)
      .single();
      
    if (profile?.is_blocked) {
      redirect("/blocked");
    }
  }

  return <>{children}</>;
}
