const VN_MOBILE = /^0(3|5|7|8|9)\d{8}$/;

/**
 * Chuẩn hoá số điện thoại Việt Nam người dùng nhập khi tra cứu (bỏ khoảng trắng, dấu chấm, gạch;
 * đổi +84/84 về 0) và trả về các dạng có thể đang lưu trong đơn hàng: `0xxxxxxxxx` và `+84xxxxxxxxx`.
 * Trả về null nếu không phải số di động Việt Nam hợp lệ.
 */
export function phoneVariants(input: string) {
  let digits = input.replace(/[\s.\-()]/g, '');
  if (digits.startsWith('+84')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('84') && digits.length === 11) digits = `0${digits.slice(2)}`;
  if (!VN_MOBILE.test(digits)) return null;
  return [digits, `+84${digits.slice(1)}`];
}
