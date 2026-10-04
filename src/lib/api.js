const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function recordVisitorHeartbeat() {
  const storageKey = 'cham-y-visitor-id';
  let visitorId = localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId = window.crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  const response = await fetch(`${API_URL}/analytics/heartbeat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId }) });
  if (!response.ok) throw new Error('Không thể ghi nhận lượt truy cập');
}

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`);
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'Không thể tải sản phẩm');
  return result.data;
}

export async function createOrder(payload, files = {}) {
  const form = new FormData();
  form.append('payload', JSON.stringify(payload));
  if (files.previewImage) form.append('previewImage', files.previewImage);
  if (files.paymentProofImage) form.append('paymentProofImage', files.paymentProofImage);
  const response = await fetch(`${API_URL}/orders`, { method: 'POST', body: form });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'Không thể tạo đơn hàng');
  return result.data;
}

export async function lookupOrder(phone) {
  const response = await fetch(`${API_URL}/orders/lookup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'Không tìm thấy đơn hàng');
  return result.data;
}
