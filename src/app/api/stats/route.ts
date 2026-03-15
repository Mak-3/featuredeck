import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'project_id is required' },
        { status: 400 }
      );
    }

    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No organization found' },
        { status: 403 }
      );
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .in('org_id', orgIds)
      .eq('status', 'active')
      .single();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or not accessible' },
        { status: 403 }
      );
    }

    const [viewsResult, usersResult] = await Promise.all([
      supabaseAdmin
        .from('sdk_events')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('event', 'featureboard_opened'),

      supabaseAdmin
        .from('end_users')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        views: viewsResult.count || 0,
        users: usersResult.count || 0,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
