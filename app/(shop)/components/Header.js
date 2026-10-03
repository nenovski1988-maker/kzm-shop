'use client';

import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { useLanguage } from '../lib/languageContext';
import LanguageToggle from './LanguageToggle';
import styles from './Header.module.css';

export default function Header() {
  const { totalCount } = useCart();
  const { t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          <span>К<span className={styles.brandMark}>З</span>М</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--g3)' }}>
            {t('header.shopTag')}
          </span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/catalog">{t('header.products')}</Link>
          <Link href="/za-nas">{t('header.about')}</Link>
          <Link href="/contact">{t('header.contact')}</Link>
          <a href="https://kzm.bg" className={styles.siteLink}>{t('header.mainSite')}</a>
          <LanguageToggle />
          <Link href="/cart" className={styles.cart} aria-label={t('header.cartLabel')}>
            🛒
            {totalCount > 0 && <span className={styles.cartCount}>{totalCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
