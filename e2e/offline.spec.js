import { test, expect } from "@playwright/test";
test("production cache supports offline reload, navigation and learning", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Chào bạn/ })).toBeVisible();
  await expect(
    page.getByText("Bạn đang ngoại tuyến.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Luyện tập", exact: true }).click();
  await expect(page.locator(".scenario-card")).toHaveCount(16);
  await page.getByRole("button", { name: "Tổng quan", exact: true }).click();
  await page
    .getByRole("button", { name: "Bắt đầu buổi học", exact: true })
    .click();
  await page.getByRole("button", { name: "Sẵn sàng thử nhớ" }).click();
  await page.getByLabel("Câu trả lời tiếng Anh").fill("How's your day going?");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Chính xác");
  await context.setOffline(false);
});
