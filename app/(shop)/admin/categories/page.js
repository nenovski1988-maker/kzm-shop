import { supabaseServer } from '../../lib/supabaseServer';
import { saveCategoryTranslations } from './actions';
import adminStyles from '../admin.module.css';
import styles from './categories.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = supabaseServer();

  // Категориите не са отделна таблица (виж коментара в supabase/schema.sql
  // при products.category) — извеждаме списъка от самите продукти.
  const { data: products } = await supabase.from('products').select('category');
  const categories = [...new Set((products || []).map((p) => p.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'bg')
  );

  const { data: translations } = await supabase
    .from('category_translations')
    .select('category, category_en');
  const map = {};
  (translations || []).forEach((row) => {
    map[row.category] = row.category_en || '';
  });

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem', color: 'var(--g1)' }}>Превод на категориите (EN)</h2>
      <p className={adminStyles.placeholder} style={{ marginBottom: '1.5rem' }}>
        Тук въвеждаш английското име на всяка категория, която вече ползваш по продуктите —
        за да се показва правилно, когато посетителят превключи сайта на EN. Остави поле
        празно, за да покаже българското име и в EN режим.
      </p>

      {categories.length === 0 ? (
        <div className={adminStyles.placeholder}>
          Още няма зададени категории по продуктите — добави категория на продукт в
          /admin/products и тя ще се появи тук.
        </div>
      ) : (
        <form action={saveCategoryTranslations} className={styles.form}>
          {categories.map((cat) => (
            <div className={styles.row} key={cat}>
              <label className={styles.bgLabel} htmlFor={`cat-${cat}`}>{cat}</label>
              <input
                id={`cat-${cat}`}
                type="text"
                name={`en__${cat}`}
                defaultValue={map[cat] || ''}
                placeholder="EN превод"
                className={styles.input}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Запази преводите
          </button>
        </form>
      )}
    </div>
  );
}
