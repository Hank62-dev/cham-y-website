const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'API request failed');
  return response;
}

export const login = (password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) }).then((r) => r.json());
export const getDashboard = (token) => request('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
export const getOrders = (token, query) => request(`/admin/orders?${new URLSearchParams(query)}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
export const getOrder = (token, id) => request(`/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
export const updateStatus = (token, id, status, rejectionReason = '') => request(`/admin/orders/${id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ status, rejectionReason }) }).then((r) => r.json());
export const getProducts = (token, search = '', active = '') => { const params = new URLSearchParams(); if (search) params.set('search', search); if (active !== '') params.set('active', active); const query = params.toString(); return request(`/admin/products${query ? `?${query}` : ''}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()); };
async function sendProduct(token, path, method, form) {
  const response = await fetch(`${API_URL}${path}`, { method, headers: { Authorization: `Bearer ${token}` }, body: form });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'Không thể lưu sản phẩm');
  return result;
}
export const createProduct = (token, form) => sendProduct(token, '/admin/products', 'POST', form);
export const editProduct = (token, id, form) => sendProduct(token, `/admin/products/${id}`, 'PATCH', form);
export const adjustProductStock = (token, id, amount) => request(`/admin/products/${id}/stock`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ amount }) }).then((r) => r.json());
export const toggleProduct = (token, id, active) => request(`/admin/products/${id}/active`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ active }) }).then((r) => r.json());
export const deleteProduct = (token, id) => request(`/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
export async function exportOrders(token, status) {
  const response = await fetch(`${API_URL}/admin/orders/export${status ? `?status=${status}` : ''}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error('Export failed');
  const blob = await response.blob();
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'cham-y-orders.xlsx'; link.click(); URL.revokeObjectURL(link.href);
}
