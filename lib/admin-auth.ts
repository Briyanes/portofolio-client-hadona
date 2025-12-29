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
    const cookieStore = cookies();

    // Create a Supabase client to get the session
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

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log('No session found:', sessionError?.message);
      return null;
    }

    // Verify user is admin using the access token from session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(session.access_token);
    if (authError || !user) {
      console.log('Auth error:', authError?.message);
      return null;
    }

    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      console.log('User is not an admin');
      return null;
    }

    return { user, accessToken: session.access_token };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

export async function getAdminUserForAction(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const cookieStore = await cookies();

    // Create a Supabase client to get the session
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

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log('No session found in action:', sessionError?.message);
      return null;
    }

    // Verify user is admin using the access token from session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(session.access_token);
    if (authError || !user) {
      console.log('Auth error in action:', authError?.message);
      return null;
    }

    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      console.log('User is not an admin in action');
      return null;
    }

    return { user, accessToken: session.access_token };
  } catch (error) {
    console.error('Error getting admin user in action:', error);
    return null;
  }
}

// Legacy functions for backward compatibility
export async function createSupabaseAdminClient() {
  const cookieStore = cookies();

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
