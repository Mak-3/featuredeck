import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError } from '@/lib/api-helpers';

// GET /api/feedback - Dashboard: list feature requests for user's projects
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id')
      .in('org_id', orgIds)
      .eq('status', 'active');

    const accessibleProjectIds = projects?.map(p => p.id) || [];

    if (accessibleProjectIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let query = supabaseAdmin
      .from('feature_requests')
      .select('*, created_by_end_user:end_users(id, external_user_id, username, email), votes:feature_votes(count)');

    if (project_id) {
      if (!accessibleProjectIds.includes(project_id)) {
        return NextResponse.json({ data: [] });
      }
      query = query.eq('project_id', project_id);
    } else {
      query = query.in('project_id', accessibleProjectIds);
    }

    if (priority) query = query.eq('priority', priority);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order(sort, { ascending: order === 'asc' });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}
