# Chạm Ý Admin Dashboard

Tài liệu này mô tả cách trang Admin vận hành, các trạng thái đơn hàng, quản lý sản phẩm có sẵn và cơ chế tồn kho.

## 1. Tổng quan

Trang Admin dùng để:

- Theo dõi thống kê đơn hàng và doanh thu.
- Tìm kiếm, lọc và phân trang danh sách đơn hàng.
- Xem chi tiết thông tin khách hàng, sản phẩm, preview và ảnh chuyển khoản.
- Cập nhật trạng thái đơn hàng.
- Quản lý sản phẩm có sẵn.
- Quản lý số lượng tồn kho sản phẩm hoàn chỉnh.
- Đăng bán hoặc ngừng bán sản phẩm.
- Thêm, sửa và xóa sản phẩm.
- Xuất danh sách đơn hàng ra Excel.

Admin chỉ quản lý sản phẩm có sẵn. Sản phẩm tự phối được lưu trong đơn hàng thông qua dữ liệu custom và preview của khách hàng.

## 2. Đăng nhập và phiên Admin

Admin truy cập trang `/admin` và đăng nhập bằng mật khẩu được kiểm tra ở Backend.

Mật khẩu không được lưu trong Frontend. Backend dùng hash mật khẩu trong biến môi trường `ADMIN_PASSWORD_HASH`.

Sau khi đăng nhập thành công:

- Backend cấp access token.
- Backend cấp refresh token.
- Frontend lưu token trong `localStorage`.
- Các API Admin gửi access token qua header `Authorization: Bearer <token>`.

### Refresh token

Khi access token hết hạn và API trả về `401`:

1. Frontend tự gọi `POST /api/admin/refresh`.
2. Backend kiểm tra refresh token.
3. Backend cấp access token mới.
4. Frontend lưu token mới.
5. Request ban đầu được gửi lại tự động.

Nếu refresh token cũng hết hạn hoặc không hợp lệ, Admin phải đăng nhập lại.

Biến môi trường liên quan:

```env
JWT_SECRET=
JWT_REFRESH_SECRET=
ADMIN_PASSWORD_HASH=
```

## 3. Dashboard tổng quan

Dashboard hiển thị 4 thẻ thống kê:

| Thẻ | Ý nghĩa |
|---|---|
| Tổng đơn hàng | Tổng số đơn trong hệ thống |
| Tổng thu nhập | Tổng tiền của các đơn `COMPLETED` |
| Đã hoàn thành | Số đơn có trạng thái `COMPLETED` |
| Chưa hoàn thành | Số đơn `PENDING` và `PROCESSING` |

Doanh thu không tính đơn bị từ chối.

## 4. Danh sách đơn hàng

Bảng đơn hàng hiển thị:

- Mã đơn.
- Tên khách hàng và số điện thoại.
- Ngày đặt.
- Số lượng sản phẩm.
- Tổng tiền.
- Trạng thái.
- Menu thao tác.

Các chức năng hỗ trợ:

- Tìm theo tên khách hàng, mã đơn hoặc số điện thoại.
- Lọc theo trạng thái.
- Phân trang.
- Chọn số dòng hiển thị: 5, 10 hoặc 20.
- Click vào mã đơn để mở chi tiết.
- Menu thao tác dạng ba chấm.
- Loading bằng spinner.
- Hiển thị “Chưa có đơn hàng” khi không có dữ liệu.

## 5. Các trạng thái đơn hàng

### `PENDING` — Chưa hoàn thành

Đây là trạng thái mặc định sau khi khách tạo đơn thành công.

Admin có thể:

- Bắt đầu xử lý đơn.
- Từ chối xử lý đơn.

### `PROCESSING` — Đang xử lý đơn

Đơn đang được Admin tiếp nhận và xử lý.

Admin có thể:

- Đánh dấu đã hoàn thành.
- Từ chối xử lý đơn.

### `COMPLETED` — Đã hoàn thành

Đơn đã được xử lý xong.

Khi chuyển sang trạng thái này:

- Lưu thời gian `completedAt`.
- Doanh thu được tính vào Dashboard.
- Khách hàng xem được trạng thái “Đã hoàn thành”.
- Không còn nút “Mở lại đơn”.
- Backend chặn việc chuyển ngược về `PENDING`.

### `REJECTED` — Từ chối xử lý

Dùng khi ảnh chuyển khoản không hợp lệ, thông tin sai hoặc đơn không thể tiếp tục xử lý.

Khi từ chối:

- Admin bắt buộc nhập lý do.
- Lý do được lưu trong `rejectionReason`.
- Khách hàng xem được lý do từ chối.
- Nếu đơn đã giữ tồn kho, tồn kho được hoàn lại.
- Có thể mở lại đơn.

## 6. Luồng cập nhật trạng thái

Luồng thông thường:

```text
PENDING
   ↓ Bắt đầu xử lý
PROCESSING
   ↓ Đánh dấu hoàn thành
COMPLETED
```

Luồng từ chối:

```text
PENDING hoặc PROCESSING
   ↓ Từ chối + nhập lý do
REJECTED
   ↓ Mở lại đơn
PENDING
```

Đơn `COMPLETED` không được mở lại.

Mọi thay đổi trạng thái đều được cập nhật qua Backend và đồng bộ cho trang “Đơn hàng của tôi” bên khách hàng.

## 7. Chi tiết đơn hàng

Trang chi tiết hiển thị:

### Thông tin đơn

- Mã đơn.
- Ngày và giờ tạo.
- Trạng thái hiện tại.
- Số lượng sản phẩm.
- Lý do từ chối nếu có.

### Thông tin khách hàng

- Họ tên.
- Số điện thoại.
- Địa chỉ nhận hàng.

### Sản phẩm

Mỗi sản phẩm hiển thị:

- Ảnh sản phẩm.
- Tên sản phẩm.
- Loại sản phẩm.
- Số lượng.
- Đơn giá.
- Thành tiền.

Ảnh sản phẩm có thể click để mở lightbox và zoom.

### Thanh toán và preview

- Tổng tiền.
- Ảnh chuyển khoản.
- Ảnh preview sản phẩm.

Ảnh chuyển khoản và preview đều có thể click để xem lớn, zoom bằng các nút `-`, `100%`, `+`.

### Xác nhận hoàn thành

Nút “Đánh dấu đã hoàn thành” luôn hiển thị popup xác nhận trước khi cập nhật.

Popup có:

- Tiêu đề xác nhận.
- Nút Hủy.
- Nút Xác nhận hoàn thành.
- Spinner khi đang gửi request.

Popup ở trang chi tiết và popup trong menu của bảng dùng chung một giao diện.

## 8. Quản lý sản phẩm và tồn kho

Trang “Sản phẩm & tồn kho” chỉ quản lý sản phẩm có sẵn.

### Thông tin sản phẩm

Mỗi sản phẩm gồm:

- Mã sản phẩm.
- Tên sản phẩm.
- Slug.
- Mô tả.
- Ảnh sản phẩm.
- Số lượng charm.
- Số lượng tồn kho.
- Ngưỡng cảnh báo tồn kho.
- Bật/tắt quản lý tồn kho.
- Đang bán hoặc ngừng bán.

### Các thao tác sản phẩm

Menu ba chấm có các thao tác:

- Sửa sản phẩm.
- Tồn kho.
- Đăng bán hoặc Ngừng bán.
- Xóa sản phẩm.

Các thao tác xóa, đăng bán và ngừng bán đều có popup xác nhận và spinner khi đang xử lý.

### Thêm và sửa sản phẩm

Form hỗ trợ:

- Nhập thông tin sản phẩm.
- Chọn ảnh từ máy.
- Nhập URL ảnh.
- Xem preview ảnh trước khi lưu.
- Click ảnh preview để mở lightbox và zoom.
- Bật quản lý tồn kho bằng toggle.
- Bật hiển thị sản phẩm trên cửa hàng bằng toggle.

Ảnh upload được gửi lên Cloudinary. Database chỉ lưu URL và public ID ảnh.

### Tồn kho

Admin nhập số lượng sản phẩm hoàn chỉnh đang có trong kho.

Nếu sản phẩm bật quản lý tồn kho:

- Số lượng tồn được dùng để kiểm tra khi khách đặt hàng.
- Không cho tồn kho xuống số âm.
- Có thể đặt ngưỡng cảnh báo riêng cho từng sản phẩm.

Nếu chưa bật quản lý tồn kho:

- Không trừ tồn kho khi tạo đơn.
- Bảng hiển thị badge “Chưa bật tồn kho”.

## 9. Cảnh báo tồn kho

Khi:

```text
stock <= lowStockThreshold
```

hệ thống sẽ:

- Tăng số lượng trong card “Sắp hết hàng”.
- Hiển thị số tồn kho màu đỏ.
- Hiển thị badge “⚠ Sắp hết hàng” trong bảng.

## 10. Cơ chế trừ và hoàn tồn kho

Hệ thống dùng cơ chế giữ tồn kho ngay khi tạo đơn.

### Khi tạo đơn

Nếu sản phẩm đã bật quản lý tồn kho:

1. Backend kiểm tra sản phẩm còn bán.
2. Backend kiểm tra đủ số lượng tồn.
3. Backend trừ số lượng tương ứng.
4. Đơn được đánh dấu `stockReserved = true`.

Nếu không đủ tồn kho, đơn không được tạo.

### Khi đơn đang xử lý hoặc hoàn thành

Tồn kho không bị trừ thêm. Số lượng đã được giữ từ lúc tạo đơn.

### Khi từ chối đơn

Nếu `stockReserved = true`:

1. Backend hoàn lại số lượng đã giữ.
2. Đặt `stockReserved = false`.
3. Lưu lý do từ chối.

### Khi mở lại đơn bị từ chối

Backend kiểm tra tồn kho lại:

- Đủ hàng: trừ lại tồn kho và chuyển đơn về `PENDING`.
- Không đủ hàng: từ chối thao tác mở lại.

### Khi mở lại đơn đã hoàn thành

Không cho phép mở lại. Điều này tránh việc thay đổi lại lịch sử đơn đã hoàn tất và tránh sai lệch tồn kho.

## 11. Xuất Excel

Admin có thể chọn trạng thái trước khi xuất:

- Tất cả trạng thái.
- Chưa hoàn thành.
- Đang xử lý.
- Đã hoàn thành.
- Từ chối xử lý.

File Excel gồm các thông tin chính:

- Mã đơn hàng.
- Ngày và giờ đặt.
- Tên khách hàng.
- Số điện thoại.
- Địa chỉ.
- Tên sản phẩm.
- Loại sản phẩm.
- Số lượng.
- Đơn giá.
- Tổng tiền.
- Trạng thái.
- Preview URL.
- Payment Proof URL.
- Ngày hoàn thành.

## 12. API Admin chính

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/api/admin/login` | Đăng nhập Admin |
| POST | `/api/admin/refresh` | Làm mới access token |
| GET | `/api/admin/dashboard` | Lấy thống kê Dashboard |
| GET | `/api/admin/orders` | Danh sách đơn, search, filter, pagination |
| GET | `/api/admin/orders/:id` | Chi tiết đơn hàng |
| PATCH | `/api/admin/orders/:id/status` | Cập nhật trạng thái |
| GET | `/api/admin/orders/export` | Xuất Excel |
| GET | `/api/admin/products` | Danh sách sản phẩm |
| GET | `/api/admin/products/:id` | Chi tiết sản phẩm |
| POST | `/api/admin/products` | Thêm sản phẩm |
| PATCH | `/api/admin/products/:id` | Sửa sản phẩm |
| PATCH | `/api/admin/products/:id/stock` | Cập nhật tồn kho |
| PATCH | `/api/admin/products/:id/active` | Đăng bán hoặc ngừng bán |
| DELETE | `/api/admin/products/:id` | Xóa sản phẩm |

Tất cả API Admin, ngoại trừ `login` và `refresh`, đều yêu cầu access token hợp lệ.

## 13. Lưu trữ ảnh

Ảnh sản phẩm, ảnh preview và ảnh chuyển khoản được upload lên Cloudinary.

MongoDB chỉ lưu:

```ts
{
  url: string,
  publicId: string | null
}
```

Không lưu ảnh dạng base64 hoặc binary trong MongoDB.

## 14. Môi trường triển khai

Backend trên Render cần có:

```env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
ADMIN_PASSWORD_HASH=
FRONTEND_URL=
ADMIN_FRONTEND_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend khách hàng trên Vercel dùng:

```env
VITE_API_URL=https://<backend>.onrender.com/api
```

Admin Frontend cũng dùng cùng Backend API URL.

## 15. Flow vận hành mẫu

### Đơn sản phẩm có sẵn

```text
Khách thêm sản phẩm vào giỏ
→ Nhập tên mong muốn
→ Chọn sản phẩm cần thanh toán
→ Nhập thông tin nhận hàng
→ Upload ảnh chuyển khoản
→ Gửi đơn
→ Backend kiểm tra giá và tồn kho
→ Trừ tồn kho nếu bật quản lý
→ Đơn ở trạng thái PENDING
→ Admin bắt đầu xử lý
→ PROCESSING
→ Admin hoàn thành
→ COMPLETED
```

### Đơn bị từ chối và mở lại

```text
PENDING hoặc PROCESSING
→ Admin nhập lý do từ chối
→ REJECTED
→ Hoàn tồn kho nếu có giữ hàng
→ Admin mở lại
→ Kiểm tra tồn kho
→ Trừ lại tồn kho
→ PENDING
```

### Đơn tự phối

```text
Khách tự phối sản phẩm
→ Tạo preview
→ Thanh toán trực tiếp
→ Không đi qua giỏ hàng
→ Preview được gửi cùng đơn
→ Admin xem preview và ảnh chuyển khoản
```

Sản phẩm tự phối không sử dụng tồn kho sản phẩm có sẵn.

