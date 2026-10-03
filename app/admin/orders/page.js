import { supabaseServer } from '../../lib/supabaseServer';
import OrderRow from './OrderRow';
import adminStyles from '../admin.module.css';
import styles from './orders.module.css';

export const dynamic = 'force-dynamic';

const STATUS_TABS = [
  { value: '', label: 'Всички' },
  { value: 'pending', label: 'Нови' },
  { value: 'confirmed', label: 'Потвърдени' },
  { value: 'shipped', label: 'Изпратени' },
  { value: 'delivered', label: 'Доставени' },
  { value: 'cancelled', label: 'Сторнирани' },
];

export default async function AdminOrdersPage({ searchParams }) {
  const { status } = (await searchParams) ?? {};
  const supabase = supabaseServer();

  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: orders, error } = await query;

  if (error) {
    return <div className={adminStyles.placeholder}>Грешка при зареждане: {error.message}</div>;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        {STATUS_TABS.map((tab) => (
          <a
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`${styles.filterLink} ${(status ?? '') === tab.value ? styles.filterActive : ''}`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>Няма поръчки{status ? ' в тази категория' : ' засега'}.</div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
