// Транслитерация на кирилица → латиница за URL slug-ове (напр. продуктови
// адреси). Използва стандартната българска транслитерационна таблица.
const BG_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's',
  т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht',
  ъ: 'a', ь: 'y', ю: 'yu', я: 'ya',
};

export function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .split('')
    .map((ch) => BG_MAP[ch] ?? ch)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // маха латински диакритични знаци, ако има
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Добавя кратък случаен суфикс при конфликт на slug (напр. "produkt-7k2p")
export function slugifyWithSuffix(text) {
  const base = slugify(text);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
