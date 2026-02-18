import { supabase } from './client';

/**
 * Test Supabase connection and configuration
 * Run this from a component to verify setup
 */
export async function testSupabaseConnection() {
  try {
    console.warn('🔍 Testing Supabase connection...');

    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    console.warn('✅ Supabase client initialized');

    // Test 2: Test anonymous connection
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      // This is expected if not authenticated - RLS will block
      if (error.message.includes('JWT') || error.message.includes('RLS')) {
        console.warn('✅ Connection successful (RLS is working)');
        return {
          success: true,
          message: 'Connected to Supabase. RLS policies are active.',
        };
      }
      throw error;
    }

    console.warn('✅ Database query successful');
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      data,
    };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    };
  }
}

/**
 * Test authentication flow
 */
export async function testAuth() {
  try {
    console.warn('🔍 Testing Supabase Auth...');

    // Check current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (session) {
      console.warn('✅ User is authenticated:', session.user.email);
      return { success: true, authenticated: true, user: session.user };
    } else {
      console.warn('ℹ️ No active session');
      return { success: true, authenticated: false };
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
