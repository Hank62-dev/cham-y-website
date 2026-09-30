const vietnameseCurrency = new Intl.NumberFormat('vi-VN');

export const money = (value) => `${vietnameseCurrency.format(value)}đ`;
