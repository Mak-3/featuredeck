import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const validation = await validateApiKey(request);
    if ('error' in validation) return validation.error;
    const { apiKeyData } = validation;

    const body = await request.json();
    const { externalUserId, username, email } = body;

    if (!externalUserId) {
      return NextResponse.json(
        { success: false, error: 'externalUserId is required' },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('end_users')
      .select('*')
      .eq('project_id', apiKeyData.projectId)
      .eq('external_user_id', externalUserId)
      .single();

    if (existingUser) {
      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;

      const { data: updated, error } = await supabaseAdmin
        .from('end_users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select('*')
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          externalUserId: updated.external_user_id,
          username: updated.username,
          email: updated.email,
        }
      });
    }

    const { data: newUser, error } = await supabaseAdmin
      .from('end_users')
      .insert({
        project_id: apiKeyData.projectId,
        external_user_id: externalUserId,
        username: username || null,
        email: email || null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        externalUserId: newUser.external_user_id,
        username: newUser.username,
        email: newUser.email,
      }
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
