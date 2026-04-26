import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://learn.knowly.uz',
  'https://teacher.knowly.uz',
  'http://localhost:3000',
  'http://localhost:3001',
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://learn.knowly.uz';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400, headers: corsHeaders(origin) });
  }

  if (!imageUrl.includes('.blob.vercel-storage.com')) {
    return new NextResponse('Invalid source', { status: 403, headers: corsHeaders(origin) });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status, headers: corsHeaders(origin) });
    }

    const buffer = await response.arrayBuffer();
    const headers = new Headers(corsHeaders(origin));
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/webp');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders(origin) });
  }
}
