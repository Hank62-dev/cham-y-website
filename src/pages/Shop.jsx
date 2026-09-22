import React from 'react';
import { products, charms } from '../data/siteData';
import ProductCard from '../components/common/ProductCard';

function Shop({ go }) { return <main className="page"><div className="page-intro"><p className="eyebrow">CỬA HÀNG CHẠM Ý</p><h1>Những món phụ kiện<br /><em>mang dấu ấn riêng.</em></h1><p>Chọn một concept có sẵn hoặc bắt đầu tự phối món đồ của riêng bạn.</p><button className="primary" onClick={() => go('customize')}>Bắt đầu tự phối →</button></div><div className="product-grid shop-grid">{products.map((p) => <ProductCard product={p} go={go} key={p.name} />)}</div><CharmGallery /></main>; }
function CharmGallery() { return <section className="charm-gallery"><div className="section-heading"><div><p className="eyebrow">KHO CHARM CHẠM Ý</p><h2>Nhỏ xinh,<br /><em>nhiều lựa chọn.</em></h2></div><p className="gallery-note">Mỗi chiếc charm là một điểm nhấn để món đồ thật sự thuộc về bạn.</p></div><div className="charm-gallery-grid">{charms.map((c) => <article key={c.id}><img src={c.image} alt={c.name} /><span>{c.name}</span></article>)}</div></section>; }
export default Shop;
export { CharmGallery };

