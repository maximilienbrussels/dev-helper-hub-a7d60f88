import { neonSupabaseCompat as supabase } from '@/lib/neon-auth-compat';

type SignInOptions = { redirect_uri?: string; extraParams?: Record<string, string> };

// Preserve the imported account system until its accounts are migrated.
export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: 'google' | 'apple' | 'microsoft' | 'lovable',
      opts?: SignInOptions,
    ) => {
      const redirectTo = opts?.redirect_uri ?? (typeof window !== 'undefined' ? window.location.origin : '/');
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) return { error: new Error(error.message) };
      return { redirected: true as const };
    },
  },
};