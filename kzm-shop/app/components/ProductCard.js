import Link from 'next/link';
import styles from './ProductCard.module.css';

export function formatPriceEur(cents) {
  return (cents / 100).toLocaleString('bg-BG', { style: 'currency', currency: 'EUR' });
}

export default function ProductCard({ product }) {
  const inStock = product.stock_qty > 0;

  return (
    <Link href={`/catalog/${product.slug}`} className={`card ${styles.card}`}>
      <div className={styles.thumb}>
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          'няма снимка'
        )}
      </div>
      <div className={styles.body}>
        {product.category && <span className={styles.category}>{product.category}</span>}
        <span className={styles.name}>{product.name}</span>
        {!inStock && <span className={styles.outOfStock}>Изчерпан</span>}
        <span className={styles.price}>{formatPriceEur(product.price_cents)}</span>
      </div>
    </Link>
  );
}
