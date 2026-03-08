import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase-server';

export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export async function authenticate(request: NextRequest): Promise<{ user: any } | { error: NextResponse }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        )
      };
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return {
        error: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      };
    }

    return { user };
  } catch (error: any) {
    return {
      error: NextResponse.json(
        { error: error.message || 'Authentication failed' },
        { status: 401 }
      )
    };
  }
}

export async function optionalAuth(request: NextRequest): Promise<{ user: any | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      return { user: user || null };
    }
    
    return { user: null };
  } catch (error) {
    return { user: null };
  }
}

export function handleError(error: any): NextResponse {
  console.error('Error:', error);

  // Zod validation errors
  if (error.name === 'ZodError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        details: error.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      },
      { status: 400 }
    );
  }

  // Supabase errors
  if (error.code && error.message && error.details) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: 400 }
    );
  }

  // AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    { status: statusCode }
  );
}

