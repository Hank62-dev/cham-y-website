import { useState } from 'react';
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react';
import { asset } from '../../lib/assets';

function Header({ page, go, cartCount = 0, openCart }) {
  const [open, setOpen] = useState(false);
  const navigate = (next) => {
    setOpen(false);
    go(next);
  };

  const navigation = [
    ['home', 'Trang chủ'],
    ['shop', 'Cửa hàng'],
    ['guide', 'Hướng dẫn'],
    ['about', 'Về Chạm Ý'],
    ['orders', 'Đơn hàng của tôi'],
  ];

  return (
    <>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigate('home')}>
          <img src={asset('logoChamY-cream.png')} alt="Logo Chạm Ý" />
          <span>CHẠM Ý<small>chạm vào cá tính</small></span>
        </button>

        <button
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={open ? 'mobile-open' : ''}>
          {navigation.map(([key, label]) => (
            <button className={page === key ? 'active' : ''} type="button" onClick={() => navigate(key)} key={key}>
              {label}
            </button>
          ))}
          <button className="mobile-customize" type="button" onClick={() => navigate('customize')}>
            Tự phối ngay <ArrowUpRight size={17} />
          </button>
        </nav>

        <button className="nav-cta" type="button" onClick={() => navigate('customize')}>
          Tự phối ngay <span>↗</span>
        </button>
        <button className="cart-button" type="button" onClick={openCart} aria-label="Mở giỏ hàng"><ShoppingBag size={17} /><span>{cartCount}</span></button>
      </header>
      {open && <button className="mobile-menu-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Đóng menu" />}
    </>
  );
}
export default Header;
