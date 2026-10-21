# Xác minh xác thực FitManager

Thực hiện các bước kiểm tra này trên một dự án Supabase chạy cục bộ sau khi tạo một tài khoản chủ sở hữu (`owner`) và một tài khoản kiểm thử chỉ có quyền khách hàng (`customer-only`). Không sử dụng tài khoản khách hàng thật để thực hiện các bài kiểm thử có tính phá hủy dữ liệu.

## Các trường hợp kiểm thử

| Trường hợp | Kết quả mong đợi |
|---|---|
| Truy cập `/vi/dashboard` khi chưa có phiên đăng nhập | Chuyển hướng đến `/vi/auth/login` |
| Truy cập `/en/dashboard/customers` khi chưa có phiên đăng nhập | Chuyển hướng đến `/en/auth/login` |
| Đăng nhập bằng mật khẩu không hợp lệ | Hiển thị thông báo lỗi thông tin đăng nhập chung, được bản địa hóa; không tạo phiên đăng nhập |
| Đăng nhập bằng tài khoản `owner` đang hoạt động | Chuyển hướng đến trang tổng quan (`dashboard`) tương ứng với ngôn ngữ hiện tại |
| Đăng nhập bằng tài khoản `trainer` đang hoạt động | Chuyển hướng đến trang tổng quan (`dashboard`) tương ứng với ngôn ngữ hiện tại |
| Đăng nhập bằng tài khoản chỉ có quyền khách hàng | Chuyển hướng đến trang đăng nhập theo ngôn ngữ hiện tại kèm thông báo lỗi về quyền truy cập |
| Tải lại trang tổng quan | Phiên đăng nhập vẫn được duy trì thông qua cookie SSR của Supabase |
| Đăng xuất | Phiên đăng nhập bị thu hồi và người dùng được chuyển về trang đăng nhập theo ngôn ngữ hiện tại |
| Phiên đăng nhập hết hạn hoặc bị thu hồi, sau đó truy cập trang tổng quan | Middleware hoặc cơ chế bảo vệ phía máy chủ chuyển hướng người dùng đến trang đăng nhập theo ngôn ngữ hiện tại |
| Thay đổi đường dẫn từ `/vi/...` sang `/en/...` | Trang tương ứng vẫn mở được bằng ngôn ngữ mới |

## Kiểm tra cơ sở dữ liệu

1. Mở SQL Editor trong Supabase và chạy tệp `supabase/verification.sql`.
2. Xác nhận tất cả bảng riêng tư được liệt kê đều có `rls_enabled = true`.
3. Sử dụng khóa `anon` để xác nhận các bảng riêng tư không trả về bản ghi nào và RPC tư vấn (`consultation RPC`) là con đường công khai duy nhất để tiếp nhận dữ liệu.
4. Sử dụng phiên đăng nhập của tài khoản `owner` để xác nhận khả năng truy cập thông tin hồ sơ (`profile`) và quyền người dùng (`role`) hoạt động chính xác.
5. Sử dụng phiên đăng nhập của tài khoản chỉ có quyền khách hàng để xác nhận các bảng dành cho huấn luyện viên bị RLS từ chối truy cập, ngay cả khi yêu cầu được tạo thủ công.

## Ghi chú về kiểm thử tự động

Dự án hiện chưa có thư viện hoặc công cụ chạy kiểm thử. Các bước trên được chủ động ghi lại dưới dạng danh sách kiểm thử tích hợp.

Có thể bổ sung Playwright hoặc Vitest trong một giai đoạn riêng khi đã có môi trường kiểm thử và dự án Supabase dành riêng cho kiểm thử.