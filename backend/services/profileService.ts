import { createServerSupabaseClient } from '@/backend/supabase/server';
import { DbProfile } from '@/backend/database/types';

export const profileService = {
  async getProfilesByUser(userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async getProfileById(id: string, userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
  },

  async createProfile(userId: string, data: Partial<DbProfile>) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('profiles')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();
  },

  async updateProfile(id: string, userId: string, data: Partial<DbProfile>) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
  },

  async deleteProfile(id: string, userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  },
};
