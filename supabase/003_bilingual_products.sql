-- KZM Shop — двуезични продукти (Задача: двуезичен магазин, Етап 1)
-- Добавя английски варианти на име и описание. И двете са nullable —
-- докато не ги попълниш в /admin/products, английската версия на сайта
-- просто ще показва българския текст (fallback в кода, не в базата).
-- Пусни еднократно в Supabase → SQL Editor.

alter table products
  add column if not exists name_en text,
  add column if not exists description_en text;
