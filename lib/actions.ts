'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string) {
          cookieStore.set({ name, value, ...{ sameSite: 'lax' } });
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );

  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: 'Email atau password salah' };
  }

  if (!authData.user) {
    return { error: 'Login gagal' };
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', authData.user.id)
    .eq('is_active', true)
    .single();

  if (!adminUser) {
    await supabase.auth.signOut();
    return { error: 'Anda tidak memiliki akses admin' };
  }

  // Update last login
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminUser.id);

  revalidatePath('/admin/dashboard');

  return { success: true, redirectTo: '/admin/dashboard' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string) {
          cookieStore.set({ name, value, ...{ sameSite: 'lax' } });
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );

  await supabase.auth.signOut();
  revalidatePath('/admin/login');

  return { success: true };
}
