import { supabaseServer } from '../../lib/supabaseServer';
import StockRow from './StockRow';
import adminStyles from '../admin.module.css';
import styles from './stock.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminStockPage() {
  const supabase = supabaseServer();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, stock_qty')
    .order('name', { ascending: true });

  if (error) {
    return <div className={adminStyles.placeholder}>Грешка при зареждане: {error.message}</div>;
  }

  if (products.length === 0) {
    return <div className={styles.empty}>Още няма добавени продукти.</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Продукт</th>
          <th>SKU</th>
          <th>Наличност</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <StockRow key={p.id} product={p} />
        ))}
      </tbody>
    </table>
  );
}
