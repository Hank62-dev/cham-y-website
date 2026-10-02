import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, CheckCircle2, Upload, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { asset } from '../../lib/assets';
import { money } from '../../lib/formatters';
import { createOrder } from '../../lib/api';

function Payment({ total, product, readyMade = false, customOrder = false, specialSelected = [], specialCharms = [], letters = '', orderItems = [], previewRef, customizationData = {}, close, onSuccess }) {
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' }); const [readyLetters, setReadyLetters] = useState('');
  const [paymentProof, setPaymentProof] = useState(null); const [previewFile, setPreviewFile] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(null);
  const items = useMemo(() => {
    if (orderItems.length) return orderItems;
    if (product) return [{ productId: product.id, productName: product.name, productImage: product.image, productType: 'READY', quantity: 1, unitPrice: total, customizationData: { ...customizationData, letters } }];
    return [{ productId: 'custom-product', productName: 'Sản phẩm tự phối', productImage: '', productType: 'CUSTOM', quantity: 1, unitPrice: total, customizationData: { ...customizationData, letters, selectedCount: specialSelected.length } }];
  }, [customizationData, letters, orderItems, product, specialSelected.length, total]);
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const needsReadyOptions = items.some((item) => item.productType === 'READY' && !item.customizationData?.letters);
      if (needsReadyOptions && (readyLetters.length < 2 || readyLetters.length > 5)) throw new Error('Vui lòng nhập tên 2–5 chữ cho sản phẩm có sẵn');
      const submittedItems = items.map((item) => item.productType === 'READY' && !item.customizationData?.letters ? { ...item, customizationData: { letters: readyLetters } } : item);
      let generatedPreview = previewFile;
      if (!generatedPreview && previewRef?.current) {
        const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: '#f1ebdc', cacheBust: true });
        const blob = await (await fetch(dataUrl)).blob(); generatedPreview = new File([blob], 'cham-y-preview.png', { type: 'image/png' });
      }
      const order = await createOrder({ customer: form, items: submittedItems, previewImageUrl: undefined }, { previewImage: generatedPreview, paymentProofImage: paymentProof });
      setSuccess(order.orderCode); onSuccess?.(order);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  const needsReadyOptions = items.some((item) => item.productType === 'READY' && !item.customizationData?.letters);
  return createPortal(<div className="modal-backdrop" role="presentation" onClick={close}><div className="payment-modal checkout-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="close" type="button" onClick={close} aria-label="Đóng"><X size={20} /></button>{success ? <div className="checkout-success"><CheckCircle2 size={46} /><p className="eyebrow">ĐẶT HÀNG THÀNH CÔNG</p><h2>Mã đơn hàng<br /><em>{success}</em></h2><p>Chạm Ý đã nhận thông tin. Bạn có thể dùng mã đơn và số điện thoại để tra cứu lại đơn.</p><button className="primary" onClick={close}>Đóng</button></div> : <><p className="eyebrow">XÁC NHẬN THANH TOÁN</p><h2>Hoàn tất đơn hàng.</h2><div className="checkout-summary"><b>{items.length === 1 ? items[0].productName : `${items.length} sản phẩm trong giỏ`}</b><strong>{money(total)}</strong></div><div className="qr-payment"><a className="qr-zoom" href={asset('qr.jpg')} target="_blank" rel="noreferrer"><img src={asset('qr.jpg')} alt="Mã QR thanh toán" /></a><div className="bank-info"><strong>NGUYEN THUY VY</strong><span>TECHCOM BANK</span><span>STK: 0965 4883 86</span><small>Chuyển khoản đúng: <b>{money(total)}</b></small></div></div><div className="checkout-bill">{items.map((item) => <div key={item.productId}><span>{item.productName} × {item.quantity}</span><b>{money(item.unitPrice * item.quantity)}</b></div>)}<div className="bill-total"><span>Tổng cộng</span><b>{money(total)}</b></div></div><form className="checkout-form" onSubmit={submit}>{needsReadyOptions && <><div className="checkout-section-title">Tên mong muốn <span>♡</span></div><input required minLength="2" maxLength="5" placeholder="NHẬP TÊN · 2–5 CHỮ CÁI" value={readyLetters} onChange={(e) => setReadyLetters(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())} /></>}<div className="checkout-section-title">Thông tin nhận hàng <span>♡</span></div><input required placeholder="HỌ VÀ TÊN" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /><input required placeholder="SỐ ĐIỆN THOẠI" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><textarea required placeholder="ĐỊA CHỈ NHẬN HÀNG" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /><div className="checkout-section-title">Ảnh xác nhận <span>✦</span></div><label className="upload-field"><Upload size={15} /> Ảnh chuyển khoản *<input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} /></label><label className="upload-field"><Upload size={15} /> Ảnh preview sản phẩm<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPreviewFile(e.target.files?.[0] || null)} /></label><button className="primary" disabled={loading}>{loading ? 'Đang tạo đơn hàng...' : 'Xác nhận đã chuyển khoản'}</button>{error && <p className="form-error">{error}</p>}</form></>}</div></div>, document.body);
}

export default Payment;
