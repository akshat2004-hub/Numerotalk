import { createServerSupabaseClient } from '@/backend/supabase/server';

export const reportService = {
  async getReportsByUser(userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('reports')
      .select('*, profiles(name, dob)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async getReportById(id: string) {
    const supabase = await createServerSupabaseClient();
    const query = supabase
      .from('reports')
      .select('*, profiles(name, dob, mobile, birth_time, destiny_system)');

    if (id.length > 30 && !id.includes('-')) {
      query.eq('share_token', id);
    } else {
      query.eq('id', id);
    }

    return query.single();
  },

  async deleteReport(id: string, userId: string) {
    const supabase = await createServerSupabaseClient();
    return supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  },
};
