import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { cartTotal, readCart, writeCart } from '../../lib/cart';
import { money } from '../../lib/formatters';
import Payment from './Payment';

function CartDrawer({ close }) {
  const [items, setItems] = useState(readCart); const [selected, setSelected] = useState(() => new Set(readCart().map((item) => item.productId))); const [checkout, setCheckout] = useState(false);
  useEffect(() => { setSelected((current) => new Set([...current].filter((id) => items.some((item) => item.productId === id)))); }, [items]);
  const update = (next) => { setItems(next); writeCart(next); };
  const selectedItems = useMemo(() => items.filter((item) => selected.has(item.productId)), [items, selected]);
  const toggleSelected = (id) => setSelected((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const removeSelectedAfterSuccess = () => { const remaining = items.filter((item) => !selected.has(item.productId)); writeCart(remaining); setItems(remaining); setSelected(new Set(remaining.map((item) => item.productId))); setCheckout(false); };
  return <div className="cart-backdrop" onClick={close}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><button className="close" onClick={close}><X size={20} /></button><p className="eyebrow">GIỎ HÀNG</p><h2>Món bạn đã chọn.</h2>{items.length ? <><div className="cart-items">{items.map((item) => <div className={`cart-item ${selected.has(item.productId) ? 'is-selected' : ''}`} key={item.productId}><input className="cart-check" type="checkbox" checked={selected.has(item.productId)} onChange={() => toggleSelected(item.productId)} /><img src={item.productImage} alt={item.productName} /><div><b>{item.productName}</b><small>{money(item.unitPrice)}</small><div className="cart-quantity"><button onClick={() => update(items.map((current) => current.productId === item.productId ? { ...current, quantity: Math.max(1, current.quantity - 1) } : current))}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => update(items.map((current) => current.productId === item.productId ? { ...current, quantity: current.quantity + 1 } : current))}><Plus size={12} /></button><button className="cart-remove" onClick={() => update(items.filter((current) => current.productId !== item.productId))}><Trash2 size={13} /></button></div></div></div>)}</div><div className="cart-total"><span>{selectedItems.length} sản phẩm đã chọn</span><strong>{money(cartTotal(selectedItems))}</strong></div><button className="primary cart-checkout" disabled={!selectedItems.length} onClick={() => setCheckout(true)}>Thanh toán sản phẩm đã chọn</button></> : <p className="cart-empty">Giỏ hàng đang trống.</p>}{checkout && <Payment orderItems={selectedItems} total={cartTotal(selectedItems)} close={() => setCheckout(false)} onSuccess={removeSelectedAfterSuccess} />}</aside></div>;
}
export default CartDrawer;
