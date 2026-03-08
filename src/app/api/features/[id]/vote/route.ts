import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey, hasScope } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

export async function POST(
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
    const { endUserId } = body;

    if (!endUserId) {
      return NextResponse.json(
        { success: false, error: 'endUserId is required' },
        { status: 400 }
      );
    }

    let endUser: any;
    const { data: existingEndUser } = await supabaseAdmin
      .from('end_users')
      .select('id')
      .eq('project_id', apiKeyData.projectId)
      .eq('external_user_id', endUserId)
      .single();

    if (!existingEndUser) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('end_users')
        .insert({
          project_id: apiKeyData.projectId,
          external_user_id: endUserId,
        })
        .select('id')
        .single();

      if (createError || !newUser) {
        throw new Error('Failed to create end user');
      }
      endUser = newUser;
    } else {
      endUser = existingEndUser;
    }

    const { data: existingVote } = await supabaseAdmin
      .from('feature_votes')
      .select('id')
      .eq('feature_request_id', id)
      .eq('end_user_id', endUser.id)
      .single();

    if (existingVote) {
      const { error } = await supabaseAdmin
        .from('feature_votes')
        .delete()
        .eq('id', existingVote.id);

      if (error) throw error;

      const { count } = await supabaseAdmin
        .from('feature_votes')
        .select('*', { count: 'exact', head: true })
        .eq('feature_request_id', id);

      const newCount = count || 0;

      await supabaseAdmin
        .from('feature_requests')
        .update({ upvotes_count: newCount })
        .eq('id', id);

      return NextResponse.json({
        success: true,
        data: {
          upvotesCount: newCount,
          hasUpvoted: false,
        }
      });
    } else {
      const { error } = await supabaseAdmin
        .from('feature_votes')
        .insert({
          feature_request_id: id,
          end_user_id: endUser.id,
        });

      if (error) throw error;

      const { count } = await supabaseAdmin
        .from('feature_votes')
        .select('*', { count: 'exact', head: true })
        .eq('feature_request_id', id);

      const newCount = count || 0;

      await supabaseAdmin
        .from('feature_requests')
        .update({ upvotes_count: newCount })
        .eq('id', id);

      return NextResponse.json({
        success: true,
        data: {
          upvotesCount: newCount,
          hasUpvoted: true,
        }
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
