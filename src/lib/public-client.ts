import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This client DOES NOT read cookies and is purely for public data fetching.
// It allows Next.js to statically cache the page or use ISR.
export const createPublicClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            next: { revalidate: 3600 }, // Cache public data for 1 hour
          });
        },
      },
    }
  );
};
