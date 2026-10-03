import Link from 'next/link';
import { t, pickText, formatPriceEur, translateCategory } from '../lib/i18n';
import styles from './ProductCard.module.css';

export { formatPriceEur };

export default function ProductCard({ product, lang, categoryMap }) {
  const inStock = product.stock_qty > 0;
  const name = pickText(product, 'name', lang);
  const category = translateCategory(product.category, lang, categoryMap);

  return (
    <Link href={`/catalog/${product.slug}`} className={`card ${styles.card}`}>
      <div className={styles.thumb}>
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={name} loading="lazy" />
        ) : (
          t(lang, 'catalog.noImage')
        )}
      </div>
      <div className={styles.body}>
        {category && <span className={styles.category}>{category}</span>}
        <span className={styles.name}>{name}</span>
        {!inStock && <span className={styles.outOfStock}>{t(lang, 'catalog.outOfStock')}</span>}
        <span className={styles.price}>{formatPriceEur(product.price_cents, lang)}</span>
      </div>
    </Link>
  );
}
