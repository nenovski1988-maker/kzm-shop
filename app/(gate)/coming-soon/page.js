import { redirect } from 'next/navigation';
import ComingSoonForm from './ComingSoonForm';
import { t } from '../../(shop)/lib/i18n';
import { getLang } from '../../(shop)/lib/lang';
import styles from './coming-soon.module.css';

export async function generateMetadata() {
  const lang = await getLang();
  return {
    title: t(lang, 'comingSoon.metaTitle'),
    robots: { index: false, follow: false },
  };
}

// Без това Next.js би кеширал статично редирект-решението, взето при build —
// виж бележката в app/cart/page.js за същия проблем с Vercel CDN кеша.
export const dynamic = 'force-dynamic';

// Ако завесата е изключена (COMING_SOON_MODE != 'true'), тази страница няма
// причина да съществува отделно от витрината — препраща към началната.
export default async function ComingSoonPage() {
  if (process.env.COMING_SOON_MODE !== 'true') {
    redirect('/');
  }

  const lang = await getLang();

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="КЗМ" className={styles.logo} />
        <h1>{t(lang, 'comingSoon.title')}</h1>
        <p className={styles.lead}>{t(lang, 'comingSoon.lead')}</p>
        <ComingSoonForm lang={lang} />
        <a href="https://kzm.bg" className={styles.backLink}>{t(lang, 'comingSoon.back')}</a>
      </div>
    </div>
  );
}
