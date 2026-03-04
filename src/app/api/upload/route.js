import { NextResponse } from 'next/server';

// Server-side proxy for image uploads to avoid CORS issues in the browser.
// The browser calls POST /api/upload, and this route forwards the request
// to the external upload server from the Next.js server side.
export async function POST(request) {
  try {
    const body = await request.json();

    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API;
    if (!uploadUrl) {
      return NextResponse.json(
        { error: 'Upload API URL is not configured.' },
        { status: 500 }
      );
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `Upload server returned non-JSON response: ${text.substring(0, 200)}` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || result.message || `Upload failed with status ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to proxy upload request' },
      { status: 500 }
    );
  }
}
