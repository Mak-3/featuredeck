import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey, hasScope } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const endUserId = searchParams.get('endUserId');

    const { data: featureRequest, error } = await supabaseAdmin
      .from('feature_requests')
      .select('*, created_by_end_user:end_users(*), votes:feature_votes(count)')
      .eq('id', id)
      .eq('project_id', apiKeyData.projectId)
      .single();

    if (error || !featureRequest) {
      return NextResponse.json(
        { success: false, error: 'Feature not found' },
        { status: 404 }
      );
    }

    let hasUpvoted = false;
    if (endUserId) {
      const { data: endUser } = await supabaseAdmin
        .from('end_users')
        .select('id')
        .eq('project_id', apiKeyData.projectId)
        .eq('external_user_id', endUserId)
        .single();

      if (endUser) {
        const { data: upvote } = await supabaseAdmin
          .from('feature_votes')
          .select('id')
          .eq('feature_request_id', id)
          .eq('end_user_id', endUser.id)
          .single();

        hasUpvoted = !!upvote;
      }
    }

    const author = featureRequest.created_by_end_user ? {
      id: featureRequest.created_by_end_user.id,
      externalUserId: featureRequest.created_by_end_user.external_user_id,
      username: featureRequest.created_by_end_user.username,
      email: featureRequest.created_by_end_user.email,
    } : null;

    const voteCount = featureRequest.votes?.[0]?.count || featureRequest.upvotes_count || 0;

    const transformed = {
      id: featureRequest.id,
      projectId: featureRequest.project_id,
      title: featureRequest.title,
      description: featureRequest.description || null,
      status: featureRequest.status,
      priority: featureRequest.priority,
      createdByEndUserId: featureRequest.created_by_end_user_id || null,
      createdAt: featureRequest.created_at,
      updatedAt: featureRequest.updated_at,
      upvotesCount: voteCount,
      hasUpvoted,
      author,
    };

    return NextResponse.json({
      success: true,
      data: transformed
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    if (!hasScope(apiKeyData, 'write')) {
      return NextResponse.json(
        { success: false, error: 'API key does not have write permission' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description } = body;

    if (!title && description === undefined) {
      return NextResponse.json(
        { success: false, error: 'At least one field (title or description) is required' },
        { status: 400 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('feature_requests')
      .select('id')
      .eq('id', id)
      .eq('project_id', apiKeyData.projectId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Feature not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const { data: updated, error } = await supabaseAdmin
      .from('feature_requests')
      .update(updateData)
      .eq('id', id)
      .select('*, created_by_end_user:end_users(*), votes:feature_votes(count)')
      .single();

    if (error) throw error;

    const author = updated.created_by_end_user ? {
      id: updated.created_by_end_user.id,
      externalUserId: updated.created_by_end_user.external_user_id,
      username: updated.created_by_end_user.username,
      email: updated.created_by_end_user.email,
    } : null;

    const voteCount = updated.votes?.[0]?.count || updated.upvotes_count || 0;

    const transformed = {
      id: updated.id,
      projectId: updated.project_id,
      title: updated.title,
      description: updated.description || null,
      status: updated.status,
      priority: updated.priority,
      createdByEndUserId: updated.created_by_end_user_id || null,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      upvotesCount: voteCount,
      hasUpvoted: false,
      author,
    };

    return NextResponse.json({
      success: true,
      data: transformed
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    if (!hasScope(apiKeyData, 'write')) {
      return NextResponse.json(
        { success: false, error: 'API key does not have write permission' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const endUserId = searchParams.get('endUserId');

    if (!endUserId) {
      return NextResponse.json(
        { success: false, error: 'endUserId query parameter required' },
        { status: 400 }
      );
    }

    const { data: endUser } = await supabaseAdmin
      .from('end_users')
      .select('id')
      .eq('project_id', apiKeyData.projectId)
      .eq('external_user_id', endUserId)
      .single();

    if (!endUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { data: featureRequest, error: fetchError } = await supabaseAdmin
      .from('feature_requests')
      .select('created_by_end_user_id')
      .eq('id', id)
      .eq('project_id', apiKeyData.projectId)
      .single();

    if (fetchError || !featureRequest) {
      return NextResponse.json(
        { success: false, error: 'Feature not found' },
        { status: 404 }
      );
    }

    if (featureRequest.created_by_end_user_id !== endUser.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete features you created' },
        { status: 403 }
      );
    }

    await supabaseAdmin
      .from('feature_votes')
      .delete()
      .eq('feature_request_id', id);

    const { error } = await supabaseAdmin
      .from('feature_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
