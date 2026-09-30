import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Guide from '../pages/Guide';
import About from '../pages/About';
import Customize from '../components/customizer/Customize';
import { createPath, getProductId, getRoute } from '../lib/router';

function App() {
  const [location, setLocation] = useState(() => ({
    page: getRoute(),
    productId: getProductId(),
  }));

  useEffect(() => {
    const handlePopState = () => {
      setLocation({ page: getRoute(), productId: getProductId() });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const go = useCallback((page, params = {}) => {
    window.history.pushState({}, '', createPath(page, params));
    setLocation({ page, productId: params.product ?? null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (location.page) {
      case 'shop':
        return <Shop go={go} />;
      case 'detail':
        return <ProductDetail go={go} productId={location.productId} />;
      case 'guide':
        return <Guide />;
      case 'about':
        return <About />;
      case 'customize':
        return <Customize />;
      case 'home':
      default:
        return <Home go={go} />;
    }
  };

  return (
    <>
      <Header page={location.page} go={go} />
      {renderPage()}
      <Footer />
    </>
  );
}

export default App;
