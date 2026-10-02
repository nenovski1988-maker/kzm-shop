'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { slugify, slugifyWithSuffix } from '../../lib/slugify';

function normalizeProductInput(data) {
  const priceEur = parseFloat(data.priceEur);
  const stockQty = parseInt(data.stockQty, 10);

  if (!data.name || !data.name.trim()) {
    throw new Error('Името на продукта е задължително.');
  }
  if (Number.isNaN(priceEur) || priceEur < 0) {
    throw new Error('Цената трябва да е валидно положително число.');
  }

  return {
    name: data.name.trim(),
    sku: data.sku?.trim() || null,
    category: data.category?.trim() || null,
    description: data.description?.trim() || null,
    price_cents: Math.round(priceEur * 100),
    stock_qty: Number.isNaN(stockQty) ? 0 : Math.max(0, stockQty),
    images: Array.isArray(data.images) ? data.images : [],
    active: Boolean(data.active),
  };
}

export async function createProduct(data) {
  const supabase = supabaseServer();
  const payload = normalizeProductInput(data);
  const requestedSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name);

  let slug = requestedSlug || slugifyWithSuffix(data.name);

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: inserted, error } = await supabase
      .from('products')
      .insert({ ...payload, slug })
      .select('id')
      .single();

    if (!error) {
      return { id: inserted.id };
    }

    if (error.code === '23505') {
      // slug (или sku) конфликт — пробвай с нов suffix на slug-а
      slug = slugifyWithSuffix(data.name);
      continue;
    }

    throw new Error(`Грешка при запис: ${error.message}`);
  }

  throw new Error('Неуспешен опит за уникален адрес (slug) след няколко опита.');
}

export async function updateProduct(id, data) {
  if (!id) throw new Error('Липсва ID на продукт.');

  const supabase = supabaseServer();
  const payload = normalizeProductInput(data);
  const slug = data.slug?.trim() ? slugify(data.slug) : undefined;

  const { error } = await supabase
    .from('products')
    .update({ ...payload, ...(slug ? { slug } : {}) })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') {
      throw new Error('Този адрес (slug) или артикулен номер вече се ползва от друг продукт.');
    }
    throw new Error(`Грешка при запис: ${error.message}`);
  }

  return { id };
}

export async function deleteProduct(id) {
  if (!id) throw new Error('Липсва ID на продукт.');

  const supabase = supabaseServer();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(`Грешка при изтриване: ${error.message}`);
  }

  return { ok: true };
}

export async function toggleProductActive(id, active) {
  if (!id) throw new Error('Липсва ID на продукт.');

  const supabase = supabaseServer();
  const { error } = await supabase.from('products').update({ active }).eq('id', id);

  if (error) {
    throw new Error(`Грешка при запис: ${error.message}`);
  }

  return { ok: true };
}
