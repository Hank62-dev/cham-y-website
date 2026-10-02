import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, ShoppingBag } from 'lucide-react';
import { toJpeg, toPng } from 'html-to-image';
import Payment from '../components/common/Payment';
import { getProduct, getReadyMadePrice } from '../data/siteData';
import { money } from '../lib/formatters';
import { addToCart } from '../lib/cart';

function ProductDetail({ go, productId }) {
  const product = getProduct(productId);
  const [letters, setLetters] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const detailPreviewRef = useRef(null);
  const price = letters.length >= 2 && letters.length <= 5 ? getReadyMadePrice(product, letters) : 0;

  const updateLetters = (event) => {
    setLetters(event.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase());
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    if (!price) return;
    addToCart(product, { letters }, price);
    setAddedToCart(true);
  };


  const savePreview = async (format) => {
    if (!detailPreviewRef.current || letters.length < 2) return;
    const options = { pixelRatio: 2, backgroundColor: '#f2ecdd', cacheBust: true };
    const dataUrl = format === 'jpg'
      ? await toJpeg(detailPreviewRef.current, { ...options, quality: 0.92 })
      : await toPng(detailPreviewRef.current, options);
    const link = document.createElement('a');
    link.download = `cham-y-${product.name.toLowerCase().replace(/\s+/g, '-')}-${letters}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="page product-detail">
      <button className="back-link" type="button" onClick={() => go('shop')}><ArrowLeft size={15} /> Quay lại cửa hàng</button>
      <div className="detail-layout">
        <div className="detail-preview-column">
          {letters.length >= 2 && <div className="detail-preview-save-actions"><button className="secondary" type="button" onClick={() => savePreview('png')}><Download size={14} /> PNG</button><button className="secondary" type="button" onClick={() => savePreview('jpg')}><Download size={14} /> JPG</button></div>}
          <div ref={detailPreviewRef} className="detail-visual" style={{ '--accent': product.accent }}>
            <img src={product.image} alt={product.name} />
            <span>Chạm Ý</span>
            {letters.length >= 2 && <div className="detail-preview-labels"><b className="detail-product-label">{product.name}</b><span className="detail-user-label">{letters}</span></div>}
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">CONCEPT CÓ SẴN</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h3>Sản phẩm gồm:</h3>
          <ul>
            <li>1 dây móc khóa</li>
            <li>{product.charmCount} charm theo concept</li>
            <li>1 tên riêng theo lựa chọn của bạn</li>
          </ul>
          <label className="detail-name-label" htmlFor="ready-made-name">Chọn tên của bạn</label>
          <input id="ready-made-name" className="name-input" maxLength="5" value={letters} onChange={updateLetters} placeholder="NHẬP 2–5 CHỮ CÁI TIẾNG ANH" />
          {letters.length >= 2 && <p className="name-price-hint">{letters.length} chữ · {money(price)}</p>}
          <div className="detail-total"><span>Giá sản phẩm</span><strong>{price ? money(price) : 'Chọn tên để xem giá'}</strong></div>
          <div className="detail-actions">
            <button className="secondary bubble-button" type="button" disabled={!price} onClick={handleAddToCart}><ShoppingBag size={16} /> {addedToCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}</button>
            <button className="primary bubble-button" type="button" disabled={!price} onClick={() => setIsPaymentOpen(true)}>Mua hàng <ArrowRight size={17} /></button>
            <button className="secondary bubble-button" type="button" onClick={() => go('customize')}>Tự phối lại</button>
          </div>
        </div>
      </div>
      {isPaymentOpen && <Payment product={product} readyMade letters={letters} total={price} previewRef={detailPreviewRef} close={() => setIsPaymentOpen(false)} />}
    </main>
  );
}

export default ProductDetail;
