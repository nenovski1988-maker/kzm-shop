import Link from 'next/link';
import { supabasePublic } from './lib/supabasePublic';
import ProductCard from './components/ProductCard';
import { t } from './lib/i18n';
import { getLang } from './lib/lang';
import { getCategoryMap } from './lib/categories';
import styles from './page.module.css';

// force-dynamic (vs. ISR revalidate) so the build doesn't need live Supabase
// credentials at build time, and the homepage always shows current stock.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const lang = await getLang();
  const categoryMap = await getCategoryMap();
  const supabase = supabasePublic();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className={styles.hero}>
      <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
        {t(lang, 'home.tag')}
      </div>
      <h1>{t(lang, 'home.title')}</h1>
      <p>{t(lang, 'home.lead')}</p>
      <Link href="/catalog" className="btn btn-primary" style={{ marginBottom: '3rem' }}>
        {t(lang, 'home.cta')}
      </Link>

      {products && products.length > 0 && (
        <div className={styles.featured}>
          <div className={styles.featuredGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} categoryMap={categoryMap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
