import { createServerSupabaseClient } from '@/backend/supabase/server';
import { DbCustomRemedy } from '@/backend/database/types';

export const remedyService = {
  async getRemediesByUser(userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('custom_remedies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async addRemedy(userId: string, data: { text: string; category?: string; profile_id?: string | null }) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('custom_remedies')
      .insert({
        user_id: userId,
        text: data.text,
        category: data.category || 'General',
        profile_id: data.profile_id || null,
      })
      .select()
      .single();
  },

  async deleteRemedy(id: string, userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('custom_remedies')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  },
};
