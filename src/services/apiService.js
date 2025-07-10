export const PRODUCTS_API_URL = 'https://686c0f4e14219674dcc71add.mockapi.io/products/products';

export async function fetchProducts() {
  const res = await fetch(PRODUCTS_API_URL);
  if (!res.ok) throw new Error(`Status ${res.status}`);
  return res.json();
}
