import { useEffect, useState } from 'react';
import { lookupOrder } from '../lib/api';
import { money } from '../lib/formatters';

const phonePattern = /^(0|\+84)[0-9\s.-]{8,14}$/;

function Orders() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 10000);
    return () => window.clearTimeout(timer);
  }, [error]);

  function handlePhoneChange(event) {
    const value = event.target.value;
    if (/[^0-9+\s.-]/.test(value)) {
      setError('Vui lòng chỉ nhập số điện thoại.');
      return;
    }
    setError('');
    setPhone(value);
  }

  async function submit(event) {
    event.preventDefault();
    const normalizedPhone = phone.trim();
    if (!phonePattern.test(normalizedPhone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      setOrders(await lookupOrder(normalizedPhone));
      setPage(1);
    } catch (e) {
      setOrders([]);
      setPage(1);
      setError(e.message === 'No orders found' ? 'Không tìm thấy đơn hàng với số điện thoại này.' : e.message);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const visibleOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  return <main className="page orders-page">
    <div className="page-intro"><p className="eyebrow">ĐƠN HÀNG CỦA TÔI</p><h1>Tra lại đơn<br /><em>của bạn.</em></h1><p>Nhập số điện thoại đã dùng khi đặt hàng để xem tất cả đơn của bạn.</p></div>
    <form className="orders-lookup" onSubmit={submit}>
      <input type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={handlePhoneChange} placeholder="SỐ ĐIỆN THOẠI" required aria-invalid={Boolean(error)} />
      <button className="primary" disabled={loading}>{loading ? 'Đang tìm...' : 'Xem đơn hàng'}</button>
    </form>
    {error && <div className="orders-error"><span>!</span><div><b>Thông tin chưa hợp lệ</b><small>{error}</small></div></div>}
    <div className="orders-list">{visibleOrders.map((order) => <article className="order-result" key={order._id}>
      <div className="order-result-head"><div><p className="eyebrow">{order.orderCode}</p><h2>{new Date(order.createdAt).toLocaleString('vi-VN')}</h2></div><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status === 'PENDING' ? 'Chưa hoàn thành' : order.status === 'PROCESSING' ? 'Đang xử lý đơn' : order.status === 'REJECTED' ? 'Từ chối xử lý' : 'Đã hoàn thành'}</span></div>
      {order.rejectionReason && <p className="order-rejection-reason"><b>Lý do từ chối:</b> {order.rejectionReason}</p>}
      {order.items.map((item) => <div className="order-result-item" key={`${order._id}-${item.productId}`}>{item.productType === 'CUSTOM' ? (order.previewImage?.url ? <img src={order.previewImage.url} alt="Preview sản phẩm tự phối" /> : null) : <img src={item.productImage} alt={item.productName} />}<div><b>{item.productName}</b><span>{item.quantity} × {money(item.unitPrice)}</span></div><strong>{money(item.subtotal)}</strong></div>)}
      <div className="order-result-total"><span>Tổng cộng</span><strong>{money(order.totalAmount)}</strong></div>
      {order.previewImage?.url && <img className="order-result-preview" src={order.previewImage.url} alt="Preview đơn hàng" />}
    </article>)}</div>
    {orders.length > pageSize && <div className="orders-pagination"><span>{orders.length} đơn · Trang {page}/{totalPages}</span><div><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Trước</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} className={number === page ? 'active' : ''} onClick={() => setPage(number)}>{number}</button>)}<button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Sau</button></div></div>}
  </main>;
}

export default Orders;
