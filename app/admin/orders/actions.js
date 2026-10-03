'use server';

import { supabaseServer } from '../../lib/supabaseServer';

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export async function updateOrderStatus(id, status) {
  if (!id) throw new Error('Липсва ID на поръчка.');
  if (!VALID_STATUSES.includes(status)) throw new Error('Невалиден статус.');

  const supabase = supabaseServer();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);

  if (error) throw new Error(`Грешка при запис: ${error.message}`);
  return { ok: true };
}

export async function cancelOrder(id) {
  if (!id) throw new Error('Липсва ID на поръчка.');

  const supabase = supabaseServer();

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(`Грешка: ${fetchError.message}`);
  if (order.status === 'cancelled') throw new Error('Поръчката вече е сторнирана.');

  // Връща наличността на всички артикули от поръчката
  const { error: restoreError } = await supabase.rpc('restore_stock', { p_order_id: id });
  if (restoreError) throw new Error(`Грешка при връщане на наличност: ${restoreError.message}`);

  const { error: statusError } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (statusError) throw new Error(`Грешка при запис на статус: ${statusError.message}`);
  return { ok: true };
}
