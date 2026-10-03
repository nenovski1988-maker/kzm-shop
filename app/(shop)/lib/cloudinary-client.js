'use client';

// Direct browser → Cloudinary upload, bypassing any server function body-size
// limits (same pattern used on the ArtIV shop). Requires an UNSIGNED upload
// preset configured in the Cloudinary dashboard, scoped to its own folder so
// it stays separate from other projects sharing the same Cloudinary account.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET; // e.g. "kzm_shop_products"

export async function uploadFileToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary не е конфигуриран — провери NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME и NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET в .env.local'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'kzm-shop/products');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Качването в Cloudinary се провали: ${err}`);
  }

  const data = await res.json();
  return data.secure_url;
}

export async function uploadFilesToCloudinary(files) {
  return Promise.all(Array.from(files).map(uploadFileToCloudinary));
}
