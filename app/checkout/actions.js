'use server';

import { supabaseServer } from '../lib/supabaseServer';
import { sendEmail } from '../lib/resend';
import { orderNotificationEmail, orderConfirmationEmail } from '../lib/emailTemplates';

const OWNER_NOTIFICATION_EMAIL = 'info@kzm.bg';

// Вика атомичната Postgres функция create_order (supabase/002_checkout_function.sql).
// Цените НЕ се вярват от клиента — функцията винаги чете текущата цена от
// таблица products вътре в транзакцията, затова ѝ подаваме само product_id + qty.
//
// ВАЖНО: НЕ хвърляме (throw) грешки оттук. Next.js в production маскира
// съобщенията на хвърлени грешки от Server Actions (по съображения за
// сигурност) и клиентът вижда само безсмислен "Minified React error" номер.
// Затова очакваните грешки (празни полета, недостатъчна наличност) се
// връщат като обикновена стойност { success: false, message } — по
// препоръчания от Next.js начин — и UI-то ги показва директно.
export async function createOrder(customer, cartItems) {
  try {
    if (!customer?.name?.trim()) return { success: false, message: 'Името е задължително.' };
    if (!customer?.phone?.trim()) return { success: false, message: 'Телефонът е задължителен.' };
    if (!cartItems || cartItems.length === 0) return { success: false, message: 'Количката е празна.' };

    if (customer.deliveryMethod === 'courier') {
      if (!customer.address?.trim() || !customer.city?.trim()) {
        return { success: false, message: 'Адрес и град са задължителни за доставка с куриер.' };
      }
    } else if (customer.deliveryMethod === 'pickup') {
      if (!customer.office?.trim()) {
        return { success: false, message: 'Избери офис на куриер за получаване.' };
      }
    } else {
      return { success: false, message: 'Избери начин на доставка.' };
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
      console.error('[createOrder] Supabase RPC грешка:', error.message);
      return { success: false, message: error.message.replace(/^.*?: /, '') };
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.order_id) {
      console.error('[createOrder] create_order не върна order_id:', data);
      return { success: false, message: 'Нещо се обърка при записването на поръчката. Опитай отново.' };
    }

    const orderResult = { orderId: result.order_id, totalCents: result.total_cents };

    // Имейлите са "best effort" — не бива да провалят вече записаната поръчка,
    // ако Resend временно не отговори.
    const emailCustomer = {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      deliveryMethod: customer.deliveryMethod,
      courier: customer.courier || '',
      address: customer.address || '',
      city: customer.city || '',
      office: customer.office || '',
      notes: customer.notes || '',
    };
    const emailItems = cartItems.map((i) => ({
      name: i.name || 'Продукт',
      qty: i.qty,
      priceCents: i.priceCents || 0,
    }));

    // sendEmail() никога не хвърля грешка нататък (виж app/lib/resend.js), но
    // ги изчакваме (await), за да не ги "отреже" сървърът преди да излетят —
    // нещо, което се случва с "забравени" промиси в serverless среда (Vercel).
    const notification = orderNotificationEmail({ ...orderResult, customer: emailCustomer, items: emailItems });
    await sendEmail({ to: OWNER_NOTIFICATION_EMAIL, subject: notification.subject, html: notification.html });

    if (emailCustomer.email) {
      const confirmation = orderConfirmationEmail({ ...orderResult, customer: emailCustomer, items: emailItems });
      await sendEmail({ to: emailCustomer.email, subject: confirmation.subject, html: confirmation.html });
    }

    return { success: true, ...orderResult };
  } catch (err) {
    // Всяка неочаквана (програмна) грешка попада тук, вместо да изтече нагоре
    // като "throw" и да се маскира от Next.js в production.
    console.error('[createOrder] неочаквана грешка:', err);
    return { success: false, message: 'Възникна неочаквана грешка. Опитай отново или се свържи с нас.' };
  }
}
