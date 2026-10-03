import { supabasePublic } from '../lib/supabasePublic';
import ProductCard from '../components/ProductCard';
import { t, translateCategory } from '../lib/i18n';
import { getLang } from '../lib/lang';
import { getCategoryMap } from '../lib/categories';
import styles from './catalog.module.css';

export async function generateMetadata() {
  const lang = await getLang();
  return { title: t(lang, 'catalog.metaTitle') };
}

// force-dynamic (вместо ISR revalidate) — build-ът не изисква реални Supabase
// данни по време на build, а страницата винаги показва текущата наличност.
export const dynamic = 'force-dynamic';

export default async function CatalogPage({ searchParams }) {
  const lang = await getLang();
  const categoryMap = await getCategoryMap();
  const { category } = (await searchParams) ?? {};
  const supabase = supabasePublic();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className={`container ${styles.wrap}`}>
        <p>{t(lang, 'catalog.loadError')}</p>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const filtered = category ? products.filter((p) => p.category === category) : products;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
          {t(lang, 'catalog.tag')}
        </div>
        <h1>{t(lang, 'catalog.title')}</h1>
        <p>{t(lang, 'catalog.lead')}</p>
      </div>

      {categories.length > 0 && (
        <div className={styles.filters}>
          <a href="/catalog" className={`${styles.filterLink} ${!category ? styles.filterActive : ''}`}>
            {t(lang, 'catalog.all')}
          </a>
          {categories.map((cat) => (
            // href пази оригиналната (BG) категория — така филтрирането по
            // products.category работи независимо от избрания език; само
            // показваният текст се превежда.
            <a
              key={cat}
              href={`/catalog?category=${encodeURIComponent(cat)}`}
              className={`${styles.filterLink} ${category === cat ? styles.filterActive : ''}`}
            >
              {translateCategory(cat, lang, categoryMap)}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {products.length === 0 ? t(lang, 'catalog.emptyNone') : t(lang, 'catalog.emptyCategory')}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} lang={lang} categoryMap={categoryMap} />
          ))}
        </div>
      )}
    </div>
  );
}
