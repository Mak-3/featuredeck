import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

const projectSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  status: z.string().optional(),
});

// GET /api/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;

    // Get user's organisations
    // Use admin client to bypass RLS and avoid infinite recursion
    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      throw new AppError('Project not found', 404);
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*, feature_requests(*)')
      .eq('id', id)
      .in('org_id', orgIds)
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/projects/[id] - Update project
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
    const updates = projectSchema.partial().parse(body);

    // Get user's organisations
    // Use admin client to bypass RLS and avoid infinite recursion
    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      throw new AppError('Project not found', 404);
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .in('org_id', orgIds)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new AppError('Project not found', 404);

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { id } = await params;

    // Get user's organisations
    // Use admin client to bypass RLS and avoid infinite recursion
    const { data: orgMembers } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (!orgMembers || orgMembers.length === 0) {
      throw new AppError('Project not found', 404);
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data: featureRequests } = await supabaseAdmin
      .from('feature_requests')
      .select('id')
      .eq('project_id', id);

    if (featureRequests && featureRequests.length > 0) {
      const featureIds = featureRequests.map(f => f.id);
      await supabaseAdmin
        .from('feature_votes')
        .delete()
        .in('feature_request_id', featureIds);

      await supabaseAdmin
        .from('feature_requests')
        .delete()
        .eq('project_id', id);
    }

    await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('project_id', id)
      .in('org_id', orgIds);

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .in('org_id', orgIds);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

