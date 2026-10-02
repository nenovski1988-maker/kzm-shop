import { notFound } from 'next/navigation';
import { supabasePublic } from '../../lib/supabasePublic';
import { formatPriceEur } from '../../components/ProductCard';
import ProductGallery from './ProductGallery';
import AddToCartButton from './AddToCartButton';
import styles from './product.module.css';

// force-dynamic — виж бележката в app/catalog/page.js
export const dynamic = 'force-dynamic';

async function getProduct(slug) {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Продуктът не е намерен' };

  return {
    title: product.name,
    description: product.description || `${product.name} — КЗМ Магазин`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const stockLabel =
    product.stock_qty <= 0
      ? 'Изчерпан'
      : product.stock_qty <= 3
      ? `Ограничена наличност — ${product.stock_qty} бр.`
      : `Наличен — ${product.stock_qty} бр.`;

  const stockClass =
    product.stock_qty <= 0 ? styles.stockOut : product.stock_qty <= 3 ? styles.stockLow : styles.stockIn;

  return (
    <div className={styles.wrap}>
      <a href="/catalog" className={styles.back}>← Обратно към продуктите</a>

      <div className={styles.layout}>
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.category && <div className={styles.category}>{product.category}</div>}
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>{formatPriceEur(product.price_cents)}</div>
          <div className={`${styles.stock} ${stockClass}`}>{stockLabel}</div>

          {product.sku && <div className={styles.sku}>Арт. номер: {product.sku}</div>}

          {product.description && <p className={styles.description}>{product.description}</p>}

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
