import { notFound } from 'next/navigation';
import { supabaseServer } from '../../../../lib/supabaseServer';
import ProductForm from '../../ProductForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Редактирай продукт' };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = supabaseServer();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--g1)' }}>Редактирай: {product.name}</h2>
      <ProductForm product={product} />
    </div>
  );
}
