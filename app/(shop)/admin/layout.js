import Link from 'next/link';
import AdminNav from './AdminNav';
import styles from './admin.module.css';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1>Админ панел</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--g3)' }}>КЗМ Магазин</div>
        </div>
        <Link href="/" className="btn btn-ghost">← Към витрината</Link>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
