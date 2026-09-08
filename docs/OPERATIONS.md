# Vận hành, log, cảnh báo và CI/CD

## Log hiện tại đi đâu?

- **Runtime log của backend**: Fastify ghi JSON ra stdout/stderr. Render thu thập các dòng này tại **Dashboard → little-by-little-demo → Logs**. Đây là nơi xem request, lỗi database, lỗi khởi động và các lỗi chưa xử lý.
- **Build/deploy log**: xem trong **Dashboard → service → Events/Deploys → chọn deploy → Logs**. Render giữ log theo chính sách của gói hiện tại; cần tải hoặc chuyển sang hệ thống log riêng nếu cần lưu lâu.
- **Health check**: Render gọi `GET /api/health`. URL hiện tại là `https://little-by-little-demo.onrender.com/api/health`; mã `200` và `{"ok":true}` nghĩa là service đang phục vụ.
- **Database log**: xem tại resource PostgreSQL trong Render Dashboard. Ứng dụng không ghi password, token hay `DATABASE_URL` vào log.

Render đang bật auto-deploy từ branch `main`: mỗi lần push thành công lên `main`, Render build Docker image và deploy commit mới. GitHub Actions chạy kiểm tra ở cùng thời điểm. Vì auto-deploy native của Render không chờ GitHub Actions, nếu cần mô hình “CI pass rồi mới deploy”, hãy tắt **Auto-Deploy** trong Render và bật workflow deploy có bảo vệ bằng secrets như phần dưới.

## Email khi có sự cố

Hiện tại chưa cấu hình SMTP/email provider trong code. Có thể nhận thông báo deploy thất bại từ Render bằng **Dashboard → Account/Workspace Notifications** và bật email cho deploy failure. GitHub cũng gửi email khi workflow bạn đang theo dõi thất bại.

Để cảnh báo **runtime error** qua email, nên dùng một dịch vụ monitoring (Sentry, Better Stack hoặc Logtail) nhận stdout của Render, đặt rule khi có `error` hoặc health check thất bại, rồi gửi email tới địa chỉ của bạn. Không gửi email trực tiếp ở mỗi request lỗi vì sẽ tạo vòng lặp và làm lộ dữ liệu nhạy cảm. Khi cấu hình, chỉ lưu các secret trong Render/GitHub, không commit vào repo:

```text
ALERT_EMAIL_TO=you@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
```

Các biến trên chỉ là mẫu; cần tài khoản SMTP/monitoring thật trước khi bật. Nên thêm Sentry DSN qua Render Environment Group khi sản phẩm có người dùng trả phí.

## CI hiện tại

File `.github/workflows/ci.yml` chạy trên pull request và mọi push vào `main`:

1. `npm ci` cài đúng lockfile.
2. `npm audit --omit=dev --audit-level=high` chặn dependency production có lỗ hổng mức high/critical.
3. `npm test` chạy unit tests.
4. `npm run test:api` chạy API/database tests.
5. `npm run build` kiểm tra build production.

Workflow dùng `permissions: contents: read`, timeout 15 phút và tự hủy run cũ khi có push mới. Dependabot kiểm tra cập nhật npm hằng tuần tại `.github/dependabot.yml`.

## CI pass rồi mới deploy (tuỳ chọn khuyến nghị cho production)

Mặc định demo đang dùng Render auto-deploy để deploy ngay sau push. Khi muốn gate deploy bằng CI:

1. Trong Render, đặt **Auto-Deploy = No**.
2. Tạo GitHub repository secrets `RENDER_API_KEY` và `RENDER_SERVICE_ID` (`srv-dafp29ou01pc73bc1aag`). Không đặt key trong YAML hoặc URL git.
3. Thêm deploy job sau job `validate` trong workflow, chỉ chạy khi `github.ref == 'refs/heads/main'`:

```yaml
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render deploy
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
          RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
        run: |
          set -euo pipefail
          test -n "$RENDER_API_KEY"
          curl --fail-with-body -sS -X POST \
            "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Accept: application/json"
```

Không tắt auto-deploy trước khi đã tạo hai secrets và kiểm tra một workflow run thành công, nếu không push mới sẽ không deploy.

## Checklist khi có sự cố

1. Mở `/api/health` và kiểm tra Render service có đang Live không.
2. Xem deploy log nếu lỗi xuất hiện ngay sau push; xem runtime log nếu lỗi xuất hiện khi người dùng thao tác.
3. Kiểm tra database còn available và chưa hết hạn Free plan.
4. Không copy cookie, session token, `DATABASE_URL` hoặc email người dùng vào issue/log công khai.
5. Nếu nghi ngờ secret bị lộ, revoke ngay Render API key/GitHub PAT, đổi credential database, rồi tạo secret mới.

