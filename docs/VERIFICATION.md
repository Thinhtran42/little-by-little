# Kiểm chứng ngày 07/09/2026

- 13 unit tests: nội dung, chấm đáp án, migration, lịch ôn, lượt trùng và kế hoạch ngày.
- 11 API tests trên PostgreSQL nhúng PGlite riêng: hash mật khẩu, session, CSRF/Origin, cô lập người học, chấm trên server, retry/concurrency, rollback, quyền admin, import, recovery và xóa cascade.
- 11 browser tests trên React + Fastify + PostgreSQL 17 thật: học, hội thoại, sao lưu, mobile, bàn phím, mic giả, tài khoản hai phiên và mạng lỗi.
- 1 test PWA production: tải lại, điều hướng và học ở chế độ dùng thử khi ngoại tuyến.
- 10 browser tests chạy lại trên Docker image production, PostgreSQL thật, cookie Secure và CSP bật. Dùng loopback HTTP của Chromium để kiểm thử; chưa xác nhận tên miền/TLS thật.
- Vite production build và Docker image `little-by-little:3.0.0` thành công.
- Axe WCAG 2 A/AA không phát hiện vi phạm trên home, practice, insights và account; báo cáo ở `artifacts/accessibility.json`, ảnh ở `artifacts/v3-*.png`.
- npm audit báo 0 lỗ hổng tại thời điểm kiểm tra. Không phải kiểm toán bảo mật độc lập.

Luồng tài khoản đã kiểm tra đáp án được lưu duy nhất một lần sau retry, ngày ôn giữ dạng YYYY-MM-DD, không ghi bài làm tài khoản vào localStorage dùng thử, đọc lại trên phiên trình duyệt khác, phục hồi sau lỗi tải tiến độ và quay lại đăng nhập khi session đã bị thu hồi. Tài khoản thử được dọn sau kiểm tra.

Chạy lại bộ chính: `npm run check`. Khi đã khởi động container production ở port 4180, chạy `npx playwright test --config playwright.release.config.js`; có thể đặt `RELEASE_URL` để đổi địa chỉ staging. Bộ này tạo và xóa tài khoản với email ngẫu nhiên thuộc `example.test`.

Chưa kiểm thử tải lớn, thiết bị iOS/Android thật, SMTP, thanh toán hoặc triển khai công khai. Không có số liệu chứng minh hiệu quả giao tiếp của riêng sản phẩm.
