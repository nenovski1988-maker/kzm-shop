'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { formatPriceEur } from '../components/ProductCard';
import { getLiveStock } from './actions';
import styles from './cart.module.css';

export default function CartView() {
  const { items, loaded, updateQty, removeItem, totalCents } = useCart();
  const [liveStock, setLiveStock] = useState({});

  const productIdsKey = useMemo(() => items.map((i) => i.productId).join(','), [items]);

  // Винаги дърпа актуалната наличност при отваряне на количката — не разчита
  // само на "снимката", взета в момента на добавяне (която може да е
  // остаряла или да липсва за по-стари артикули в localStorage).
  useEffect(() => {
    if (!loaded || !productIdsKey) return;
    getLiveStock(productIdsKey.split(',')).then(setLiveStock);
  }, [loaded, productIdsKey]);

  // Ако количеството в количката вече е НАД реалната наличност (напр. куплен
  // е още преди тя да спадне, или е останало от по-стар тест), веднага го
  // сваля до наличния брой — не само блокира "+" за в бъдеще.
  useEffect(() => {
    items.forEach((item) => {
      const max = liveStock[item.productId];
      if (max != null && item.qty > max) {
        updateQty(item.productId, max);
      }
    });
  }, [liveStock, items, updateQty]);

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
        {items.map((item) => {
          // Приоритет: жива наличност от сървъра (liveStock) → снимката,
          // записана при добавяне (item.stockQty) → неограничено, докато се зареди.
          const maxQty = liveStock[item.productId] ?? item.stockQty ?? Infinity;
          const atMax = item.qty >= maxQty;
          return (
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
                onClick={() => updateQty(item.productId, Math.min(item.qty + 1, maxQty))}
                disabled={atMax}
                aria-label="Увеличи количеството"
              >
                +
              </button>
              {Number.isFinite(maxQty) && atMax && (
                <span className={styles.stockNote}>налични {maxQty} бр.</span>
              )}
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
          );
        })}
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
