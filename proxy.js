import { NextResponse } from 'next/server';

// Protects everything under /admin with HTTP Basic Auth.
// Same approach as the ArtIV shop admin — set ADMIN_USER / ADMIN_PASSWORD
// as environment variables in Vercel (never commit real values).
//
// Renamed from `middleware.js` to `proxy.js` per Next.js 16 (the old
// "middleware" file convention is deprecated in favor of "proxy" —
// same behavior, new file name/export name).
export function proxy(request) {
  const authHeader = request.headers.get('authorization');

  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (authHeader) {
    const [, encoded] = authHeader.split(' ');
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [user, pass] = decoded.split(':');
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="KZM Admin"' },
  });
}

export const config = {
  matcher: '/admin/:path*',
};
