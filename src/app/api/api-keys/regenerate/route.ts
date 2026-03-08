import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

function generateApiKey(): string {
  return `pk_${crypto.randomBytes(32).toString('hex')}`;
}

// POST /api/api-keys/regenerate - Delete old key and create new one for a project
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const body = await request.json();
    const projectId = body.project_id;

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
      throw new AppError('Project not found', 404);
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id, org_id')
      .eq('id', projectId)
      .in('org_id', orgIds)
      .single();

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Delete all existing API keys for this project
    await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('project_id', projectId)
      .eq('org_id', project.org_id);

    // Generate and store new key
    const newApiKey = generateApiKey();
    const keyHash = crypto.createHash('sha256').update(newApiKey).digest('hex');
    const maskedDisplay = `pk_${'•'.repeat(56)}${newApiKey.slice(-8)}`;

    const { error: insertError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        org_id: project.org_id,
        project_id: projectId,
        name: maskedDisplay,
        key_hash: keyHash,
        scopes: ['read', 'write'],
        status: 'active',
      });

    if (insertError) throw insertError;

    return NextResponse.json({
      data: {
        apiKey: newApiKey,
        message: 'API key generated successfully'
      } 
    });
  } catch (error) {
    return handleError(error);
  }
}
