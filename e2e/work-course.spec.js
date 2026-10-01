import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from "node:crypto";
import { workLessons, workWeeks } from "../shared/work-course.js";
test("work course opens all twenty lessons and preserves a draft when switching lesson tabs", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/#work-course");
  for (let week = 0; week < 4; week++) {
    await page.locator(".wc-weeks button").nth(week).click();
    await expect(page.locator(".wc-day")).toHaveCount(5);
    for (const l of workLessons.filter((l) => l.week === week)) {
      await page.locator(".wc-day").filter({ hasText: l.title }).click();
      await expect(page.locator(".wc-reading article")).toContainText(
        l.reading,
      );
      for (let i = 0; i < 3; i++)
        await page
          .getByRole("button", { name: "Mở lời tiếp theo", exact: true })
          .click();
      await page
        .getByRole("button", { name: "Tự diễn đạt", exact: true })
        .click();
      await expect(page.locator(".wc-apply")).toContainText(l.task);
      await page
        .getByLabel("Bản nháp của bạn", { exact: true })
        .fill("Please confirm the deadline.");
      await page
        .getByRole("button", { name: "Kiểm tra & lưu", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Tự diễn đạt", exact: true })
        .click();
      await expect(
        page.getByLabel("Bản nháp của bạn", { exact: true }),
      ).toHaveValue("Please confirm the deadline.");
      await page
        .getByRole("button", { name: "Kế hoạch 4 tuần", exact: true })
        .click();
    }
  }
});
test("work course checkpoint persists and an interrupted save does not count as success", async ({
  page,
}) => {
  const email = `work-${randomUUID()}@example.test`,
    password = "Work-test-2026!";
  const reg = await page.request.post("/api/auth/register", {
    data: { email, password, name: "Work test" },
  });
  expect(reg.status()).toBe(201);
  const { csrf } = await reg.json();
  try {
    await page.goto("/#work-course");
    await page.locator(".wc-day").first().click();
    await page
      .getByRole("button", { name: "Kiểm tra & lưu", exact: true })
      .click();
    await page.getByLabel("Câu trả lời lộ trình").fill("of");
    await page.route("**/api/me/work-course/*/attempts", (r) => r.abort());
    await page
      .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
      .click();
    await expect(page.locator(".course-quiz [role=alert]")).toContainText(
      "Chưa lưu",
    );
    await page.unroute("**/api/me/work-course/*/attempts");
    await page
      .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
      .click();
    await expect(page.locator(".course-quiz [role=status]")).toContainText(
      "Đã lưu",
    );
    await page.reload();
    await expect(page.locator(".wc-day").first()).toContainText("1/3 câu đúng");
  } finally {
    await page.request.delete("/api/auth/account", {
      headers: { "x-csrf-token": csrf },
      data: { password },
    });
  }
});
for (const width of [390, 1440])
  test(`work course accessible layout ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work-course");
    await expect(page.locator(".wc-day")).toHaveCount(5);
    for (const step of ["overview", "learn", "apply", "quiz"]) {
      if (step === "learn") await page.locator(".wc-day").first().click();
      if (step === "apply")
        await page
          .getByRole("button", { name: "Tự diễn đạt", exact: true })
          .click();
      if (step === "quiz")
        await page
          .getByRole("button", { name: "Kiểm tra & lưu", exact: true })
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .include(".work-course")
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      if (step === "overview")
        await page.screenshot({
          path: `artifacts/work-course-${width}.png`,
          fullPage: true,
        });
    }
  });
