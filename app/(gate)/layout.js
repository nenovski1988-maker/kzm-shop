// Отделен root layout за "завесата" (route group без Header/Footer/количка —
// виж Next.js docs за "multiple root layouts"). Държи /coming-soon напълно
// самостоятелна: NextResponse.rewrite() в proxy.js сменя РЕНДЕРИРАНОТО
// съдържание за произволен URL, но адресът в браузъра остава какъвто е бил,
// затова проверка по pathname в Header/Footer е ненадеждна — вместо това тук
// Header/Footer просто не съществуват в дървото.
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/cyrillic-300.css';
import '@fontsource/cormorant-garamond/cyrillic-600.css';
import '@fontsource/cormorant-garamond/cyrillic-700.css';
import '../globals.css';

export default function GateLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
