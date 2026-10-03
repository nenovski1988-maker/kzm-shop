'use server';

import { supabasePublic } from '../lib/supabasePublic';

// Връща актуалната наличност за дадени продукти (само тези, видими във
// витрината — active = true, по RLS policy-то). Ползва се от CartView, за
// да ограничи +/- бутоните до РЕАЛНАТА, текуща наличност — не до "снимка"
// от момента на добавяне в количката, която може да е остаряла (количката
// живее в localStorage, стоката може да намалее междувременно).
export async function getLiveStock(productIds) {
  if (!productIds || productIds.length === 0) return {};

  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from('products')
    .select('id, stock_qty, active')
    .in('id', productIds);

  if (error || !data) return {};

  const stockById = {};
  for (const p of data) {
    // Ако продуктът вече не е активен (скрит от админа), трета го като 0 налични.
    stockById[p.id] = p.active ? p.stock_qty : 0;
  }
  return stockById;
}
