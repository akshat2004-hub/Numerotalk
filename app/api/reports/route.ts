import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/backend';
import { z } from 'zod';

const reportSchema = z.object({
  profile_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Report title is required'),
  sections: z.record(z.string(), z.boolean()),
  pdf_base64: z.string().optional(),
  is_public: z.boolean().default(true),
});

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*, profiles(name, dob)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ reports: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = reportSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid report data', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { profile_id, title, sections, pdf_base64, is_public } = validated.data;
    let pdfStorageUrl: string | null = null;

    // Optional upload to Supabase Storage if PDF data provided
    if (pdf_base64) {
      try {
        const cleanBase64 = pdf_base64.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const fileName = `${user.id}/${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from('reports')
          .upload(fileName, buffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('reports').getPublicUrl(fileName);
          pdfStorageUrl = urlData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('PDF storage upload failed, continuing with report save:', storageErr);
      }
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        profile_id: profile_id || null,
        title,
        sections,
        pdf_storage_url: pdfStorageUrl,
        is_public,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ report: data, message: 'Report saved successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
