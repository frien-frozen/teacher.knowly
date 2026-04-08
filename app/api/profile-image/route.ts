import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  // Security Check: Only allow URLs from our own blob store
  if (!imageUrl.includes('.blob.vercel-storage.com')) {
    return new NextResponse('Invalid source', { status: 403 });
  }

  // Auth Check: Ensure the user is logged in
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('knowly_auth');
  if (!authCookie) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch the private blob using our server-side token
    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image from storage', { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/webp');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
