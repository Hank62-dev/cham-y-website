import { useState } from 'react';
import { asset } from '../lib/assets';
import { money } from '../lib/formatters';
import { products } from '../data/siteData';
import Payment from '../components/common/Payment';

function ProductDetail({ go }) { const p = products[0]; const [pay, setPay] = useState(false); return <main className="page product-detail"><button className="back-link" onClick={() => go('shop')}>← Quay lại cửa hàng</button><div className="detail-layout"><div className="detail-visual"><img src={`/MauCoSan/${p.image}`} alt={p.name} /><span>Chạm Ý</span></div><div className="detail-copy"><p className="eyebrow">CONCEPT CÓ SẴN</p><h1>{p.name}</h1><strong className="detail-price">{money(p.price)}</strong><p>{p.description} Concept được phối sẵn để bạn có ngay một món phụ kiện nhẹ nhàng nhưng vẫn có điểm nhấn riêng.</p><h3>Sản phẩm gồm:</h3><ul><li>1 dây móc khóa</li><li>1 chữ / tên</li><li>3–4 charm theo concept</li></ul><div className="detail-actions"><button className="primary" onClick={() => setPay(true)}>Thanh toán {money(p.price)} →</button><button className="secondary" onClick={() => go('customize')}>Tự phối lại</button></div></div></div>{pay && <Payment product={p} total={p.price} close={() => setPay(false)} />}</main>; }
export default ProductDetail;

