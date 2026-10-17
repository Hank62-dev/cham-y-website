export const MIN_LETTERS = 2;
export const MAX_LETTERS = 6;
export const MAX_CHARMS = 3;

// Bảng giá theo số chữ (hàng) và số charm (cột, 0–3). Phải khớp be/src/config/pricing.ts.
export const specialPriceTable = {
  2: { 0: 84_000, 1: 86_000, 2: 88_000, 3: 89_000 },
  3: { 0: 86_000, 1: 87_000, 2: 89_000, 3: 91_000 },
  4: { 0: 87_000, 1: 89_000, 2: 90_000, 3: 92_000 },
  5: { 0: 89_000, 1: 90_000, 2: 92_000, 3: 94_000 },
  6: { 0: 90_000, 1: 92_000, 2: 93_000, 3: 95_000 },
};

export const getSpecialPrice = (charmCount, letters) => specialPriceTable[letters.length]?.[charmCount] ?? 0;

const charmNames = ['Hoa', 'Tim', 'Caro', 'Trăng', 'Mây', 'Gấu', 'Ngôi sao', 'Nơ nhỏ'];
const charmIcons = ['✿', '♥', '▦', '☾', '☁', '♣', '★', '🎀'];
const charmImages = [20, 21, 22, 23, 24, 25, 26, 27];

// Cập nhật số lượng tồn tại đây. Dùng null khi chưa quản lý tồn kho cho mẫu đó.
const charmStocks = [null, null, null, null, null, null, null, null];

export const charms = charmNames.map((name, index) => ({
  id: `charm-${index}`,
  name,
  icon: charmIcons[index],
  image: `/Chạm ý. Charm/${charmImages[index]}.png`,
  tone: index % 2 ? 'pink' : 'lime',
  stock: charmStocks[index],
}));

export const isOutOfStock = (item) => item?.stock !== null && item?.stock <= 0;

const specialCharmFiles = ['Bling Bling.png', 'Bright Silver.png', 'Candy Crush.png', 'Fluffy Guys.png', 'Little Star.png', 'Tiny Flame.png'];

export const specialCharms = specialCharmFiles.map((fileName, index) => ({
    id: `special-${fileName.replace(/\.png$/i, '').toLowerCase().replace(/\s+/g, '-')}`,
    name: fileName.replace(/\.png$/i, ''),
    image: `/ẢNH CHARM SPECIAL/${fileName}`,
    tone: index % 2 ? 'pink' : 'lime',
    price: 9_000,
    stock: null,
  }));

export const specialCharmsAssets = specialCharmFiles.map((fileName, index) => ({
  id: `special-asset-${index + 1}`,
  name: fileName.replace(/\.png$/i, ''),
  image: `/ẢNH CHARM SPECIAL/${fileName}`,
  tone: index % 2 ? 'pink' : 'lime',
  price: 9_000,
  stock: null,
}));

export const products = [
  {
    id: 'japanese-wish',
    name: 'Japanese Wish',
    description: 'Mẫu dây charm mang cảm giác nhẹ nhàng, trong trẻo và đáng yêu.',
    price: 96_000,
    image: '/SẢN PHẨM/Japanese Wish.png',
    accent: '#e8c7cf',
    charmCount: 3,
  },
  {
    id: 'sunny-dream',
    name: 'Sunny Dream',
    description: 'Mẫu phối tươi sáng với những chi tiết nhỏ đầy năng lượng.',
    price: 95_000,
    image: '/SẢN PHẨM/Sunny Dream.png',
    accent: '#d9c26f',
    charmCount: 2,
  },
  {
    id: 'sweet-love',
    name: 'Sweet Love',
    description: 'Mẫu phối ngọt ngào, mềm mại và có một chút lấp lánh.',
    price: 96_000,
    image: '/SẢN PHẨM/Sweet Love.png',
    accent: '#ed9fc0',
    charmCount: 3,
  },
];

export function getReadyMadePrice(product, letters) {
  return getSpecialPrice(product.charmCount, letters);
}

export const getProduct = (id) => products.find((product) => product.id === id) ?? products[0];
