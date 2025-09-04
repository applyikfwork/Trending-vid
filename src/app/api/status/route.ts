
import { NextResponse } from 'next/server';

export async function GET() {
  const youtube = !!process.env.YOUTUBE_API_KEY;
  const gemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

  return NextResponse.json({
    youtube,
    gemini,
    message: youtube && gemini ? 'All APIs configured' : 'Some APIs missing'
  });
}
