import { ArrowUpRight, X } from 'lucide-react';
import { charmPrice, charms, namePrices } from '../../data/siteData';
import { asset } from '../../lib/assets';
import { money } from '../../lib/formatters';

function Payment({ total, pack, selected = [], letters, product, readyMade = false, customOrder = false, cordPrice = 0, specialSelected = [], specialCharms = [], close }) {
  const packagePrice = pack === 'combo' ? 47_000 : 23_000;

  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div className="payment-modal" role="dialog" aria-modal="true" aria-label="Xác nhận thanh toán" onClick={(event) => event.stopPropagation()}>
        <button className="close" type="button" onClick={close} aria-label="Đóng thanh toán"><X size={20} /></button>
        <p className="eyebrow">XÁC NHẬN THANH TOÁN</p>
        <div className="bill">
          <div className="bill-items">
            {customOrder && <BillRow label={`Tự phối · ${specialSelected.length} charm · ${letters} (${letters?.length ?? 0} chữ)`} value={total} />}
            {product && !readyMade && !customOrder && <BillRow label={`Concept ${product.name}`} value={product.price} />}
            {product && readyMade && <BillRow label={`${product.name} · tên ${letters}`} value={total} />}
            {pack && !customOrder && <BillRow label={pack === 'combo' ? 'Combo Chạm Ý' : 'Gói mua charm lẻ'} value={packagePrice} />}
            {!customOrder && specialSelected.map((id) => { const charm = specialCharms.find((item) => item.id === id); return <BillRow key={id} label={`Charm Special · ${charm?.name ?? ''}`} value={charm?.price ?? 0} />; })}
            {selected.map((id, index) => {
              const charm = charms.find((item) => item.id === id);
              const price = pack === 'combo' && index < 3 ? 0 : charmPrice;
              return <BillRow key={id} label={`Charm ${index + 1} · ${charm?.name ?? ''}`} value={price} />;
            })}
            {letters && !readyMade && !customOrder && <BillRow label={`Tên “${letters}”`} value={namePrices[letters.length] ?? 0} />}
          </div>
          <div className="bill-total"><span>Tổng cộng</span><b>{money(total)}</b></div>
        </div>
        <div className="qr-payment">
          <a className="qr-zoom" href={asset('qr.jpg')} target="_blank" rel="noreferrer"><img src={asset('qr.jpg')} alt="Mã QR thanh toán - bấm để phóng to" /></a>
          <div className="bank-info"><strong>NGUYEN THUY VY</strong><span>TECHCOM BANK</span><span>STK: 0965 4883 86</span><small>Nhập đúng số tiền: <b>{money(total)}</b></small></div>
        </div>
        <div className="shipping-note">
          <strong>Lưu ý về phí ship</strong>
          <p><b>Free ship trong bán kính 5km.</b> <b>Trên 5km</b>, shop xin phép book ship; <b>phí ship tùy vào thời điểm trên app.</b> Sau khi bạn chuyển khoản và nhấn vào liên kết gửi thông tin bên dưới, shop sẽ lên đơn và báo phí ship cho bạn.</p>
        </div>
        <p className="payment-help">Quét mã và nhập đúng số tiền <strong>{money(total)}</strong>, sau đó gửi <strong>ảnh preview và bill</strong> cho Chạm Ý.</p>
        <div className="social-actions">
          <a href="https://www.facebook.com/share/1Ee6EpUt8b/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Gửi qua Facebook <ArrowUpRight size={14} /></a>
          <a href="https://www.instagram.com/chamy.charm?stkn=am9veHRpa3YyZGM0" target="_blank" rel="noreferrer">Gửi qua Instagram <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}

function BillRow({ label, value }) {
  return <div><span>{label}</span><b>{money(value)}</b></div>;
}

export default Payment;
