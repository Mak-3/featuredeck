import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    const { data, error } = await supabaseAdmin
      .from('roadmap_features')
      .select('*')
      .eq('project_id', apiKeyData.projectId)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transformed = (data || []).map((item: any) => ({
      id: item.id,
      projectId: item.project_id,
      title: item.title,
      description: item.description || null,
      status: item.status,
      visibility: item.visibility,
      createdByUserId: item.created_by_user_id || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformed
    });
  } catch (error) {
    return handleError(error);
  }
}
