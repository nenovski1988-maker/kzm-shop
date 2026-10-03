'use client';

import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { useLanguage } from '../lib/languageContext';
import { formatPriceEur } from '../components/ProductCard';
import styles from './cart.module.css';

export default function CartView() {
  const { items, loaded, removeItem, totalCents } = useCart();
  const { t, lang } = useLanguage();

  if (!loaded) return null; // избягва "мигане" преди localStorage да се зареди

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <h1>{t('cart.title')}</h1>
        <div className={styles.empty}>
          {t('cart.empty')}{' '}
          <Link href="/catalog" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            {t('cart.browse')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1>{t('cart.title')}</h1>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.productId}>
            <div className={styles.thumb}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} />
              ) : (
                t('cart.noImage')
              )}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.unitPrice}>{formatPriceEur(item.priceCents, lang)} {t('cart.perUnit')}</div>
            </div>
            {/* Количеството се избира само на продуктовата страница (където е
                ограничено до наличността) — в количката е фиксирано, не се
                редактира, за да няма риск от надвишаване на наличността. */}
            <div className={styles.qtyFixed}>× {item.qty}</div>
            <div className={styles.lineTotal}>{formatPriceEur(item.priceCents * item.qty, lang)}</div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeItem(item.productId)}
              aria-label={t('cart.removeLabel')}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span>{t('cart.total')}</span>
        <span>{formatPriceEur(totalCents, lang)}</span>
      </div>

      <div className={styles.actions}>
        <Link href="/catalog" className="btn btn-ghost">{t('cart.continueShopping')}</Link>
        <Link href="/checkout" className="btn btn-primary">{t('cart.checkout')}</Link>
      </div>
    </div>
  );
}
