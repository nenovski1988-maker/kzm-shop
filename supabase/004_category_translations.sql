-- KZM Shop — превод на категориите за EN версията на витрината
-- (Задача: двуезичен магазин, Етап 2)
--
-- Категориите на продуктите са свободен текст (виж schema.sql, коментар на
-- products.category) — няма фиксиран списък. Затова преводът им не живее в
-- самата products таблица (там би се повтарял/разминавал по всеки продукт),
-- а в отделна малка таблица, управлявана от нова страница /admin/categories.
--
-- Пусни еднократно в Supabase → SQL Editor.

create table if not exists category_translations (
  category text primary key,   -- точно както е записано в products.category (BG)
  category_en text,            -- nullable — празно = показва BG името и в EN режим
  updated_at timestamptz not null default now()
);

drop trigger if exists category_translations_set_updated_at on category_translations;
create trigger category_translations_set_updated_at
  before update on category_translations
  for each row execute function set_updated_at();

-- Публично читаемо (витрината на сайта ползва anon key, за да превежда
-- категориите в EN режим) — записва/редактира само admin панелът, който
-- минава през supabaseServer.js (service role, заобикаля RLS).
alter table category_translations enable row level security;

drop policy if exists "Public can view category translations" on category_translations;
create policy "Public can view category translations"
  on category_translations for select
  using (true);
