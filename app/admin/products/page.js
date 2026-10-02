import Link from 'next/link';
import { supabaseServer } from '../../lib/supabaseServer';
import ToggleActiveButton from './ToggleActiveButton';
import adminStyles from '../admin.module.css';
import styles from './ProductsList.module.css';

export const dynamic = 'force-dynamic';

const LOW_STOCK_THRESHOLD = 3;

function formatPriceEur(cents) {
  return (cents / 100).toLocaleString('bg-BG', { style: 'currency', currency: 'EUR' });
}

export default async function AdminProductsPage() {
  const supabase = supabaseServer();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className={adminStyles.placeholder}>Грешка при зареждане: {error.message}</div>;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {products.length} {products.length === 1 ? 'продукт' : 'продукта'}
        </span>
        <Link href="/admin/products/new" className="btn btn-primary">+ Нов продукт</Link>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          Още няма добавени продукти. Натисни „+ Нов продукт“, за да добавиш първия.
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <div className={styles.card} key={p.id}>
              <div className={styles.thumb}>
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.name} />
                ) : (
                  'няма снимка'
                )}
              </div>
              <div className={styles.body}>
                <span
                  className={`${styles.badge} ${p.active ? styles.badgeActive : styles.badgeInactive}`}
                >
                  {p.active ? 'Видим' : 'Скрит'}
                </span>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.meta}>
                  {p.sku ? `SKU: ${p.sku}` : 'без SKU'}
                  {p.category ? ` · ${p.category}` : ''}
                </div>
                <div className={styles.price}>{formatPriceEur(p.price_cents)}</div>
                <div
                  className={p.stock_qty <= LOW_STOCK_THRESHOLD ? styles.badgeLowStock : styles.meta}
                  style={p.stock_qty <= LOW_STOCK_THRESHOLD ? { width: 'fit-content', padding: '0.15rem 0.5rem', borderRadius: '999px' } : undefined}
                >
                  Наличност: {p.stock_qty} бр.
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/admin/products/${p.id}/edit`} className="btn btn-ghost">Редактирай</Link>
                  <ToggleActiveButton id={p.id} active={p.active} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
