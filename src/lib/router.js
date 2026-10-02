export const ROUTES = {
  home: '/',
  shop: '/shop',
  detail: '/detail',
  guide: '/guide',
  about: '/about',
  customize: '/customize',
  orders: '/orders',
};

export function getRoute(pathname = window.location.pathname) {
  return Object.entries(ROUTES).find(([, path]) => path === pathname)?.[0] ?? 'home';
}

export function getProductId(search = window.location.search) {
  return new URLSearchParams(search).get('product');
}

export function createPath(page, params = {}) {
  const path = ROUTES[page] ?? ROUTES.home;
  const search = new URLSearchParams(params).toString();
  return search ? `${path}?${search}` : path;
}
