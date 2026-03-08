import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.string().optional(),
});

async function getAccessibleProjectIds(userId: string): Promise<string[]> {
  const { data: orgMembers } = await supabaseAdmin
    .from('org_members')
    .select('org_id')
    .eq('user_id', userId);

  if (!orgMembers || orgMembers.length === 0) return [];

  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id')
    .in('org_id', orgMembers.map(om => om.org_id))
    .eq('status', 'active');

  return projects?.map(p => p.id) || [];
}

// GET /api/feedback/[id] - Dashboard: get a single feature request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;
    const projectIds = await getAccessibleProjectIds(user.id);

    if (projectIds.length === 0) throw new AppError('Not found', 404);

    const { data, error } = await supabaseAdmin
      .from('feature_requests')
      .select('*, created_by_end_user:end_users(id, external_user_id, username, email), votes:feature_votes(count)')
      .eq('id', id)
      .in('project_id', projectIds)
      .single();

    if (error || !data) throw new AppError('Feature request not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/feedback/[id] - Dashboard: admin updates status, priority, etc.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;
    const body = await request.json();
    const updates = updateSchema.parse(body);

    const projectIds = await getAccessibleProjectIds(user.id);
    if (projectIds.length === 0) throw new AppError('Not found', 404);

    const { data, error } = await supabaseAdmin
      .from('feature_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .in('project_id', projectIds)
      .select('*, created_by_end_user:end_users(id, external_user_id, username, email), votes:feature_votes(count)')
      .single();

    if (error || !data) throw new AppError('Feature request not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/feedback/[id] - Dashboard: admin deletes a feature request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;
    const projectIds = await getAccessibleProjectIds(user.id);
    if (projectIds.length === 0) throw new AppError('Not found', 404);

    // Delete votes first (FK constraint)
    await supabaseAdmin
      .from('feature_votes')
      .delete()
      .eq('feature_request_id', id);

    const { error } = await supabaseAdmin
      .from('feature_requests')
      .delete()
      .eq('id', id)
      .in('project_id', projectIds);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
