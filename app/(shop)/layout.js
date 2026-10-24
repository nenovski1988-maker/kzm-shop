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
import '../globals.css';
import { CartProvider } from './lib/cartContext';
import { LanguageProvider } from './lib/languageContext';
import { getLang } from './lib/lang';
import Header from './components/Header';
import Footer from './components/Footer';

export async function generateMetadata() {
  const lang = await getLang();
  const isEn = lang === 'en';
  return {
    metadataBase: new URL('https://shop.kzm.bg'),
    title: {
      default: isEn ? 'KZM Shop — hoof health products' : 'Магазин КЗМ — продукти за копитно здраве',
      template: isEn ? '%s — KZM Shop' : '%s — Магазин КЗМ',
    },
    description: isEn
      ? 'Bovine hoof health management products — trimming tools, preventive and treatment supplies. Delivery across Bulgaria.'
      : 'Продукти за копитен здравен мениджмънт на говеда — инструменти за подрязване, превантивни и лечебни средства. Доставка в цяла България.',
    openGraph: {
      type: 'website',
      siteName: isEn ? 'KZM Shop' : 'Магазин КЗМ',
      locale: isEn ? 'en_US' : 'bg_BG',
    },
  };
}

export default async function RootLayout({ children }) {
  const lang = await getLang();

  return (
    <html lang={lang}>
      <body>
        <LanguageProvider initialLang={lang}>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer lang={lang} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
