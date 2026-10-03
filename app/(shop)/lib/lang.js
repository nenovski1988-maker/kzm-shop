// Сървърен помощник за текущия избран език — чете cookie "kzm_lang".
// Ползва се само в Server Components / generateMetadata (не в 'use client'
// файлове — там е lib/languageContext.js).
import { cookies } from 'next/headers';
import { normalizeLang, LANG_COOKIE } from './i18n';

export { LANG_COOKIE };

export async function getLang() {
  const store = await cookies();
  return normalizeLang(store.get(LANG_COOKIE)?.value);
}
