import { NextResponse } from 'next/server';

const ALLOWED_HOST = 'data.store2u.ca';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (parsedUrl.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const response = await fetch(imageUrl, {
    headers: {
      'Referer': 'https://store2u.ca',
      'User-Agent': 'Mozilla/5.0 (compatible; store2u/1.0)',
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
  }

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
