function formatEur(cents) {
  return ((cents || 0) / 100).toLocaleString('bg-BG', { style: 'currency', currency: 'EUR' });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function itemsRows(items) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(i.name)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${formatEur(i.priceCents * i.qty)}</td>
      </tr>`
    )
    .join('');
}

function deliveryBlock(customer) {
  if (customer.deliveryMethod === 'pickup') {
    return `<p><strong>Доставка:</strong> до офис на куриер „${escapeHtml(customer.courier)}“ — ${escapeHtml(customer.office)}</p>`;
  }
  return `<p><strong>Доставка:</strong> до адрес, куриер „${escapeHtml(customer.courier)}“<br>${escapeHtml(customer.address)}, ${escapeHtml(customer.city)}</p>`;
}

// Известие към собственика (info@kzm.bg) за нова поръчка.
export function orderNotificationEmail({ orderId, totalCents, customer, items }) {
  const shortId = String(orderId).slice(0, 8);
  return {
    subject: `Нова поръчка #${shortId} — КЗМ Магазин`,
    html: `
      <div style="font-family:Verdana,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
        <h2 style="color:#1f5c38;">Нова поръчка от магазина</h2>
        <p><strong>Поръчка №:</strong> ${shortId}</p>
        <p><strong>Клиент:</strong> ${escapeHtml(customer.name)}<br>
        <strong>Телефон:</strong> ${escapeHtml(customer.phone)}${customer.email ? `<br><strong>Имейл:</strong> ${escapeHtml(customer.email)}` : ''}</p>
        ${deliveryBlock(customer)}
        ${customer.notes ? `<p><strong>Бележка:</strong> ${escapeHtml(customer.notes)}</p>` : ''}
        <table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #1f5c38;">Артикул</th>
              <th style="text-align:center;padding:6px 10px;border-bottom:2px solid #1f5c38;">Бр.</th>
              <th style="text-align:right;padding:6px 10px;border-bottom:2px solid #1f5c38;">Сума</th>
            </tr>
          </thead>
          <tbody>${itemsRows(items)}</tbody>
        </table>
        <p style="text-align:right;font-size:1.05rem;margin-top:8px;"><strong>Общо: ${formatEur(totalCents)}</strong></p>
        <p style="color:#777;font-size:0.82rem;margin-top:16px;">Плащане: наложен платеж. Виж и управлявай поръчката в админ панела (/admin/orders).</p>
      </div>
    `,
  };
}

// Потвърждение към клиента, само ако е оставил имейл при поръчката.
export function orderConfirmationEmail({ orderId, totalCents, customer, items }) {
  const shortId = String(orderId).slice(0, 8);
  return {
    subject: `Потвърждение на поръчка #${shortId} — КЗМ`,
    html: `
      <div style="font-family:Verdana,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
        <h2 style="color:#1f5c38;">Благодарим за поръчката!</h2>
        <p>Здравей, ${escapeHtml(customer.name)},</p>
        <p>Получихме поръчка № <strong>${shortId}</strong> и ще се свържем с теб на <strong>${escapeHtml(customer.phone)}</strong> за потвърждение на доставката.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #1f5c38;">Артикул</th>
              <th style="text-align:center;padding:6px 10px;border-bottom:2px solid #1f5c38;">Бр.</th>
              <th style="text-align:right;padding:6px 10px;border-bottom:2px solid #1f5c38;">Сума</th>
            </tr>
          </thead>
          <tbody>${itemsRows(items)}</tbody>
        </table>
        <p style="text-align:right;font-size:1.05rem;margin-top:8px;"><strong>Общо: ${formatEur(totalCents)}</strong></p>
        <p style="margin-top:8px;">Плащане: наложен платеж при доставка.</p>
        <p style="color:#777;font-size:0.82rem;margin-top:16px;">КЗМ ЕООД — <a href="https://kzm.bg" style="color:#1f5c38;">kzm.bg</a></p>
      </div>
    `,
  };
}

// Dev-request форма от /admin/site, към Миро.
export function devRequestEmail({ name, message, page }) {
  return {
    subject: `[KZM Shop] Заявка от екипа${page ? ` — ${page}` : ''}`,
    html: `
      <div style="font-family:Verdana,Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
        <h2 style="color:#1f5c38;">Заявка за промяна в магазина</h2>
        ${name ? `<p><strong>От:</strong> ${escapeHtml(name)}</p>` : ''}
        ${page ? `<p><strong>Раздел:</strong> ${escapeHtml(page)}</p>` : ''}
        <p style="white-space:pre-wrap;border-left:3px solid #1f5c38;padding-left:10px;">${escapeHtml(message)}</p>
      </div>
    `,
  };
}
