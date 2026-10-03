export const charmPrice = 9_000;

// Bảng giá tên theo số ký tự trong note sản phẩm.
export const namePrices = {
  2: 49_000,
  3: 58_000,
  4: 67_000,
  5: 76_000,
};

export const specialPriceTable = {
  2: { 1: 86_000, 2: 88_000, 3: 89_000 },
  3: { 1: 87_000, 2: 89_000, 3: 91_000 },
  4: { 1: 89_000, 2: 90_000, 3: 92_000 },
  5: { 1: 90_000, 2: 92_000, 3: 94_000 },
};

export const getSpecialPrice = (charmCount, letters) => specialPriceTable[letters.length]?.[charmCount] ?? 0;

const charmNames = ['Hoa', 'Tim', 'Caro', 'Trăng', 'Mây', 'Gấu', 'Ngôi sao', 'Nơ nhỏ'];
const charmIcons = ['✿', '♥', '▦', '☾', '☁', '♣', '★', '🎀'];
const charmImages = [13, 14, 8, 12, 11, 10, 12, 7];

// Cập nhật số lượng tồn tại đây. Dùng null khi chưa quản lý tồn kho cho mẫu đó.
const charmStocks = [null, null, null, null, null, null, null, null];

export const charms = charmNames.map((name, index) => ({
  id: `charm-${index}`,
  name,
  icon: charmIcons[index],
  image: `/CacLoaiCharm/${charmImages[index]}.png`,
  tone: index % 2 ? 'pink' : 'lime',
  stock: charmStocks[index],
}));

export const isOutOfStock = (item) => item?.stock !== null && item?.stock <= 0;

export const specialCharms = ['Bling Bling.png', 'Bright Silver.png', 'Candy Crush.png', 'Fluffy Guys.png', 'Hoa Hoè.png', 'Little Star.png', 'Twisted Heart.png'].map((fileName, index) => ({
    id: `special-${fileName.replace(/\.png$/i, '').toLowerCase().replace(/\s+/g, '-')}`,
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
