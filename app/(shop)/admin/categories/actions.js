'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '../../lib/supabaseServer';

// Формата (page.js) праща по едно поле "en__<категория>" за всеки ред —
// затова тук не пазим предварителен списък от категории, просто минаваме
// през каквото е дошло и upsert-ваме. Празен превод = category_en: null
// (витрината тогава пада към българското име, виж lib/i18n.js translateCategory).
export async function saveCategoryTranslations(formData) {
  const rows = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('en__')) continue;
    const category = key.slice(4);
    if (!category) continue;
    const categoryEn = String(value).trim();
    rows.push({ category, category_en: categoryEn || null });
  }

  if (rows.length === 0) return;

  const supabase = supabaseServer();
  const { error } = await supabase
    .from('category_translations')
    .upsert(rows, { onConflict: 'category' });

  if (error) {
    throw new Error(`Грешка при запис на преводите на категориите: ${error.message}`);
  }

  // Освежава кеша на admin страницата и на витрината, където се показват категориите.
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
  revalidatePath('/');
}
