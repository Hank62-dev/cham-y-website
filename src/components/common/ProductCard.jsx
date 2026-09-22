import React from 'react';
import { asset } from '../../lib/assets';
import { money } from '../../lib/formatters';
import { ArrowRight } from 'lucide-react';

function ProductCard({ product, go }) { return <article className="product-card" onClick={() => go?.('detail')}><div className="product-image" style={{ '--accent': product.accent }}><img src={`/MauCoSan/${product.image}`} alt={product.name} /><span>Chạm Ý</span></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>{money(product.price)}</strong></div><button className="card-link">Xem chi tiết <ArrowRight size={13} /></button></article>; }
export default ProductCard;
