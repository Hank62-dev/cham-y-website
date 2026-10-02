import XLSX from 'xlsx';

export function ordersToWorkbook(orders: any[]) {
  const rows = orders.flatMap((order) => order.items.map((item: any) => ({
    'Mã đơn hàng': order.orderCode,
    'Ngày đặt': new Date(order.createdAt).toLocaleDateString('vi-VN'),
    'Giờ đặt': new Date(order.createdAt).toLocaleTimeString('vi-VN'),
    'Tên khách hàng': order.customer.fullName,
    'Số điện thoại': order.customer.phone,
    'Địa chỉ': order.customer.address,
    'Tên sản phẩm': item.productName,
    'Loại sản phẩm': item.productType,
    'Số lượng': item.quantity,
    'Đơn giá': item.unitPrice,
    'Tổng tiền': order.totalAmount,
    'Trạng thái': order.status,
    'Preview URL': order.previewImage?.url || '',
    'Payment Proof URL': order.paymentProofImage?.url || '',
    'Ngày hoàn thành': order.completedAt ? new Date(order.completedAt).toLocaleString('vi-VN') : '',
  })));
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Orders');
  return XLSX.write(book, { type: 'buffer', bookType: 'xlsx' });
}
