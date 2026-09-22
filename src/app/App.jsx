import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Guide from '../pages/Guide';
import About from '../pages/About';
import Customize from '../components/customizer/Customize';

function App() { const routeMap = { '/': 'home', '/shop': 'shop', '/detail': 'detail', '/guide': 'guide', '/about': 'about', '/customize': 'customize' }; const pathMap = Object.fromEntries(Object.entries(routeMap).map(([path, page]) => [page, path])); const [page, setPage] = useState(routeMap[window.location.pathname] || 'home'); useEffect(() => { const onPopState = () => setPage(routeMap[window.location.pathname] || 'home'); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []); const go = (next) => { const path = pathMap[next] || '/'; window.history.pushState({ page: next }, '', path); setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); }; return <><Header page={page} go={go} />{page === 'home' ? <Home go={go} /> : page === 'shop' ? <Shop go={go} /> : page === 'detail' ? <ProductDetail go={go} /> : page === 'guide' ? <Guide /> : page === 'about' ? <About /> : <Customize />}<Footer /></>; }

export default App;

