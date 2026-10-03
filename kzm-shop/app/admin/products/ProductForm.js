'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFilesToCloudinary } from '../../lib/cloudinary-client';
import { slugify } from '../../lib/slugify';
import { createProduct, updateProduct, deleteProduct } from './actions';
import styles from './ProductForm.module.css';

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [sku, setSku] = useState(product?.sku ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [priceEur, setPriceEur] = useState(
    product ? (product.price_cents / 100).toFixed(2) : ''
  );
  const [stockQty, setStockQty] = useState(product?.stock_qty ?? 0);
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState(product?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleNameChange(value) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleFilesSelected(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err.message || 'Качването на снимка се провали.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = { name, slug, sku, category, description, priceEur, stockQty, active, images };

    try {
      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Нещо се обърка при записа.');
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Сигурен ли си, че искаш да изтриеш „${product.name}“?`)) return;
    setSaving(true);
    try {
      await deleteProduct(product.id);
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Изтриването се провали.');
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="name">Име на продукта *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="slug">Адрес (slug)</label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="generira-se-avtomatichno-ot-imeto"
        />
        <span className={styles.hint}>Част от URL адреса на продукта — само латински букви, цифри и тирета.</span>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="sku">Артикулен номер (SKU)</label>
          <input id="sku" type="text" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="category">Категория</label>
          <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="price">Цена (EUR) *</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={priceEur}
            onChange={(e) => setPriceEur(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="stock">Наличност (бр.)</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Снимки</label>
        {images.length > 0 && (
          <div className={styles.images}>
            {images.map((url) => (
              <div className={styles.imageThumb} key={url}>
                {/* Admin-only preview thumbnails — plain <img> avoids the extra
                    next/image config overhead for a tool only Миро will use. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <button type="button" className={styles.imageRemove} onClick={() => removeImage(url)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.uploadBox}>
          <input type="file" accept="image/*" multiple onChange={handleFilesSelected} disabled={uploading} />
          {uploading && <div>Качване…</div>}
        </div>
      </div>

      <div className={styles.checkboxRow}>
        <input id="active" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        <label htmlFor="active">Видим във витрината</label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {saving ? 'Записване…' : isEdit ? 'Запази промените' : 'Създай продукт'}
        </button>
        <a href="/admin/products" className="btn btn-ghost">Отказ</a>
        {isEdit && (
          <button type="button" className={styles.deleteLink} onClick={handleDelete} disabled={saving}>
            Изтрий продукта
          </button>
        )}
      </div>
    </form>
  );
}
