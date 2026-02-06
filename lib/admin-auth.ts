/**
 * Admin authentication helpers
 * Handles admin login, logout, and session management
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export async function getAdminUserWithToken(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const cookieStore = await cookies();

    // Create a Supabase client to verify user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Use getUser() for server-side verification (not getSession() which reads cookies without verification)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return null;
    }

    // Get session for access token (user already verified above)
    const { data: { session } } = await supabase.auth.getSession();

    return { user, accessToken: session?.access_token || '' };
  } catch {
    return null;
  }
}

export async function getAdminUserForAction(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const cookieStore = await cookies();

    // Create a Supabase client to verify user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Use getUser() for server-side verification (not getSession() which reads cookies without verification)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    // Check if user is admin
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return null;
    }

    // Get session for access token (user already verified above)
    const { data: { session } } = await supabase.auth.getSession();

    return { user, accessToken: session?.access_token || '' };
  } catch {
    return null;
  }
}

// Legacy functions for backward compatibility
export async function createSupabaseAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore errors in server components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  );
}

export async function getAdminUser() {
  const supabase = await createSupabaseAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Check if user is admin from admin_users table
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .single();

  if (!adminUser) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();

  if (!user) {
    return false;
  }

  return true;
}
