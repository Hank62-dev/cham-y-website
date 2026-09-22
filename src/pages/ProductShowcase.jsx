import React from 'react';
import { products } from '../data/siteData';
import ProductCard from '../components/common/ProductCard';
import { ArrowUpRight } from 'lucide-react';

function ProductShowcase({ go }) { return <section className="products"><div className="section-heading"><div><p className="eyebrow">ĐÃ ĐƯỢC TẠO RA</p><h2>Những “cái riêng”<br />được yêu thích.</h2></div><button className="text-button" onClick={() => go('shop')}>Xem tất cả <ArrowUpRight size={15} /></button></div><div className="product-grid">{products.slice(0, 3).map((p) => <ProductCard product={p} go={go} key={p.name} />)}</div></section>; }
export default ProductShowcase;
