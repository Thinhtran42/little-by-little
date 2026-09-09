import { prepareRecall } from './helpers/study.js';
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { phrases } from "../shared/catalog.js";
test("personalized onboarding, active recall, and persistence", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Bắt đầu thiết lập" }).click();
  await page.getByLabel("Mình gọi bạn là gì?").fill("Minh");
  await page
    .getByLabel("Bạn muốn dùng tiếng Anh ở đâu?")
    .selectOption("travel");
  await page.getByRole("button", { name: "Tạo nhịp học của tôi" }).click();
  await expect(page.getByRole("heading", { name: /Chào Minh/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Bắt đầu buổi học", exact: true })
    .click();
  for (const p of phrases
    .filter((p) => p.topic === "travel" && p.type === "sentence")
    .slice(0, 5)) {
    await prepareRecall(page, p.en);
    await expect(
      page.getByRole("dialog").getByText(p.en, { exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("textbox", { name: "Câu trả lời tiếng Anh" })
      .fill(p.en);
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.getByRole("dialog").getByRole("status")).toContainText("Chính xác");
    await page
      .getByRole("button", { name: /Câu tiếp theo|Xem kết quả/ })
      .click();
  }
  await expect(page.getByRole("dialog")).toContainText("5/5");
  await page.getByRole("button", { name: "Hoàn thành", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Hoàn thành kế hoạch hôm nay" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tiến bộ", exact: true }).click();
  await expect(page.locator(".insight-stats")).toContainText("100%");
  await expect(page.locator(".insight-stats article").nth(1)).toContainText(
    "0",
  );
  expect(errors).toEqual([]);
});
test("incorrect recall gives feedback, queues one retry, and records mistake", async ({
  page,
}) => {
  await page.goto("/#topics");
  await page.getByRole("button", { name: /Cuộc sống hằng ngày/ }).click();
  await expect(page.locator(".studio-phrase")).toHaveCount(12);
  await page
    .getByRole("button", { name: "Luyện How's your day going?", exact: true })
    .click();
  await prepareRecall(page, "How's your day going?");
  await page.getByLabel("Câu trả lời tiếng Anh").fill("incorrect sentence");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Chưa khớp");
  await page.getByRole("button", { name: "Câu tiếp theo" }).click();
  await expect(page.getByRole("dialog")).toContainText("THỬ LẠI");
  await page.getByLabel("Câu trả lời tiếng Anh").fill("How's your day going?");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Xem kết quả" }).click();
  await expect(page.getByRole("dialog")).toContainText("0/1");
  await page.getByRole("button", { name: "Hoàn thành", exact: true }).click();
  await page.getByRole("button", { name: "Tiến bộ", exact: true }).click();
  await expect(page.locator(".mistakes")).toContainText(
    "How's your day going?",
  );
});
test("scenario choices have feedback and persist score", async ({ page }) => {
  await page.goto("/#practice");
  await expect(page.locator(".scenario-card")).toHaveCount(16);
  await page.getByRole("button", { name: /Một ly cà phê đúng ý/ }).click();
  for (const answer of [
    "I'd like an iced latte, please.",
    "No sugar, please.",
    "To go, please.",
  ]) {
    await page.getByRole("button", { name: answer, exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("Lời đáp phù hợp!");
    await page
      .getByRole("button", { name: /Tiếp tục hội thoại|Xem kết quả/ })
      .click();
  }
  await expect(page.getByRole("dialog")).toContainText("3/3");
  await page.getByRole("button", { name: "Quay lại luyện tập" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Một ly cà phê đúng ý/ }),
  ).toContainText("3/3");
});
test("bookmarks, search, and lesson path", async ({ page }) => {
  await page.goto("/#topics");
  await page.getByRole("button", { name: /Cuộc sống hằng ngày/ }).click();
  await expect(page.locator(".studio-phrase")).toHaveCount(12);
  await page.getByRole("textbox").fill("thức dậy");
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
  await page.getByRole("button", { name: "Lưu wake up", exact: true }).click();
  await page.getByRole("button", { name: /Câu đã lưu/ }).click();
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
  await page.getByRole("button", { name: "Lộ trình", exact: true }).click();
  await expect(page.locator(".studio-path-list > button")).toHaveCount(8);
  await page.locator(".studio-path-list > button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("export/import validates data and never silently replaces progress", async ({
  page,
}) => {
  await page.goto("/#account");
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Xuất bản sao lưu", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/little-by-little/);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{bad"),
    });
  await expect(page.getByRole("status")).toContainText("không hợp lệ");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const progress = {
    version: 2,
    learned: {
      "everyday-0": { date: "2026-09-07", due: "2026-09-08", level: 0 },
    },
    saved: ["everyday-0"],
    history: {},
    goal: 10,
  };
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({ app: "little-by-little", progress }),
      ),
    });
  await expect(page.getByRole("dialog")).toContainText("1 câu đã xem");
  await page.getByRole("dialog").getByRole("button", { name: "Khôi phục", exact: true }).click();
  await page.getByRole("button", { name: /Câu đã lưu/ }).click();
  await expect(page.locator(".studio-phrase")).toHaveCount(1);
});
test("mobile and desktop surfaces stay within viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "home",
    "topics",
    "path",
    "practice",
    "insights",
    "account",
  ]) {
    await page.goto("/#" + route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({ path: "artifacts/v2-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.screenshot({ path: "artifacts/v2-desktop.png", fullPage: true });
  await page.goto("/#practice");
  await page.screenshot({ path: "artifacts/v2-practice.png", fullPage: true });
});
test("core accessibility semantics and focus containment", async ({ page }) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole("button", { name: "Bắt đầu thiết lập" }).click();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Tạo nhịp học của tôi" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("mobile more menu exposes all learning surfaces", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.getByRole("button", { name: "Lộ trình", exact: true }).click();
  await expect(page.locator(".studio-path-list > button")).toHaveCount(8);
  await expect(page.getByRole("button", {name:"Mở menu"})).toHaveAttribute("aria-expanded","false");
});
test("microphone recording is local and stops when the dialogue closes", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["microphone"]);
  await page.goto("/#practice");
  await page.getByRole("button", { name: /Một ly cà phê đúng ý/ }).click();
  await page
    .getByRole("button", {
      name: "I'd like an iced latte, please.",
      exact: true,
    })
    .click();
  await page.getByText("Đọc lại lời đáp & tự nghe", { exact: true }).click();
  await page
    .getByRole("button", { name: "Ghi âm câu của bạn", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Dừng ghi âm", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dừng ghi âm", exact: true }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^blob:/);
  await page.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(page.locator("audio")).toHaveCount(0);
});
