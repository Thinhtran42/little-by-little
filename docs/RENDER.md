# Demo trên Render Free

`render.yaml` tạo web service Docker và PostgreSQL 17, cùng vùng Singapore, đều `plan: free`. Database chỉ cho kết nối nội bộ. Render tự cung cấp DATABASE_URL; ứng dụng nhận RENDER_EXTERNAL_URL làm origin HTTPS nếu không đặt PUBLIC_ORIGIN.

## Triển khai bằng dashboard

1. Đưa mã nguồn lên một repo GitHub/GitLab mà tài khoản Render có quyền đọc. Có thể dùng repo private. Không upload `.env`, `.env.render`, `.data`, `node_modules` hoặc backup database.
2. Đăng nhập https://dashboard.render.com/ và chọn **New → Blueprint**, kết nối repo.
3. Chọn `render.yaml` tại thư mục gốc. Xác nhận cả hai tài nguyên dùng **Free**. Nếu tài khoản không đủ điều kiện tạo database Free hoặc giao diện báo phí, dừng để chọn phương án khác; không tự nâng gói.
4. Deploy Blueprint. Startup tự tạo schema và nạp 640 câu vào database mới; không tự chuyển tài khoản/database trên máy lên cloud.
5. Khi service báo Live, mở URL Render cấp và `/api/health`. Đăng ký tài khoản thử, lưu mã khôi phục, học một câu, tải lại và thử đăng nhập ở cửa sổ khác.

Để trợ lý triển khai qua API khi không có trình duyệt kết nối: tạo API key trong phần Account Settings của Render, copy `.env.render.example` thành `.env.render`, điền key tại máy và cung cấp link repo nguồn. `.env.render` đã được loại khỏi Git và Docker image. Không đặt deployment key trong biến môi trường của web app.

## Giới hạn demo

Render Free web ngủ sau 15 phút không có lưu lượng; lượt mở tiếp theo có thể chậm. PostgreSQL Free hết hạn sau 30 ngày; cần xuất dữ liệu trước khi hết hạn nếu muốn giữ. Link chỉ được xác nhận sau khi deployment Live và kiểm tra HTTPS thật.

Nếu dùng tên miền riêng sau này, đặt PUBLIC_ORIGIN thành origin HTTPS tương ứng. Cookie vẫn Secure/HttpOnly; không tắt kiểm tra Origin để xử lý đăng nhập lỗi.

Tham khảo: https://render.com/docs/infrastructure-as-code và https://render.com/docs/free.
