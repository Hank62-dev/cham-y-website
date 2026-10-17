export const PRICE_MATRIX: Record<number, Record<number, number>> = {
  2: { 0: 84000, 1: 86000, 2: 88000, 3: 89000 },
  3: { 0: 86000, 1: 87000, 2: 89000, 3: 91000 },
  4: { 0: 87000, 1: 89000, 2: 90000, 3: 92000 },
  5: { 0: 89000, 1: 90000, 2: 92000, 3: 94000 },
  6: { 0: 90000, 1: 92000, 2: 93000, 3: 95000 },
};

export function getMatrixPrice(letterCount: number, charmCount: number) {
  return PRICE_MATRIX[letterCount]?.[charmCount] || 0;
}
