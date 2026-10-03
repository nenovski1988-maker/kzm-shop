'use server';

import { supabaseServer } from '../../lib/supabaseServer';

export async function updateStock(id, qty) {
  if (!id) throw new Error('Липсва ID на продукт.');
  const parsed = parseInt(qty, 10);
  if (Number.isNaN(parsed) || parsed < 0) throw new Error('Невалидно количество.');

  const supabase = supabaseServer();
  const { error } = await supabase.from('products').update({ stock_qty: parsed }).eq('id', id);

  if (error) throw new Error(`Грешка при запис: ${error.message}`);
  return { ok: true };
}
