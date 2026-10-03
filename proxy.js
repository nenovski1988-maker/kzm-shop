import { NextResponse } from 'next/server';

// Next.js 16 позволява само един proxy.js файл/export за целия проект, затова
// двете самостоятелни задачи живеят тук заедно:
//
// 1) HTTP Basic Auth за всичко под /admin (непроменено спрямо преди).
// 2) "Завеса" (coming soon) за витрината — превключва се с env променливата
//    COMING_SOON_MODE (true/false) във Vercel, без промяна на кода. Байпасва
//    се с 4-цифрен PIN (env SITE_PIN), въведен на /coming-soon — при верен
//    код се слага cookie и посетителят вижда реалния сайт. /admin е изрично
//    изключен от завесата, за да може управлението на поръчки/наличности да
//    продължи нормално, докато витрината е скрита от клиентите.
const ACCESS_COOKIE = 'kzm_site_access';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    return checkAdminAuth(request);
  }

  return checkComingSoon(request);
}

function checkAdminAuth(request) {
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

function checkComingSoon(request) {
  if (process.env.COMING_SOON_MODE !== 'true') {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === 'granted';
  if (hasAccess) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Всичко друго освен: /admin (горе), вътрешните _next пътища, favicon,
    // /api маршрути, самата /coming-soon страница и статични файлове
    // (всякакъв път, съдържащ точка — .png, .css, .svg и т.н.).
    '/((?!admin|_next/static|_next/image|favicon.ico|api|coming-soon|.*\\..*).*)',
  ],
};
