import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
        }
      });
    }

    // Test login
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@hadona.id',
      password: 'Admin@12345',
    });

    if (error) {
      return NextResponse.json({
        status: 'login_failed',
        error: error.message,
        env: {
          url: supabaseUrl,
          keyPreview: supabaseAnonKey?.substring(0, 20) + '...',
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Login successful! Credentials are correct.',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      env: {
        url: supabaseUrl,
        keyPreview: supabaseAnonKey?.substring(0, 20) + '...',
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    });
  }
}
