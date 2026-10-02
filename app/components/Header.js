import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
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
            {/* TODO (Задача 5): жив брой артикули от CartContext */}
          </Link>
        </nav>
      </div>
    </header>
  );
}
