import { prepareRecall } from "./helpers/study.js";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Studio library uses real catalog, persists bookmarks and grades recall", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#topics");
  await page.getByRole("button", { name: /Cuộc sống hằng ngày/ }).click();
  await expect(page.locator(".studio-phrase")).toHaveCount(12);
  await page
    .getByLabel("Tìm câu tiếng Anh hoặc nghĩa tiếng Việt")
    .fill("How's your day going?");
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Lưu How's your day going?", exact: true })
    .click();
  await page.getByRole("button", { name: "Câu đã lưu", exact: true }).click();
  await expect(page.locator(".studio-phrase")).toContainText(
    "How's your day going?",
  );
  await page.reload();
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Luyện How's your day going?", exact: true })
    .click();
  await prepareRecall(page, "How's your day going?");
  await page.getByLabel("Câu trả lời tiếng Anh").fill("How's your day going?");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Chính xác");
  await page.getByRole("button", { name: "Xem kết quả" }).click();
  await expect(page.getByRole("dialog")).toContainText("1/1");
  await page.getByRole("button", { name: "Hoàn thành", exact: true }).click();
  expect(errors).toEqual([]);
});

for (const width of [390, 1440])
  test(`Studio pages render without overflow at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "home",
      "topics",
      "phrasal",
      "review",
      "saved",
      "path",
      "practice",
      "insights",
      "account",
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator(".studio-heading h1")).toBeVisible();
      await expect(page.locator(".studio-app")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route,
      ).toBeTruthy();
      await page.screenshot({
        path: `artifacts/studio-${route}-${width}.png`,
        fullPage: true,
      });
    }
    if (width === 390) {
      await page.getByRole("button", { name: "Mở menu" }).click();
      await page.getByRole("button", { name: "Lộ trình", exact: true }).click();
      await expect(page.locator(".studio-path-list")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Mở menu" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    expect(errors).toEqual([]);
  });

test("Studio onboarding, reduced motion and accessible home", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Bật chuyển động" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Bắt đầu thiết lập" }).click();
  await page.getByLabel("Mình gọi bạn là gì?").fill("Linh");
  await page.getByRole("button", { name: "Tạo nhịp học của tôi" }).click();
  await expect(page.getByRole("heading", { name: "Chào Linh." })).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .include(".studio-app")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
