'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus, cancelOrder } from './actions';
import styles from './orders.module.css';

const STATUS_LABELS = {
  pending: 'Нова',
  confirmed: 'Потвърдена',
  shipped: 'Изпратена',
  delivered: 'Доставена',
  cancelled: 'Сторнирана',
};

const STATUS_CLASSES = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  shipped: styles.statusShipped,
  delivered: styles.statusDelivered,
  cancelled: styles.statusCancelled,
};

const DELIVERY_LABELS = { courier: 'До адрес', pickup: 'До офис на куриер' };

function formatPriceEur(cents) {
  return (cents / 100).toLocaleString('bg-BG', { style: 'currency', currency: 'EUR' });
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('bg-BG', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OrderRow({ order }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleStatusChange(e) {
    const status = e.target.value;
    setError('');
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, status);
        router.refresh();
      } catch (err) {
        setError(err.message);
      }
    });
  }

  function handleCancel() {
    if (!window.confirm('Сигурен ли си, че искаш да сторнираш тази поръчка? Наличността ще бъде върната.')) return;
    setError('');
    startTransition(async () => {
      try {
        await cancelOrder(order.id);
        router.refresh();
      } catch (err) {
        setError(err.message);
      }
    });
  }

  const isCancelled = order.status === 'cancelled';

  return (
    <div className={styles.order}>
      <div className={styles.summaryRow} onClick={() => setOpen((o) => !o)}>
        <div className={styles.summaryMain}>
          <div className={styles.customer}>{order.customer_name || '(без име)'}</div>
          <div className={styles.meta}>
            {formatDate(order.created_at)} · {order.customer_phone}
          </div>
        </div>
        <span className={`${styles.badge} ${STATUS_CLASSES[order.status] ?? ''}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <div className={styles.total}>{formatPriceEur(order.total_cents)}</div>
      </div>

      {open && (
        <div className={styles.details}>
          {error && <div style={{ color: '#B3362C', marginBottom: '0.6rem' }}>{error}</div>}

          <dl className={styles.detailsGrid}>
            <div>
              <dt>Доставка</dt>
              <dd>{DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method}{order.courier ? ` — ${order.courier}` : ''}</dd>
            </div>
            <div>
              <dt>Адрес / Офис</dt>
              <dd>
                {order.delivery_method === 'courier'
                  ? `${order.delivery_city ?? ''}, ${order.delivery_address ?? ''}`
                  : order.delivery_office}
              </dd>
            </div>
            {order.customer_email && (
              <div>
                <dt>Имейл</dt>
                <dd>{order.customer_email}</dd>
              </div>
            )}
            <div>
              <dt>Плащане</dt>
              <dd>Наложен платеж</dd>
            </div>
          </dl>

          <div className={styles.items}>
            {order.order_items?.map((item) => (
              <div className={styles.itemRow} key={item.id}>
                <span>{item.product_name} × {item.qty}</span>
                <span>{formatPriceEur(item.line_total_cents)}</span>
              </div>
            ))}
          </div>

          {order.notes && <div className={styles.notes}>„{order.notes}“</div>}

          <div className={styles.actions}>
            <select value={order.status} onChange={handleStatusChange} disabled={isPending || isCancelled}>
              {Object.entries(STATUS_LABELS)
                .filter(([key]) => key !== 'cancelled')
                .map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
            </select>
            {!isCancelled && (
              <button type="button" className={styles.cancelBtn} onClick={handleCancel} disabled={isPending}>
                Сторнирай
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
