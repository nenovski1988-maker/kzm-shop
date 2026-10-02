import { supabasePublic } from '../lib/supabasePublic';
import ProductCard from '../components/ProductCard';
import styles from './catalog.module.css';

export const metadata = { title: 'Продукти' };
// force-dynamic (вместо ISR revalidate) — build-ът не изисква реални Supabase
// данни по време на build, а страницата винаги показва текущата наличност.
export const dynamic = 'force-dynamic';

export default async function CatalogPage({ searchParams }) {
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
        <p>Възникна грешка при зареждане на продуктите. Опитай отново по-късно.</p>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const filtered = category ? products.filter((p) => p.category === category) : products;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
          КЗМ Магазин
        </div>
        <h1>Продукти</h1>
        <p>Инструменти, превантивни и лечебни средства за копитен здравен мениджмънт.</p>
      </div>

      {categories.length > 0 && (
        <div className={styles.filters}>
          <a href="/catalog" className={`${styles.filterLink} ${!category ? styles.filterActive : ''}`}>
            Всички
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/catalog?category=${encodeURIComponent(cat)}`}
              className={`${styles.filterLink} ${category === cat ? styles.filterActive : ''}`}
            >
              {cat}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {products.length === 0
            ? 'Засега няма добавени продукти — очаквайте скоро.'
            : 'Няма продукти в тази категория.'}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
