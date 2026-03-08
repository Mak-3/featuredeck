import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase-server';
import crypto from 'crypto';

export interface ApiKeyData {
  projectId: string;
  orgId: string;
  scopes: string[];
}

export async function validateApiKey(
  request: NextRequest
): Promise<{ apiKeyData: ApiKeyData } | { error: NextResponse }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Missing or invalid authorization header' },
          { status: 401 }
        )
      };
    }

    const apiKey = authHeader.split(' ')[1];
    
    if (!apiKey) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Missing API key' },
          { status: 401 }
        )
      };
    }

    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const { data: apiKeyRecord, error } = await supabaseAdmin
      .from('api_keys')
      .select('project_id, org_id, scopes, status, expires_at')
      .eq('key_hash', keyHash)
      .single();

    if (error || !apiKeyRecord) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Invalid API key' },
          { status: 401 }
        )
      };
    }

    if (apiKeyRecord.status !== 'active') {
      return {
        error: NextResponse.json(
          { success: false, error: 'API key is not active' },
          { status: 401 }
        )
      };
    }

    if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
      return {
        error: NextResponse.json(
          { success: false, error: 'API key has expired' },
          { status: 401 }
        )
      };
    }

    if (!apiKeyRecord.scopes || !apiKeyRecord.scopes.includes('read')) {
      return {
        error: NextResponse.json(
          { success: false, error: 'API key missing required read scope' },
          { status: 403 }
        )
      };
    }

    await supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', keyHash);

    return {
      apiKeyData: {
        projectId: apiKeyRecord.project_id,
        orgId: apiKeyRecord.org_id,
        scopes: apiKeyRecord.scopes || [],
      }
    };
  } catch (error: any) {
    return {
      error: NextResponse.json(
        { success: false, error: error.message || 'API key validation failed' },
        { status: 500 }
      )
    };
  }
}

export function hasScope(apiKeyData: ApiKeyData, requiredScope: string): boolean {
  return apiKeyData.scopes.includes(requiredScope) || apiKeyData.scopes.includes('*');
}


