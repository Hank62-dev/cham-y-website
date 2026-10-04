import { useEffect, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { ArrowRight, Check, Download, ExternalLink } from 'lucide-react';
import Preview from './Preview';
import OptionTitle from '../common/OptionTitle';
import Payment from '../common/Payment';
import { getSpecialPrice, isOutOfStock, specialCharms } from '../../data/siteData';
import { money } from '../../lib/formatters';

const cordColors = [
  { id: 'khaki', name: 'Xanh ô liu nhạt / Khaki', value: '#c3c7a4', ink: '#2f3d2d' },
  { id: 'bright-yellow', name: 'Vàng tươi', value: '#f1f071', ink: '#4a481b' },
  { id: 'pale-yellow', name: 'Vàng nhạt', value: '#f1eb73', ink: '#4a481b' },
  { id: 'cyan', name: 'Xanh dương / Cyan trầm', value: '#6aa5c3', ink: '#fff' },
  { id: 'burgundy', name: 'Đỏ đô / Đỏ mận', value: '#942c33', ink: '#fff' },
  { id: 'pale-pink', name: 'Hồng phấn nhạt', value: '#e5cad9', ink: '#6c3c55' },
  { id: 'dusty-rose', name: 'Hồng đất / Be hồng', value: '#ded1c9', ink: '#5d4840' },
  { id: 'pastel-blue', name: 'Xanh pastel / Xanh da trời nhạt', value: '#b8dae3', ink: '#315864' },
  { id: 'mint', name: 'Xanh lá nhạt / Mint pastel', value: '#deead4', ink: '#3f5b3b' },
  { id: 'white', name: 'Trắng', value: '#ffffff', ink: '#2f5b32' },
];

function Customize() {
  const [cordColor, setCordColor] = useState(cordColors[0]);
  const [arrangement, setArrangement] = useState('random');
  const [selected, setSelected] = useState([null, null, null]);
  const [activePosition, setActivePosition] = useState(0);
  const [letterStyle, setLetterStyle] = useState('bubble');
  const [letters, setLetters] = useState('');
  const [pay, setPay] = useState(false);
  const [showSavedDetails, setShowSavedDetails] = useState(false);
  const [validationError, setValidationError] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    const removeCharmFromPreview = (event) => setSelected((current) => {
      const next = [...current];
      next[event.detail] = null;
      return next;
    });
    document.addEventListener('cham-y-remove-charm', removeCharmFromPreview);
    return () => document.removeEventListener('cham-y-remove-charm', removeCharmFromPreview);
  }, []);

  const selectedCount = selected.filter(Boolean).length;
  const total = getSpecialPrice(selectedCount, letters);
  const addCharm = (id) => setSelected((current) => {
    const next = [...current];
    const target = arrangement === 'manual'
      ? activePosition
      : current.findIndex((item) => !item);
    if (target < 0) return current;
    if (arrangement !== 'manual' && current.filter(Boolean).length >= 3) return current;
    next[target] = id;
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
    setShowSavedDetails(true);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      const options = { pixelRatio: 2, backgroundColor: '#f1ebdc', cacheBust: true };
      const dataUrl = format === 'jpg' ? await toJpeg(previewRef.current, { ...options, quality: 0.92 }) : await toPng(previewRef.current, options);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `cham-y-preview.${format}`, { type: blob.type || `image/${format === 'jpg' ? 'jpeg' : 'png'}` });
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS && navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: 'Ảnh preview Chạm Ý' });
      } else if (isIOS) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 60_000);
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
      }
    } finally {
      setShowSavedDetails(false);
    }
  };

  const openPreviewImage = async () => {
    if (!previewRef.current) return;
    const previewWindow = window.open('', '_blank');
    setShowSavedDetails(true);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: '#f1ebdc', cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const imageUrl = URL.createObjectURL(blob);
      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.href = imageUrl;
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
      } else {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
      }
    } catch (error) {
      previewWindow?.close();
      throw error;
    } finally {
      setShowSavedDetails(false);
    }
  };

  useEffect(() => {
    const actions = document.querySelector('.preview-actions');
    if (!actions || actions.querySelector('.preview-open-button')) return undefined;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary preview-open-button';
    button.textContent = 'Mở ảnh để lưu';
    button.addEventListener('click', openPreviewImage);
    actions.appendChild(button);
    return () => button.remove();
  }, [showSavedDetails]);

  return (
    <main className="customizer">
      <div className="custom-head"><div><p className="eyebrow">TỰ PHỐI SẢN PHẨM</p><h1>Tạo sản phẩm<br /><em>của riêng bạn.</em></h1></div><p className="custom-note">Chọn màu dây → phối charm →<br />chọn chữ và tên của bạn.</p></div>
      <div className="custom-layout">
        <div className="preview-wrap"><Preview selected={selected} letters={letters} pack="combo" previewRef={previewRef} charmOptions={specialCharms} cordColor={cordColor.value} cordColorName={cordColor.name} showDetails={showSavedDetails} arrangement={arrangement} letterStyle={letterStyle} /><div className="preview-actions"><button className="secondary" type="button" onClick={() => save('png')}><Download size={15} /> Lưu PNG</button><button className="secondary" type="button" onClick={() => save('jpg')}><Download size={15} /> Lưu JPG</button></div></div>
        <div className="custom-options">
          <OptionTitle no="01" title="Chọn màu dây" note="Dây phụ phối theo màu bạn chọn" />
          <div className="color-choice-grid">{cordColors.map((color) => <button key={color.id} type="button" className={`color-choice ${cordColor.id === color.id ? 'chosen' : ''}`} style={{ '--choice-color': color.value, '--choice-ink': color.ink }} onClick={() => setCordColor(color)}><span style={{ background: color.value }} /><b>{color.name}</b>{cordColor.id === color.id && <Check size={13} />}</button>)}</div>
          <p className="custom-note-box">Đã gồm các charm nhỏ phối thêm và dây phụ phù hợp với màu dây.</p>

          <OptionTitle no="02" title="Sắp xếp charm" note="Chọn cách hiển thị trên mô phỏng" />
          <div className="arrangement-grid"><button type="button" className={arrangement === 'manual' ? 'chosen' : ''} onClick={() => { setArrangement('manual'); setActivePosition(0); }}><b>Tự sắp xếp charm</b><small>Bạn chủ động chọn vị trí.</small></button><button type="button" className={arrangement === 'random' ? 'chosen' : ''} onClick={() => setArrangement('random')}><b>Làm sẵn random vị trí charm</b><small>Chạm Ý phối ngẫu nhiên.</small></button></div>
          {arrangement === 'manual' && <div className="manual-position-picker"><b>Chọn vị trí trước, sau đó chọn charm ở bước 3:</b><div>{[0, 1, 2].map((position) => { const item = specialCharms.find((charm) => charm.id === selected[position]); return <button key={position} type="button" className={activePosition === position ? 'active' : ''} onClick={() => setActivePosition(position)}><strong>{position + 1}</strong><span>{item?.name || 'Đang trống'}</span></button>; })}</div></div>}

          <OptionTitle no="03" title="Chọn charm Special" note="Tối thiểu 1 · tối đa 3 charm" />
          <div className="charm-grid special-charm-grid">{specialCharms.map((charm) => { const soldOut = isOutOfStock(charm); const selectedAmount = selected.filter((item) => item === charm.id).length; return <button key={charm.id} type="button" disabled={soldOut} className={`charm-option ${selectedAmount ? 'chosen' : ''} ${soldOut ? 'sold-out' : ''}`} onClick={() => addCharm(charm.id)}><span className={charm.tone}><img src={charm.image} alt={charm.name} /></span><b>{charm.name}</b><small>{soldOut ? 'Hết hàng' : money(charm.price)}</small>{selectedAmount > 0 && <i>{selectedAmount}</i>}</button>; })}</div>
          <p className="custom-note-box charm-selection-note">Bạn có thể chọn cùng một charm nhiều lần, tối đa 3 charm. <strong>Muốn đổi charm, hãy bấm vào charm đó trong phần preview để bỏ rồi chọn charm mới.</strong></p>

          <OptionTitle no="04" title="Chọn mẫu chữ và ghi tên" note="Tối đa 5 chữ · tiếng Anh" />
          <div className="letter-style-grid"><button type="button" className={letterStyle === 'bubble' ? 'chosen' : ''} onClick={() => setLetterStyle('bubble')}><img className="letter-style-image" src="/ẢNH MẪU CHỮ/Chữ Bong Bóng.png" alt="Mẫu chữ bong bóng" /><b>Chữ bong bóng</b></button><button type="button" className={letterStyle === 'basic' ? 'chosen' : ''} onClick={() => setLetterStyle('basic')}><img className="letter-style-image" src="/ẢNH MẪU CHỮ/Chữ Basic.png" alt="Mẫu chữ basic" /><b>Chữ basic</b></button></div>
          <input className="name-input" maxLength="5" value={letters} onChange={(event) => setLetters(event.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())} placeholder="NHẬP 2–5 CHỮ CÁI TIẾNG ANH" />
          {letters.length >= 2 && <div className="name-price-hint">{selectedCount} charm · {letters.length} chữ · {money(total)}</div>}

          <OptionTitle no="05" title="Thanh toán" note="Kiểm tra lại trước khi gửi đơn" />
          <div className="running-total"><span>Tạm tính</span><strong>{money(total)}</strong></div>
          <button className="primary bubble-button custom-payment-button" type="button" onClick={submit}>Đi đến trang thanh toán <ArrowRight size={17} /></button>
          {validationError && <p className="form-error" role="alert">{validationError}</p>}
        </div>
      </div>
      {pay && <Payment total={total} customOrder specialSelected={selected.filter(Boolean)} specialCharms={specialCharms} letters={letters} previewRef={previewRef} customizationData={{ cordColor: cordColor.value, arrangement, letterStyle }} close={() => setPay(false)} />}
    </main>
  );
}

export default Customize;
