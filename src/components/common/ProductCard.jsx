import { ArrowRight, ShoppingBag } from 'lucide-react';
import { addToCart } from '../../lib/cart';

function ProductCard({ product, go }) {
  const openDetail = () => go?.('detail', { product: product.id || product.productCode || product.slug });

  return (
    <article className="product-card" onClick={openDetail}>
      <div className="product-image" style={{ '--accent': product.accent }}>
        <img src={product.image} alt={product.name} />
        <span>Chạm Ý</span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </div>
      <div className="product-card-actions"><button className="card-link" type="button" onClick={openDetail}>
        Mua hàng <ArrowRight size={13} />
      </button><button className="card-cart-button" type="button" onClick={(event) => { event.stopPropagation(); addToCart(product); }}>
        <ShoppingBag size={13} /> Thêm giỏ
      </button></div>
    </article>
  );
}

export default ProductCard;
