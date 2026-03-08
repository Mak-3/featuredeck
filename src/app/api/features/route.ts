import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey, hasScope } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'trending';
    const endUserId = searchParams.get('endUserId');

    let query = supabaseAdmin
      .from('feature_requests')
      .select('*, created_by_end_user:end_users(*), votes:feature_votes(count)', { count: 'exact' })
      .eq('project_id', apiKeyData.projectId);

    if (status) {
      const statusArray = status.split(',');
      query = query.in('status', statusArray);
    }

    if (priority) {
      const priorityArray = priority.split(',');
      query = query.in('priority', priorityArray);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_upvotes':
        query = query.order('upvotes_count', { ascending: false });
        break;
      case 'trending':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, error, count } = await query;

    if (error) throw error;

    let userUpvotes: Set<string> = new Set();
    if (endUserId && data && data.length > 0) {
      const featureIds = data.map((f: any) => f.id);
      
      const { data: endUser } = await supabaseAdmin
        .from('end_users')
        .select('id')
        .eq('project_id', apiKeyData.projectId)
        .eq('external_user_id', endUserId)
        .single();

      if (endUser) {
        const { data: upvotes } = await supabaseAdmin
          .from('feature_votes')
          .select('feature_request_id')
          .eq('end_user_id', endUser.id)
          .in('feature_request_id', featureIds);

        if (upvotes) {
          userUpvotes = new Set(upvotes.map((u: any) => u.feature_request_id));
        }
      }
    }

    const transformed = (data || []).map((f: any) => {
      const author = f.created_by_end_user ? {
        id: f.created_by_end_user.id,
        externalUserId: f.created_by_end_user.external_user_id,
        username: f.created_by_end_user.username,
        email: f.created_by_end_user.email,
      } : null;

      const voteCount = f.votes?.[0]?.count || f.upvotes_count || 0;

      return {
        id: f.id,
        projectId: f.project_id,
        title: f.title,
        description: f.description || null,
        status: f.status,
        priority: f.priority,
        createdByEndUserId: f.created_by_end_user_id || null,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
        upvotesCount: voteCount,
        hasUpvoted: userUpvotes.has(f.id),
        author,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        data: transformed,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > offset + pageSize,
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, endUser } = body;

    if (!title || !endUser || !endUser.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, endUser' },
        { status: 400 }
      );
    }

    const projectId = apiKeyData.projectId;

    let endUserId: string;
    const { data: existingUser } = await supabaseAdmin
      .from('end_users')
      .select('id')
      .eq('project_id', projectId)
      .eq('external_user_id', endUser.id)
      .single();

    if (existingUser) {
      endUserId = existingUser.id;
      if (endUser.username || endUser.email) {
        await supabaseAdmin
          .from('end_users')
          .update({
            ...(endUser.username && { username: endUser.username }),
            ...(endUser.email && { email: endUser.email }),
          })
          .eq('id', endUserId);
      }
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('end_users')
        .insert({
          project_id: projectId,
          external_user_id: endUser.id,
          username: endUser.username || null,
          email: endUser.email || null,
        })
        .select('id')
        .single();

      if (createError || !newUser) {
        throw new Error('Failed to create end user');
      }
      endUserId = newUser.id;
    }

    const { data: featureRequest, error } = await supabaseAdmin
      .from('feature_requests')
      .insert({
        project_id: projectId,
        created_by_end_user_id: endUserId,
        title,
        description: description || null,
        status: 'open',
        priority: 'medium',
        upvotes_count: 1,
      })
      .select('*, created_by_end_user:end_users(*)')
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from('feature_votes')
      .insert({
        feature_request_id: featureRequest.id,
        end_user_id: endUserId,
      });

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
      upvotesCount: 1,
      hasUpvoted: true,
      author: featureRequest.created_by_end_user ? {
        id: featureRequest.created_by_end_user.id,
        externalUserId: featureRequest.created_by_end_user.external_user_id,
        username: featureRequest.created_by_end_user.username,
        email: featureRequest.created_by_end_user.email,
      } : null,
    };

    return NextResponse.json({
      success: true,
      data: transformed
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
