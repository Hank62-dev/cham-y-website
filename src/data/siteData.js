export const charmPrice = 9000;
export const namePrices = { 2: 49000, 3: 58000, 4: 67000, 5: 76000, 6: 85000 };
export const charms = ['Hoa', 'Tim', 'Caro', 'Trăng', 'Mây', 'Gấu', 'Ngôi sao', 'Nơ nhỏ'].map((name, i) => ({ id: `charm-${i}`, name, icon: ['✿', '♥', '▦', '☾', '☁', '♣', '★', '🎀'][i], image: `/CacLoaiCharm/${[13, 14, 8, 12, 11, 10, 12, 7][i]}.png`, tone: i % 2 ? 'pink' : 'lime' }));
export const products = [
  ['Pastel Garden', 79000, 'Màu pastel dịu dàng, nhiều charm hoa và chi tiết đáng yêu.', '#8ebbd0', '1790016790488_1948115482574023851_g2059885459125728308_1d5b980704fafd72212cba03150e239f.jpg'],
  ['Spider Parker', 85000, 'Cá tính với dây xanh, chữ nổi và những điểm nhấn mạnh mẽ.', '#e33fa9', '1790016790508_1948115482574023851_g2059885459125728308_7b724e5a5d3f1e6f022b66163cea3826.jpg'],
  ['Sunny Name', 82000, 'Tươi sáng với bảng màu vàng xanh và tên riêng nổi bật.', '#a8ca13', '1790016790520_1948115482574023851_g2059885459125728308_b2efbfcbe04b2da77b806e4938004ef1.jpg'],
  ['Blue Bloom', 79000, 'Nhẹ nhàng, trong trẻo với chữ màu pastel và dây phối xanh.', '#d7c6a6', '1790016790532_1948115482574023851_g2059885459125728308_6ca9e1235113aa37ee16070b36ee7c0c.jpg'],
  ['Sweet Heart', 85000, 'Hồng ngọt ngào, mềm mại và có một chút lấp lánh.', '#e9a1bf', '1790016790543_1948115482574023851_g2059885459125728308_f5bc7f18cbbd9ffda8776b41b922b9c1.jpg']
].map(([name, price, description, accent, image]) => ({ name, price, description, accent, image }));

