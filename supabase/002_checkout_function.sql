-- KZM Shop — Задача 5: атомична функция за създаване на поръчка.
-- Пусни този файл наведнъж в Supabase → SQL Editor (допълва schema.sql,
-- не го замества — не е нужно да пускаш schema.sql пак).
--
-- Прави всичко в една транзакция: проверява наличност (с row lock, за да
-- не допусне двама клиенти да продадат последния брой едновременно),
-- създава поръчката, създава редовете ѝ, и намалява наличностите.
-- Ако нещо гръмне по средата (напр. недостатъчна наличност), ВСИЧКО се
-- отменя автоматично — няма поръчка "наполовина записана".

create or replace function create_order(p_customer jsonb, p_items jsonb)
returns table (order_id uuid, total_cents integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total integer := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty integer;
  v_line_total integer;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Количката е празна.';
  end if;

  -- Първи проход: заключва и проверява наличността на всеки артикул.
  -- "for update" пречи на състезателно условие (race condition) при
  -- едновременни поръчки за последните бройки.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'qty')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Невалидно количество.';
    end if;

    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid and active = true
    for update;

    if not found then
      raise exception 'Продукт с ID % вече не е наличен.', v_item->>'product_id';
    end if;

    if v_product.stock_qty < v_qty then
      raise exception 'Недостатъчна наличност за "%" — налични са само % бр.', v_product.name, v_product.stock_qty;
    end if;
  end loop;

  -- Създава поръчката (total_cents се допълва накрая)
  insert into orders (
    channel, customer_name, customer_phone, customer_email,
    delivery_method, courier, delivery_address, delivery_city, delivery_office,
    payment_method, status, total_cents, notes
  ) values (
    'online',
    p_customer->>'name',
    p_customer->>'phone',
    nullif(p_customer->>'email', ''),
    p_customer->>'delivery_method',
    nullif(p_customer->>'courier', ''),
    nullif(p_customer->>'address', ''),
    nullif(p_customer->>'city', ''),
    nullif(p_customer->>'office', ''),
    coalesce(nullif(p_customer->>'payment_method', ''), 'cod'),
    'pending',
    0,
    nullif(p_customer->>'notes', '')
  )
  returning id into v_order_id;

  -- Втори проход: записва редовете на поръчката и намалява наличността
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'qty')::integer;

    select * into v_product from products where id = (v_item->>'product_id')::uuid;
    v_line_total := v_product.price_cents * v_qty;
    v_total := v_total + v_line_total;

    insert into order_items (order_id, product_id, product_name, sku, unit_price_cents, qty, line_total_cents)
    values (v_order_id, v_product.id, v_product.name, v_product.sku, v_product.price_cents, v_qty, v_line_total);

    update products set stock_qty = stock_qty - v_qty where id = v_product.id;
  end loop;

  update orders set total_cents = v_total where id = v_order_id;

  return query select v_order_id, v_total;
end;
$$;
