import { NextResponse } from 'next/server';

// API keys are stored as hashes and cannot be revealed after creation.
// Users must copy the key when it is first generated or regenerated.
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'API keys cannot be revealed after creation. To get a new key, use the regenerate endpoint.',
    },
    { status: 410 }
  );
}
