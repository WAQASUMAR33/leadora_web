import { NextResponse } from 'next/server';
import { COUNTRY_CURRENCY_MAP } from '../../../lib/currencies'; // 130+ country mappings

export async function GET(request) {
  try {
    // Vercel and Cloudflare inject the visitor's country as a header — no extra API call needed
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    const cfCountry     = request.headers.get('cf-ipcountry');
    const edgeCountry   = vercelCountry || cfCountry;

    if (edgeCountry && COUNTRY_CURRENCY_MAP[edgeCountry]) {
      return NextResponse.json({ currencyCode: COUNTRY_CURRENCY_MAP[edgeCountry], country: edgeCountry });
    }

    // Fall back to IP-based lookup for local/non-edge environments
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : null;

    const isLocal = !ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.');
    if (isLocal) {
      return NextResponse.json({ currencyCode: 'CAD', country: 'CA' });
    }

    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    const currencyCode = COUNTRY_CURRENCY_MAP[data.country_code] || 'CAD';
    return NextResponse.json({ currencyCode, country: data.country_code || 'CA' });
  } catch {
    return NextResponse.json({ currencyCode: 'CAD', country: 'CA' });
  }
}
