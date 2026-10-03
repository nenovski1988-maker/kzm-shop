'use client';

import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { formatPriceEur } from '../components/ProductCard';
import styles from './cart.module.css';

export default function CartView() {
  const { items, loaded, updateQty, removeItem, totalCents } = useCart();

  if (!loaded) return null; // избягва "мигане" преди localStorage да се зареди

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <h1>Кошница</h1>
        <div className={styles.empty}>
          Количката е празна.{' '}
          <Link href="/catalog" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            Разгледай продуктите →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1>Кошница</h1>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.productId}>
            <div className={styles.thumb}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} />
              ) : (
                'без снимка'
              )}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.unitPrice}>{formatPriceEur(item.priceCents)} / бр.</div>
            </div>
            <div className={styles.qtyControls}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => updateQty(item.productId, item.qty - 1)}
                aria-label="Намали количеството"
              >
                −
              </button>
              <span className={styles.qtyValue}>{item.qty}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => updateQty(item.productId, item.qty + 1)}
                aria-label="Увеличи количеството"
              >
                +
              </button>
            </div>
            <div className={styles.lineTotal}>{formatPriceEur(item.priceCents * item.qty)}</div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeItem(item.productId)}
              aria-label="Премахни от количката"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span>Общо:</span>
        <span>{formatPriceEur(totalCents)}</span>
      </div>

      <div className={styles.actions}>
        <Link href="/catalog" className="btn btn-ghost">← Продължи пазаруването</Link>
        <Link href="/checkout" className="btn btn-primary">Към поръчка</Link>
      </div>
    </div>
  );
}
