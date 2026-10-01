import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("six primary categories lead to every learning surface on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await expect(page.locator("#studio-navigation > button")).toHaveCount(6);
  await page.getByRole("button", { name: "Khóa học", exact: true }).click();
  await expect(page.locator(".study-hub-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "4 tuần công việc", exact: true })
    .click();
  await expect(page.locator(".wc-day")).toHaveCount(5);
  await page.getByRole("button", { name: "← Khóa học", exact: true }).click();
  await expect(page).toHaveURL(/#learn$/);
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.getByRole("button", { name: "Thư viện", exact: true }).click();
  await expect(page.locator(".study-hub-card")).toHaveCount(5);
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Phrasal verbs", exact: true })
    .click();
  await expect(page.locator(".pv-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Câu đã lưu", exact: true }).click();
  await expect(page).toHaveURL(/#saved$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
