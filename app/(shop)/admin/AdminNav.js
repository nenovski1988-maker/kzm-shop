'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

const TABS = [
  { href: '/admin/products', label: 'Продукти' },
  { href: '/admin/categories', label: 'Категории' },
  { href: '/admin/orders', label: 'Поръчки' },
  { href: '/admin/stock', label: 'Наличности' },
  { href: '/admin/site', label: 'Активност / Сайт' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={pathname?.startsWith(tab.href) ? styles.navActive : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
