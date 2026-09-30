import { ArrowRight } from 'lucide-react';

function ProductCard({ product, go }) {
  const openDetail = () => go?.('detail', { product: product.id });

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
      <button className="card-link" type="button" onClick={openDetail}>
        Mua hàng <ArrowRight size={13} />
      </button>
    </article>
  );
}

export default ProductCard;
