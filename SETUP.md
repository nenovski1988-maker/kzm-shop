# KZM Shop — setup бележки

Scaffold на новия магазин (Next.js App Router, JS, без TypeScript), структура
по образец на ArtIV, с брандинг на КЗМ.

## Какво е готово в тази стъпка (Задача 1)

- Next.js проект, App Router, без Tailwind (plain CSS + CSS Modules)
- Брандинг: зелена/синя палитра и Cormorant Garamond + Verdana, взети от kzm.bg
- Header/Footer, линк обратно към kzm.bg
- Скелет на админ панела (`/admin`) с HTTP Basic Auth (proxy.js) и навигация
  Продукти / Поръчки / Наличности / Активност — всеки раздел засега е placeholder
- `app/lib/supabaseClient.js` и `supabaseServer.js` — готови за връзка
- `app/lib/cloudinary-client.js` — директно browser→Cloudinary качване (unsigned
  preset), по модела на ArtIV
- Основни публични страници: `/`, `/catalog`, `/cart`, `/contact`, `/za-nas` —
  placeholder съдържание, ще се попълват в следващите задачи

## Какво е готово в тази стъпка (Задача 2)

- `supabase/schema.sql` — пълна схема: `products`, `orders`, `order_items`,
  атомични функции `decrement_stock`/`restore_stock` (по модела на ArtIV),
  `updated_at` тригери, Row Level Security (публично се вижда само
  `products` с `active = true`; `orders`/`order_items` минават само през
  service role от бъдещите server actions, без публичен достъп)

### Как да я пуснеш

1. В Supabase проекта → ляво меню → **SQL Editor** → **New query**
2. Копирай целия файл `supabase/schema.sql` и го постави там
3. Натисни **Run** — трябва да приключи без грешки и да видиш новите
   таблици в **Table Editor**: `products`, `orders`, `order_items`

## Какво трябва ти да направиш, за да тръгне локално

1. `npm install` (ако пренесеш проекта на нова машина)
2. Копирай `.env.local.example` → `.env.local` и попълни стойностите (виж файла)
3. `npm run dev` → http://localhost:3000

## Push към GitHub (ти, с твоите креденшъли)

```powershell
cd kzm-shop
git add -A
git commit -m "Initial scaffold"
git remote add origin https://github.com/nenovski1988-maker/kzm-shop.git
git push -u origin main
```

(Ако repo-то още не съществува в GitHub — създай го празно, без README, преди push-а.)

## Какво е готово в тази стъпка (Задача 3)

- `/admin/products` — списък с продукти (карти със снимка, статус, цена,
  наличност), бутон „Скрий/Покажи“ (active flag) без да презарежда страницата
- `/admin/products/new` и `/admin/products/[id]/edit` — пълна форма: име,
  slug (автоматично от името, редактируем), SKU, категория, описание, цена
  (EUR), наличност, чекбокс "видим във витрината", изтриване
- Снимки: директно browser → Cloudinary качване (unsigned preset), преглед
  на миниатюри с бутон за премахване преди запис
- `app/admin/products/actions.js` — server actions (`createProduct`,
  `updateProduct`, `deleteProduct`, `toggleProductActive`), всички през
  `supabaseServer` (service role, заобикаля RLS)
- `app/lib/slugify.js` — транслитерация кирилица → латиница за URL адреси

### За да проработи качването на снимки, трябва:

1. Нов **unsigned upload preset** в същия Cloudinary акаунт, който ползваш
   за ArtIV, с име `kzm_shop_products` (или каквото име избереш — само после
   да съвпада с `.env.local`)
2. В `.env.local` да попълниш:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<твоя cloud name>
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kzm_shop_products
   ```

## Предстои (по план)

4. Витрина/каталог + продуктова страница
4. Витрина/каталог + продуктова страница
5. Кошница + checkout + поръчки
6. Админ: Поръчки + Наличности
7. Пренасяне на GA/Search Console линкове, changelog и форма към екипа от стария admin.html
8. Деплой: Vercel + Supabase + домейн (shop.kzm.bg)
9. SEO основи (robots/sitemap/OG/JSON-LD)
