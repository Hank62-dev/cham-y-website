import { useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { ArrowRight, Check, Download } from 'lucide-react';
import Preview from './Preview';
import OptionTitle from '../common/OptionTitle';
import Payment from '../common/Payment';
import { getSpecialPrice, isOutOfStock, specialCharms } from '../../data/siteData';
import { money } from '../../lib/formatters';

const cordColors = [
  { id: 'red', name: 'Đỏ sáng', value: '#ff4d5d' },
  { id: 'yellow', name: 'Vàng sáng', value: '#ffd43d' },
  { id: 'pink', name: 'Hồng sáng', value: '#ff78b5' },
  { id: 'blue', name: 'Xanh dương sáng', value: '#4da3ff' },
  { id: 'white', name: 'Trắng', value: '#fffdf7' },
];

function Customize() {
  const [cordColor, setCordColor] = useState(cordColors[0]);
  const [arrangement, setArrangement] = useState('random');
  const [selected, setSelected] = useState([null, null, null]);
  const [activePosition, setActivePosition] = useState(0);
  const [letterStyle, setLetterStyle] = useState('bubble');
  const [letters, setLetters] = useState('');
  const [pay, setPay] = useState(false);
  const [validationError, setValidationError] = useState('');
  const previewRef = useRef(null);

  const selectedCount = selected.filter(Boolean).length;
  const total = getSpecialPrice(selectedCount, letters);
  const toggleCharm = (id) => setSelected((current) => {
    const existingPosition = current.indexOf(id);
    if (existingPosition >= 0) {
      const next = [...current];
      next[existingPosition] = null;
      return next;
    }
    if (selectedCount >= 3) return current;
    const next = [...current];
    const target = arrangement === 'manual' ? activePosition : current.findIndex((item) => !item);
    next[target < 0 ? 0 : target] = id;
    return next;
  });

  const submit = () => {
    const missing = [];
    if (selectedCount < 1) missing.push('chọn ít nhất 1 charm Special');
    if (letters.length < 2 || letters.length > 5) missing.push('nhập tên từ 2–5 chữ cái tiếng Anh');
    if (missing.length) {
      setValidationError(`Vui lòng ${missing.join('; ')}.`);
      return;
    }
    setValidationError('');
    setPay(true);
  };

  const save = async (format) => {
    if (!previewRef.current) return;
    const options = { pixelRatio: 2, backgroundColor: '#f1ebdc', cacheBust: true };
    const dataUrl = format === 'jpg' ? await toJpeg(previewRef.current, { ...options, quality: 0.92 }) : await toPng(previewRef.current, options);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `cham-y-preview.${format}`;
    link.click();
  };

  return (
    <main className="customizer">
      <div className="custom-head"><div><p className="eyebrow">TỰ PHỐI SẢN PHẨM</p><h1>Tạo sản phẩm<br /><em>của riêng bạn.</em></h1></div><p className="custom-note">Chọn màu dây → phối charm →<br />chọn chữ và tên của bạn.</p></div>
      <div className="custom-layout">
        <div className="preview-wrap"><Preview selected={selected} letters={letters} pack="combo" previewRef={previewRef} charmOptions={specialCharms} cordColor={cordColor.value} arrangement={arrangement} letterStyle={letterStyle} /><div className="preview-actions"><button className="secondary" type="button" onClick={() => save('png')}><Download size={15} /> Lưu PNG</button><button className="secondary" type="button" onClick={() => save('jpg')}><Download size={15} /> Lưu JPG</button></div></div>
        <div className="custom-options">
          <OptionTitle no="01" title="Chọn màu dây" note="Dây phụ phối theo màu bạn chọn" />
          <div className="color-choice-grid">{cordColors.map((color) => <button key={color.id} type="button" className={`color-choice ${cordColor.id === color.id ? 'chosen' : ''}`} onClick={() => setCordColor(color)}><span style={{ background: color.value }} /><b>{color.name}</b>{cordColor.id === color.id && <Check size={13} />}</button>)}</div>
          <p className="custom-note-box">Đã gồm các charm nhỏ phối thêm và dây phụ phù hợp với màu dây.</p>

          <OptionTitle no="02" title="Sắp xếp charm" note="Chọn cách hiển thị trên mô phỏng" />
          <div className="arrangement-grid"><button type="button" className={arrangement === 'manual' ? 'chosen' : ''} onClick={() => { setArrangement('manual'); setActivePosition(0); }}><b>Tự sắp xếp charm</b><small>Bạn chủ động chọn vị trí.</small></button><button type="button" className={arrangement === 'random' ? 'chosen' : ''} onClick={() => setArrangement('random')}><b>Làm sẵn random vị trí charm</b><small>Chạm Ý phối ngẫu nhiên.</small></button></div>
          {arrangement === 'manual' && <div className="manual-position-picker"><b>Chọn vị trí trước, sau đó chọn charm ở bước 3:</b><div>{[0, 1, 2].map((position) => { const item = specialCharms.find((charm) => charm.id === selected[position]); return <button key={position} type="button" className={activePosition === position ? 'active' : ''} onClick={() => setActivePosition(position)}><strong>{position + 1}</strong><span>{item?.name || 'Đang trống'}</span></button>; })}</div></div>}

          <OptionTitle no="03" title="Chọn charm Special" note="Tối thiểu 1 · tối đa 3 charm" />
          <div className="charm-grid special-charm-grid">{specialCharms.map((charm) => { const soldOut = isOutOfStock(charm); return <button key={charm.id} type="button" disabled={soldOut} className={`charm-option ${selected.includes(charm.id) ? 'chosen' : ''} ${soldOut ? 'sold-out' : ''}`} onClick={() => toggleCharm(charm.id)}><span className={charm.tone}><img src={charm.image} alt={charm.name} /></span><b>{charm.name}</b><small>{soldOut ? 'Hết hàng' : money(charm.price)}</small>{selected.includes(charm.id) && <i><Check size={11} /></i>}</button>; })}</div>

          <OptionTitle no="04" title="Chọn mẫu chữ và ghi tên" note="Tối đa 5 chữ · tiếng Anh" />
          <div className="letter-style-grid"><button type="button" className={letterStyle === 'bubble' ? 'chosen' : ''} onClick={() => setLetterStyle('bubble')}><span className="bubble-letter-sample"><i>D</i><i>A</i><i>S</i></span><b>Chữ bong bóng</b></button><button type="button" className={letterStyle === 'basic' ? 'chosen' : ''} onClick={() => setLetterStyle('basic')}><img src="/Chữ Basic.png" alt="Mẫu chữ basic" /><b>Chữ basic</b></button></div>
          <input className="name-input" maxLength="5" value={letters} onChange={(event) => setLetters(event.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())} placeholder="NHẬP 2–5 CHỮ CÁI TIẾNG ANH" />
          {letters.length >= 2 && <div className="name-price-hint">{selectedCount} charm · {letters.length} chữ · {money(total)}</div>}

          <OptionTitle no="05" title="Thanh toán" note="Kiểm tra lại trước khi gửi đơn" />
          <div className="running-total"><span>Tạm tính</span><strong>{money(total)}</strong></div>
          <button className="primary custom-payment-button" type="button" onClick={submit}>Đi đến trang thanh toán <ArrowRight size={17} /></button>
          {validationError && <p className="form-error" role="alert">{validationError}</p>}
        </div>
      </div>
      {pay && <Payment total={total} customOrder cordPrice={23_000} specialSelected={selected.filter(Boolean)} specialCharms={specialCharms} letters={letters} close={() => setPay(false)} />}
    </main>
  );
}

export default Customize;
