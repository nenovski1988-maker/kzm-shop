import ProductForm from '../ProductForm';

export const metadata = { title: 'Нов продукт' };

export default function NewProductPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--g1)' }}>Нов продукт</h2>
      <ProductForm />
    </div>
  );
}
