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

## Какво е готово в тази стъпка (Задача 4)

- `/` (начална страница) — показва последните 4 активни продукта + бутон
  „Разгледай продуктите“
- `/catalog` — пълна витрина: карти с продукти, филтър по категория (ако
  има зададени категории), празно състояние ако няма продукти
- `/catalog/[slug]` — продуктова страница: галерия със снимки (главна +
  миниатюри), цена, наличност (с предупреждение при ≤3 бр.), описание,
  бутон „Добави в количката“ (засега неактивен — идва в Задача 5)
- Всички витринни страници четат само `active = true` продукти (през
  RLS policy-то от Задача 2, с публичния anon ключ — не service role)
- Страниците са `force-dynamic` (винаги пресни данни от Supabase), а не
  статично генерирани при build — това означава, че build-ът не изисква
  реални Supabase данни/мрежа по време на компилация

## Какво е готово в тази стъпка (Задача 5)

- Количка (localStorage, `app/lib/cartContext.js`) — живо броене в хедъра,
  добавяне от продуктовата страница, промяна на количество/премахване в `/cart`
- `/checkout` — форма за поръчка (име, телефон, имейл по желание, доставка
  до адрес или до офис на куриер Спиди/Еконт, бележка), плащане: наложен
  платеж
- `supabase/002_checkout_function.sql` — **нов файл, трябва да го пуснеш**
  в Supabase SQL Editor (виж по-долу) — атомична функция `create_order`,
  която проверява наличност, създава поръчката и редовете ѝ, и намалява
  наличностите — всичко в една транзакция (ако нещо гръмне по средата,
  нищо не се записва наполовина)
- Цените се проверяват и записват от сървъра (от текущите данни в
  `products`), не се вярва на цената, изпратена от браузъра

### Трябва да пуснеш новия SQL файл

1. Supabase → **SQL Editor** → **New query**
2. Копирай целия файл `supabase/002_checkout_function.sql` и го пусни
   (**Run**) — той само добавя нова функция, не пипа съществуващите данни

### Забележка — имейл известия за поръчки

В момента поръчката се записва в базата, но **никой не получава имейл** —
нито Христо за нова поръчка, нито клиентът за потвърждение. Решено е това
да се направи в Задача 7/8 заедно с Resend настройката за dev-request
формата от стария admin.html — така верификацията на домейна (DKIM/SPF) се
прави веднъж, за всички имейли наведнъж, при реалния деплой.

## Предстои (по план)

6. Админ: Поръчки + Наличности
4. Витрина/каталог + продуктова страница
5. Кошница + checkout + поръчки
6. Админ: Поръчки + Наличности
7. Пренасяне на GA/Search Console линкове, changelog и форма към екипа от стария admin.html
8. Деплой: Vercel + Supabase + домейн (shop.kzm.bg)
9. SEO основи (robots/sitemap/OG/JSON-LD)
