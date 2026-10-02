'use server';

import { supabaseServer } from '../lib/supabaseServer';

// Вика атомичната Postgres функция create_order (supabase/002_checkout_function.sql).
// Цените НЕ се вярват от клиента — функцията винаги чете текущата цена от
// таблица products вътре в транзакцията, затова ѝ подаваме само product_id + qty.
export async function createOrder(customer, cartItems) {
  if (!customer?.name?.trim()) throw new Error('Името е задължително.');
  if (!customer?.phone?.trim()) throw new Error('Телефонът е задължителен.');
  if (!cartItems || cartItems.length === 0) throw new Error('Количката е празна.');

  if (customer.deliveryMethod === 'courier') {
    if (!customer.address?.trim() || !customer.city?.trim()) {
      throw new Error('Адрес и град са задължителни за доставка с куриер.');
    }
  } else if (customer.deliveryMethod === 'pickup') {
    if (!customer.office?.trim()) {
      throw new Error('Избери офис на куриер за получаване.');
    }
  } else {
    throw new Error('Избери начин на доставка.');
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase.rpc('create_order', {
    p_customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      delivery_method: customer.deliveryMethod,
      courier: customer.courier || '',
      address: customer.address || '',
      city: customer.city || '',
      office: customer.office || '',
      payment_method: 'cod',
      notes: customer.notes || '',
    },
    p_items: cartItems.map((i) => ({ product_id: i.productId, qty: i.qty })),
  });

  if (error) {
    // Postgres "raise exception" съобщенията (напр. недостатъчна наличност)
    // идват четливи на български в error.message благодарение на RAISE EXCEPTION текста в SQL функцията.
    throw new Error(error.message.replace(/^.*?: /, ''));
  }

  const result = Array.isArray(data) ? data[0] : data;
  return { orderId: result.order_id, totalCents: result.total_cents };
}
