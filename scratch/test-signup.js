const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahgkdmaewcmxuqoxmhjf.supabase.co';
const supabaseKey = 'sb_publishable_w1NmLkQQSLOq8sfAiBRKug_dgA4EDbF';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_auto_confirm@wigo.test',
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Auto',
        role: 'client'
      }
    }
  });
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Signup success:', data.user?.identities);
    
    // Try to login immediately
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test_auto_confirm@wigo.test',
        password: 'password123'
    });
    
    if (loginError) {
        console.error('Login Error (Probably needs confirmation):', loginError.message);
    } else {
        console.log('Login success! Auto-confirm is ON.');
    }
  }
}

testSignup();
