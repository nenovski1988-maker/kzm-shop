'use client';

import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  // Виж бележката в Header.js — завесата е самостоятелна страница.
  if (pathname === '/coming-soon') return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>КЗМ Магазин</div>
        <nav className={styles.links}>
          <a href="https://kzm.bg">kzm.bg</a>
          <a href="https://kzm.bg/privacy.html">Поверителност</a>
          <a href="https://kzm.bg/cookies.html">Бисквитки</a>
          <a href="/contact">Контакти</a>
        </nav>
        <div className={styles.copy}>© {new Date().getFullYear()} КЗМ ЕООД</div>
      </div>
    </footer>
  );
}
