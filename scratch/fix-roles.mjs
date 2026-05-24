import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const accounts = [
  { email: 'admin@wigo.test', role: 'super_admin', full_name: 'Super Admin' },
  { email: 'company@wigo.test', role: 'company', full_name: 'Wigo Location' },
  { email: 'driver@wigo.test', role: 'driver', full_name: 'Jean Chauffeur' },
  { email: 'client@wigo.test', role: 'client', full_name: 'Client Test' }
];

async function fixRoles() {
  for (const acc of accounts) {
    console.log(`Fixing ${acc.email}...`);
    // 1. Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: 'password123'
    });

    if (authError) {
      console.error(`  [X] Failed to login: ${authError.message}`);
      continue;
    }

    const userId = authData.user.id;

    // 2. Update Profile Role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: acc.role, full_name: acc.full_name })
      .eq('id', userId);

    if (updateError) {
      console.error(`  [X] Failed to update profile: ${updateError.message}`);
    } else {
      console.log(`  [V] Successfully updated role to '${acc.role}'`);
    }

    // 3. Create Specific Entity if not exists
    if (acc.role === 'company') {
      await supabase.from('companies').upsert({
        user_id: userId,
        name: acc.full_name,
        city: 'Casablanca',
        is_verified: true
      }, { onConflict: 'user_id' }).catch(() => {});
    } else if (acc.role === 'driver') {
      await supabase.from('drivers').upsert({
        user_id: userId,
        city: 'Rabat',
        is_verified: true,
        is_available: true
      }, { onConflict: 'user_id' }).catch(() => {});
    }

    // Logout
    await supabase.auth.signOut();
  }
  console.log("All done!");
}

fixRoles();
