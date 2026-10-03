import { redirect } from 'next/navigation';
import ComingSoonForm from './ComingSoonForm';
import styles from './coming-soon.module.css';

export const metadata = {
  title: 'Очаквайте скоро',
  robots: { index: false, follow: false },
};

// Без това Next.js би кеширал статично редирект-решението, взето при build —
// виж бележката в app/cart/page.js за същия проблем с Vercel CDN кеша.
export const dynamic = 'force-dynamic';

// Ако завесата е изключена (COMING_SOON_MODE != 'true'), тази страница няма
// причина да съществува отделно от витрината — препраща към началната.
export default function ComingSoonPage() {
  if (process.env.COMING_SOON_MODE !== 'true') {
    redirect('/');
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="КЗМ" className={styles.logo} />
        <h1>Очаквайте скоро</h1>
        <p className={styles.lead}>
          Онлайн магазинът на КЗМ е в процес на подготовка. Ще отвори съвсем скоро.
        </p>
        <ComingSoonForm />
        <a href="https://kzm.bg" className={styles.backLink}>← Към kzm.bg</a>
      </div>
    </div>
  );
}
