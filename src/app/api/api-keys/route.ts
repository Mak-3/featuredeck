import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError } from '@/lib/api-helpers';

// GET /api/api-keys?project_id=X - Get masked API key for a project
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const projectId = request.nextUrl.searchParams.get('project_id');
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'project_id query parameter is required' },
        { status: 400 }
      );
    }

    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      return NextResponse.json({ data: { hasKey: false, apiKey: null } });
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data: apiKeyRecord } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, status, created_at')
      .eq('project_id', projectId)
      .in('org_id', orgIds)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (apiKeyRecord) {
      return NextResponse.json({
        data: {
          apiKey: apiKeyRecord.name,
          hasKey: true,
          createdAt: apiKeyRecord.created_at,
        }
      });
    }

    return NextResponse.json({ data: { apiKey: null, hasKey: false } });
  } catch (error) {
    return handleError(error);
  }
}
