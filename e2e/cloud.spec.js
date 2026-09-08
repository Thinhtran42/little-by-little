import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
async function browserApi(page, path, method = 'GET', body, csrf) {
  return page.evaluate(async ({path,method,body,csrf}) => {
    const response = await fetch(path, {method, headers: { ...(body ? {'Content-Type':'application/json'} : {}), ...(csrf ? {'X-CSRF-Token':csrf} : {}) }, ...(body ? {body:JSON.stringify(body)} : {}) });
    if(!response.ok) throw new Error(`API ${path}: ${response.status}`);
    return response.json();
  }, {path,method,body,csrf});
}
test("account progress survives a second device and failed saves never report success", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `browser-${randomUUID()}@example.test`,
    password = "Browser-test-password-2026!";
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const second = await browser.newContext();
  try {
    await page.goto("/#account");
    await page
      .getByRole("button", { name: "Tạo tài khoản", exact: true })
      .click();
    await page.getByLabel("Tên hiển thị").fill("Người học thử");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Mật khẩu · ít nhất 12 ký tự").fill(password);
    await page.getByRole("button", { name: "Tạo tài khoản của tôi" }).click();
    await expect(page.getByText("Lưu mã khôi phục ngay bây giờ")).toBeVisible();
    await expect(page.locator(".sync-banner")).toContainText(email);
    await page.getByRole("button", { name: "Tôi đã lưu mã" }).click();
    await page.goto("/#topics");
    await page.getByRole("button", { name: /Cuộc sống hằng ngày/ }).click();
    await page
      .getByRole("button", { name: "Luyện How's your day going?", exact: true })
      .click();
    await page.getByRole("button", { name: "Sẵn sàng thử nhớ" }).click();
    await page
      .getByLabel("Câu trả lời tiếng Anh")
      .fill("How's your day going?");
    await page.route("**/api/me/attempts", (r) => r.abort());
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.getByRole("dialog")).not.toContainText("Chính xác");
    await expect(page.locator(".sync-banner")).toContainText("Chưa lưu");
    await page.unroute("**/api/me/attempts");
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("Chính xác");
    await page.getByRole("button", { name: "Xem kết quả" }).click();
    await page.getByRole("button", { name: "Hoàn thành", exact: true }).click();
    const saved = await browserApi(page, '/api/me/progress');
    expect(saved.state.attempts).toHaveLength(1);
    const id = saved.state.attempts[0].id;
    expect(saved.state.learned[id].due).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(saved.state.learned[id].verified).toBe(true);
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("little-progress")).attempts,
      ),
    ).toHaveLength(0);
    const other = await second.newPage();
    await other.goto(`${baseURL}/#account`);
    await other.getByLabel("Email", { exact: true }).fill(email);
    await other.getByLabel("Mật khẩu", { exact: true }).fill(password);
    await other
      .getByRole("button", { name: "Đăng nhập", exact: true })
      .last()
      .click();
    await expect(other.locator(".sync-banner")).toContainText(email);
    await other.reload();
    await expect(other.locator(".sync-banner")).toContainText(email);
    const remote = await browserApi(other, '/api/me/progress');
    expect(remote.state.learned[id]).toEqual(saved.state.learned[id]);
    expect(remote.state.attempts).toHaveLength(1);
    await other.route("**/api/me/progress", (r) => r.abort());
    await other.reload();
    await expect(other.locator(".sync-banner")).toContainText("Chưa lưu");
    await other.unroute("**/api/me/progress");
    await other.getByRole("button", { name: "Lấy tiến độ mới nhất" }).click();
    await expect(other.locator(".sync-banner")).toContainText(
      "đã lưu trên máy chủ",
    );
    // A revoked/expired session must still allow returning to the login screen.
    const session = await browserApi(other, '/api/auth/me');
    await browserApi(other, '/api/auth/logout', 'POST', {}, session.csrf);
    await other.getByRole("button", { name: "Đăng xuất", exact: true }).click();
    await expect(other.locator(".sync-banner")).toContainText("Đang dùng thử");
    expect(
      (await browserApi(other, '/api/auth/me')).user,
    ).toBeNull();
    expect(errors).toEqual([]);
  } finally {
    const me = await browserApi(page, '/api/auth/me');
    if (me.user?.email === email)
      await browserApi(page, '/api/auth/account', 'DELETE', {password}, me.csrf);
    await second.close();
  }
});
