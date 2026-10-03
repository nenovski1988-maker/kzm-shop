import { notFound } from 'next/navigation';
import { supabasePublic } from '../../lib/supabasePublic';
import { formatPriceEur } from '../../components/ProductCard';
import { t, pickText, translateCategory } from '../../lib/i18n';
import { getLang } from '../../lib/lang';
import { getCategoryMap } from '../../lib/categories';
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
  const lang = await getLang();
  const product = await getProduct(slug);
  if (!product) return { title: t(lang, 'product.notFoundTitle') };

  const name = pickText(product, 'name', lang);
  const description = pickText(product, 'description', lang);

  return {
    title: name,
    description: description || t(lang, 'product.metaFallback')(name),
    openGraph: {
      title: name,
      description: description || undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const lang = await getLang();
  const [product, categoryMap] = await Promise.all([getProduct(slug), getCategoryMap()]);

  if (!product) {
    notFound();
  }

  const name = pickText(product, 'name', lang);
  const description = pickText(product, 'description', lang);
  const category = translateCategory(product.category, lang, categoryMap);

  const stockLabel =
    product.stock_qty <= 0
      ? t(lang, 'product.stockOut')
      : product.stock_qty <= 3
      ? t(lang, 'product.stockLow')(product.stock_qty)
      : t(lang, 'product.stockIn')(product.stock_qty);

  const stockClass =
    product.stock_qty <= 0 ? styles.stockOut : product.stock_qty <= 3 ? styles.stockLow : styles.stockIn;

  return (
    <div className={styles.wrap}>
      <a href="/catalog" className={styles.back}>{t(lang, 'product.back')}</a>

      <div className={styles.layout}>
        <ProductGallery images={product.images} name={name} />

        <div>
          {category && <div className={styles.category}>{category}</div>}
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.price}>{formatPriceEur(product.price_cents, lang)}</div>
          <div className={`${styles.stock} ${stockClass}`}>{stockLabel}</div>

          {product.sku && <div className={styles.sku}>{t(lang, 'product.skuLabel')} {product.sku}</div>}

          {description && <p className={styles.description}>{description}</p>}

          <AddToCartButton product={product} name={name} />
        </div>
      </div>
    </div>
  );
}
