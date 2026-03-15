import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { validateApiKey, hasScope } from '@/lib/api-key-validation';
import { handleError } from '@/lib/api-helpers';

interface IncomingEvent {
  event: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const MAX_BATCH_SIZE = 100;

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
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'events must be a non-empty array' },
        { status: 400 }
      );
    }

    if (events.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { success: false, error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE}` },
        { status: 400 }
      );
    }

    const rows = events.map((e: IncomingEvent) => ({
      project_id: apiKeyData.projectId,
      event: e.event,
      timestamp: e.timestamp,
      metadata: e.metadata || null,
    }));

    const { error } = await supabaseAdmin
      .from('sdk_events')
      .insert(rows);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { inserted: rows.length },
    });
  } catch (error) {
    return handleError(error);
  }
}
