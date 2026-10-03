// Отделен root layout за "завесата" (route group без Header/Footer/количка —
// виж Next.js docs за "multiple root layouts"). Държи /coming-soon напълно
// самостоятелна: NextResponse.rewrite() в proxy.js сменя РЕНДЕРИРАНОТО
// съдържание за произволен URL, но адресът в браузъра остава какъвто е бил,
// затова проверка по pathname в Header/Footer е ненадеждна — вместо това тук
// Header/Footer просто не съществуват в дървото.
//
// Няма превключвател на език тук (няма Header) — страницата просто показва
// последно избрания език (cookie kzm_lang), по подразбиране български.
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/cyrillic-300.css';
import '@fontsource/cormorant-garamond/cyrillic-600.css';
import '@fontsource/cormorant-garamond/cyrillic-700.css';
import '../globals.css';
import { getLang } from '../(shop)/lib/lang';

export default async function GateLayout({ children }) {
  const lang = await getLang();

  return (
    <html lang={lang}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
