import { supabasePublic } from './supabasePublic';

// Чете таблицата category_translations (BG категория → EN превод) за
// публичната витрина. Таблицата е малка (колкото различни категории
// ползваш) и публично читаема през RLS policy — виж
// supabase/004_category_translations.sql. Записва/редактира само
// /admin/categories (service role, отделна заявка през supabaseServer).
export async function getCategoryMap() {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from('category_translations')
    .select('category, category_en');

  if (error || !data) return {};

  const map = {};
  for (const row of data) {
    if (row.category_en && row.category_en.trim()) {
      map[row.category] = row.category_en.trim();
    }
  }
  return map;
}
