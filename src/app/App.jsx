import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Guide from '../pages/Guide';
import About from '../pages/About';
import Orders from '../pages/Orders';
import CartDrawer from '../components/common/CartDrawer';
import { readCart } from '../lib/cart';
import Customize from '../components/customizer/Customize';
import { createPath, getProductId, getRoute } from '../lib/router';
import { products as fallbackProducts } from '../data/siteData';
import { fetchProducts, recordVisitorHeartbeat } from '../lib/api';

function App() {
  const [location, setLocation] = useState(() => ({
    page: getRoute(),
    productId: getProductId(),
  }));
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState(fallbackProducts);
  const [cartCount, setCartCount] = useState(() => readCart().reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    fetchProducts().then((items) => { if (Array.isArray(items) && items.length) setProducts(items); }).catch(() => {});
  }, []);

  useEffect(() => {
    const sendHeartbeat = () => recordVisitorHeartbeat().catch(() => {});
    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCart = () => setCartCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    window.addEventListener('cart-updated', updateCart);
    return () => window.removeEventListener('cart-updated', updateCart);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setLocation({ page: getRoute(), productId: getProductId() });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const revealTargets = document.querySelectorAll([
      'main > section', 'main > .page-intro', 'main > .detail-layout',
      'main > .custom-head', 'main > .custom-layout', 'main > .guide-banner',
      'main > .order-guide', 'main > .benefits', 'main .hero > div',
      'main .intro > *', 'main .section-heading > *', 'main .features > *',
      'main .product-grid > *', 'main .shop-grid > *', 'main .steps > *',
      'main .about > *', 'main .benefit-list > *', 'main .custom-options > *',
    ].join(','));

    const pageTargets = [...revealTargets].filter((element) => !element.closest('.customizer'));
    pageTargets.forEach((element) => element.classList.add('scroll-reveal'));
    if (!('IntersectionObserver' in window)) {
      pageTargets.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    pageTargets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.page]);

  useEffect(() => {
    document.querySelectorAll('button:not(.close):not(.menu-toggle), .social-actions a, .contact-actions a')
      .forEach((element) => element.classList.add('bubble-button'));
  });

  const go = useCallback((page, params = {}) => {
    window.history.pushState({}, '', createPath(page, params));
    setLocation({ page, productId: params.product ?? null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (location.page) {
      case 'shop':
        return <Shop go={go} products={products} />;
      case 'detail':
        return <ProductDetail go={go} productId={location.productId} products={products} />;
      case 'guide':
        return <Guide go={go} />;
      case 'about':
        return <About go={go} />;
      case 'orders':
        return <Orders />;
      case 'customize':
        return <Customize />;
      case 'home':
      default:
        return <Home go={go} />;
    }
  };

  return (
    <>
      <Header page={location.page} go={go} cartCount={cartCount} openCart={() => setCartOpen(true)} />
      {renderPage()}
      <Footer />
      {cartOpen && <CartDrawer close={() => setCartOpen(false)} />}
    </>
  );
}

export default App;
