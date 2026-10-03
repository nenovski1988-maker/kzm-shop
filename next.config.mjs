const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: https://res.cloudinary.com",
              // 'unsafe-eval' is only needed in dev — React/Turbopack's dev-mode
              // debugging (hot reload, stack reconstruction) calls eval(). Never
              // added in production, where React never calls eval() anyway.
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
              "frame-ancestors 'none'",
              // When Stripe/card payment is added (see ArtIV note), connect-src and
              // script-src will need the Stripe domains added here.
            ].join('; '),
          },
        ],
      },
      {
        // /cart и /checkout четат localStorage + винаги трябва прясна проверка
        // на наличността — изрично забраняваме на Vercel/CDN да ги кешира,
        // независимо от Next.js-овата си класификация (видяхме стар кеширан
        // HTML да се сервира и след нов деплой, маркиран dynamic). Групата
        // трябва да е прикачена към именован параметър (:path(...)), иначе
        // next.config headers() я игнорира безшумно.
        source: '/:path(cart|checkout)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
