'use client';

import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import styles from './Header.module.css';

export default function Header() {
  const { totalCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          <span>К<span className={styles.brandMark}>З</span>М</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--g3)' }}>Магазин</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/catalog">Продукти</Link>
          <Link href="/za-nas">За нас</Link>
          <Link href="/contact">Контакти</Link>
          <a href="https://kzm.bg" className={styles.siteLink}>← Основен сайт</a>
          <Link href="/cart" className={styles.cart} aria-label="Кошница">
            🛒
            {totalCount > 0 && <span className={styles.cartCount}>{totalCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
