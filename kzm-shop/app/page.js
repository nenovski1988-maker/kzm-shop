import Link from 'next/link';
import { supabasePublic } from './lib/supabasePublic';
import ProductCard from './components/ProductCard';
import styles from './page.module.css';

// force-dynamic (vs. ISR revalidate) so the build doesn't need live Supabase
// credentials at build time, and the homepage always shows current stock.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
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
        КЗМ Магазин
      </div>
      <h1>Продукти за здрави копита</h1>
      <p>
        Инструменти, превантивни и лечебни средства за копитен здравен мениджмънт
        на говеда — директно от КЗМ ЕООД.
      </p>
      <Link href="/catalog" className="btn btn-primary" style={{ marginBottom: '3rem' }}>
        Разгледай продуктите
      </Link>

      {products && products.length > 0 && (
        <div className={styles.featured}>
          <div className={styles.featuredGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
