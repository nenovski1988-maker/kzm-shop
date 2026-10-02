// Self-hosted font files (no runtime fetch to Google Fonts — more reliable
// on restricted networks/build environments than next/font/google).
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/cormorant-garamond/cyrillic-300.css';
import '@fontsource/cormorant-garamond/cyrillic-600.css';
import '@fontsource/cormorant-garamond/cyrillic-700.css';
import '@fontsource/cormorant-garamond/cyrillic-300-italic.css';
import '@fontsource/cormorant-garamond/cyrillic-600-italic.css';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  metadataBase: new URL('https://shop.kzm.bg'),
  title: {
    default: 'Магазин КЗМ — продукти за копитно здраве',
    template: '%s — Магазин КЗМ',
  },
  description:
    'Продукти за копитен здравен мениджмънт на говеда — инструменти за подрязване, превантивни и лечебни средства. Доставка в цяла България.',
  openGraph: {
    type: 'website',
    siteName: 'Магазин КЗМ',
    locale: 'bg_BG',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
