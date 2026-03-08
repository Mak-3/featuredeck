import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';
import { authenticate, handleError, AppError } from '@/lib/api-helpers';

const projectSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  status: z.string().default('active').optional(),
});

function generateApiKey(): string {
  return `pk_${crypto.randomBytes(32).toString('hex')}`;
}

// GET /api/projects - Get all user's projects
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const { data: orgMembers, error: orgError } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id);

    if (orgError) throw orgError;

    if (!orgMembers || orgMembers.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const orgIds = orgMembers.map(om => om.org_id);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*, feature_requests(count)')
      .in('org_id', orgIds)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/projects - Create project with auto-generated API key
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;

    const body = await request.json();
    const validated = projectSchema.parse(body);

    let { data: orgMembersData, error: orgError } = await supabaseAdmin
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .limit(1);
    
    const orgMember = orgMembersData && orgMembersData.length > 0 ? orgMembersData[0] : null;

    let orgId: string;

    if (orgError || !orgMember) {
      const { data: newOrg, error: createOrgError } = await supabaseAdmin
        .from('organisations')
        .insert({
          name: `${user.email?.split('@')[0] || 'My'}'s Organisation`,
          owner_user_id: user.id,
        })
        .select()
        .single();

      if (createOrgError) throw createOrgError;
      if (!newOrg) throw new AppError('Failed to create organisation', 500);

      orgId = newOrg.id;

      const { error: memberError } = await supabaseAdmin
        .from('org_members')
        .insert({
          org_id: orgId,
          user_id: user.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      // Auto-assign basic plan subscription for new organisations
      const { data: basicPlan } = await supabaseAdmin
        .from('plans')
        .select('id')
        .eq('name', 'Basic')
        .single();

      if (basicPlan) {
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            org_id: orgId,
            plan_id: basicPlan.id,
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
          });
      }
    } else {
      orgId = orgMember.org_id;
    }

    const slug = validated.slug || validated.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name: validated.name,
        slug: slug,
        org_id: orgId,
        status: validated.status || 'active',
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-generate a project-scoped API key
    const apiKey = generateApiKey();
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const maskedDisplay = `pk_${'•'.repeat(56)}${apiKey.slice(-8)}`;

    const { error: keyError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        org_id: orgId,
        project_id: data.id,
        name: maskedDisplay,
        key_hash: keyHash,
        scopes: ['read', 'write'],
        status: 'active',
      });

    if (keyError) throw keyError;

    return NextResponse.json({
      data: { ...data, api_key: apiKey },
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

