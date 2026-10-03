'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateStock } from './actions';
import styles from './stock.module.css';

const LOW_STOCK_THRESHOLD = 3;

export default function StockRow({ product }) {
  const router = useRouter();
  const [value, setValue] = useState(product.stock_qty);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const dirty = parseInt(value, 10) !== product.stock_qty;

  function handleSave() {
    setError('');
    startTransition(async () => {
      try {
        await updateStock(product.id, value);
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 1500);
      } catch (err) {
        setError(err.message);
      }
    });
  }

  return (
    <tr>
      <td>
        <div className={styles.name}>{product.name}</div>
        {error && <div style={{ color: '#B3362C', fontSize: '0.76rem' }}>{error}</div>}
      </td>
      <td className={styles.sku}>{product.sku || '—'}</td>
      <td>
        <div className={styles.row}>
          <input
            type="number"
            min="0"
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {product.stock_qty <= LOW_STOCK_THRESHOLD && (
            <span className={styles.lowBadge}>ниска наличност</span>
          )}
        </div>
      </td>
      <td>
        {saved ? (
          <span className={styles.saved}>Запазено ✓</span>
        ) : (
          <button
            type="button"
            className={`btn btn-ghost ${styles.saveBtn}`}
            onClick={handleSave}
            disabled={!dirty || isPending}
          >
            {isPending ? '…' : 'Запази'}
          </button>
        )}
      </td>
    </tr>
  );
}
