-- KZM Shop — Supabase схема (Задача 2)
-- Моделирана по образеца на ArtIV (products / orders / order_items +
-- атомични stock функции), адаптирана за KZM (копитни инструменти и
-- консумативи). Пусни този файл наведнъж в Supabase → SQL Editor.

-- Разширение за gen_random_uuid() (обикновено вече е активно в Supabase)
create extension if not exists "pgcrypto";

-- =========================================================
-- PRODUCTS
-- =========================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,                     -- артикулен номер (поддържа съществуващата ABCD номерация на Христо)
  name text not null,
  slug text unique not null,
  category text,                       -- свободен текст засега (напр. "Инструменти", "Превантивни", "Лечебни") — малко продукти, няма нужда от отделна categories таблица все още
  description text,
  price_cents integer not null check (price_cents >= 0),  -- цена в евроцентове (каноничната валута от 01.01.2026)
  images jsonb not null default '[]'::jsonb,               -- масив от Cloudinary URL-и
  stock_qty integer not null default 0 check (stock_qty >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on products (active);
create index if not exists products_category_idx on products (category);

-- =========================================================
-- ORDERS
-- =========================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'online' check (channel in ('online', 'in_person')),

  customer_name text,
  customer_phone text,
  customer_email text,

  delivery_method text check (delivery_method in ('courier', 'pickup')),
  courier text,                        -- напр. Speedy / Econt
  delivery_address text,
  delivery_city text,
  delivery_office text,                -- ако е доставка до офис, а не адрес

  payment_method text not null default 'cod' check (payment_method in ('cod', 'card')),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),

  total_cents integer not null default 0 check (total_cents >= 0),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_channel_idx on orders (channel);
create index if not exists orders_created_at_idx on orders (created_at desc);

-- =========================================================
-- ORDER ITEMS
-- =========================================================
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,

  -- снимка на продуктовите данни към момента на поръчката
  -- (цената/името на продукта могат да се сменят по-късно — поръчката пази историята)
  product_name text not null,
  sku text,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  qty integer not null check (qty > 0),
  line_total_cents integer not null check (line_total_cents >= 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists order_items_product_id_idx on order_items (product_id);

-- =========================================================
-- updated_at auto-update тригери
-- =========================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- =========================================================
-- Атомични функции за наличности (по модела на ArtIV)
-- SECURITY DEFINER, достъпни само през service role (админ/checkout backend)
-- =========================================================

-- Намалява наличността на продукт атомично; хвърля грешка при недостиг
create or replace function decrement_stock(p_product_id uuid, p_qty integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products
  set stock_qty = stock_qty - p_qty
  where id = p_product_id and stock_qty >= p_qty;

  if not found then
    raise exception 'Недостатъчна наличност за продукт %', p_product_id;
  end if;
end;
$$;

-- Връща наличността за всички артикули от дадена поръчка (при сторниране)
create or replace function restore_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products p
  set stock_qty = p.stock_qty + oi.qty
  from order_items oi
  where oi.order_id = p_order_id and oi.product_id = p.id;
end;
$$;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Публично (anon key, витрината на сайта) вижда само активните продукти.
-- Всичко останало (admin CRUD, поръчки, checkout) минава през
-- supabaseServer.js със SUPABASE_SERVICE_ROLE_KEY, който заобикаля RLS —
-- затова няма нужда от INSERT/UPDATE policy тук, нито от policy за orders/order_items.
drop policy if exists "Public can view active products" on products;
create policy "Public can view active products"
  on products for select
  using (active = true);

-- orders и order_items умишлено остават без anon policies — никакъв
-- directen достъп отвън, само през checkout server action с service role.
