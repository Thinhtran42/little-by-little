import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from "node:crypto";
import { phrasalLessons } from "../shared/phrasal-lessons.js";

test("phrasal lessons have working contextual photos, definitions, dialogues, recall and sentence building", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/#phrasal");
  await expect(page.locator(".pv-card")).toHaveCount(6);
  for (const l of phrasalLessons) {
    await page
      .getByRole("searchbox", { name: "Tìm cụm từ hoặc tình huống" })
      .fill(l.title);
    await page.locator(".pv-card").filter({ hasText: l.title }).click();
    const photo = page.locator(".pv-context-photo img");
    await expect(photo).toHaveAttribute("src", `/photos/${l.scene}.webp`);
    await expect
      .poll(() => photo.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    await page.getByText("Xem nghĩa tiếng Việt", { exact: true }).click();
    await expect(page.locator(".pv-story")).toContainText(l.translation);
    await page.locator(".pv-highlight").first().click();
    await expect(page.locator(".pv-card-answer")).toContainText(l.terms[0].vi);
    await page
      .getByRole("button", { name: "1 Vào tình huống", exact: true })
      .click();
    for (let i = 0; i < 4; i++)
      await page
        .getByRole("button", { name: "Mở lượt tiếp theo", exact: true })
        .click();
    await expect(page.locator(".pv-dialogue li")).toHaveCount(6);
    await page
      .getByRole("button", { name: "Thư viện phrasal verb", exact: true })
      .click();
  }
  await page
    .getByRole("searchbox", { name: "Tìm cụm từ hoặc tình huống" })
    .fill("");
  await page
    .locator(".pv-card")
    .filter({ hasText: phrasalLessons[0].title })
    .click();
  await page.getByRole("button", { name: "3 Tự thử sức", exact: true }).click();
  const l = phrasalLessons[0];
  for (let i = 0; i < 4; i++) {
    await page
      .getByLabel("Cụm từ của bạn", { exact: true })
      .fill(i === 0 ? "wrong" : l.terms[i].en);
    await page
      .getByRole("button", { name: "Kiểm tra câu trả lời", exact: true })
      .click();
    await expect(page.locator(".pv-feedback")).toContainText(
      i === 0 ? "Thử nhớ cách nói này." : "Đúng rồi!",
    );
    await page
      .getByRole("button", { name: "Câu tiếp theo", exact: true })
      .click();
  }
  for (const word of l.order)
    await page
      .locator(".pv-token-bank")
      .getByRole("button", { name: word, exact: true })
      .click();
  await page
    .getByRole("button", { name: "Kiểm tra câu trả lời", exact: true })
    .click();
  await expect(page.locator(".pv-feedback")).toContainText("Đúng rồi!");
  await page.getByRole("button", { name: "Xem kết quả", exact: true }).click();
  await expect(page.locator(".pv-quiz")).toContainText(
    "chưa lưu vào tài khoản",
  );
  await expect(page.locator(".pv-result-score")).toContainText("4/5");
  await page
    .getByRole("button", { name: "Luyện lại 1 câu cần nhớ", exact: true })
    .click();
  await expect(page.locator(".pv-quiz .pv-eyebrow")).toContainText("1 / 1");
  await page.getByLabel("Cụm từ của bạn", { exact: true }).fill("clean up");
  await page
    .getByRole("button", { name: "Kiểm tra câu trả lời", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem kết quả", exact: true }).click();
  await expect(page.locator(".pv-result-score")).toContainText("4/5");
  await expect(
    page.getByRole("button", { name: "Luyện lại 1 câu cần nhớ", exact: true }),
  ).toHaveCount(0);
});

test("phrasal search finds accent-free meanings and recovers from no results", async ({
  page,
}) => {
  await page.goto("/#phrasal");
  const search = page.getByRole("searchbox", {
    name: "Tìm cụm từ hoặc tình huống",
  });
  await search.fill("cat vao cho");
  await expect(page.locator(".pv-card")).toHaveCount(1);
  await expect(page.locator(".pv-card")).toContainText("Dọn bếp cùng nhau");
  await search.fill("qwertyzz");
  await expect(page.locator(".pv-empty")).toContainText("Chưa có bài phù hợp");
  await page
    .getByRole("button", { name: "Xem tất cả bài học", exact: true })
    .click();
  await expect(page.locator(".pv-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Xem thêm 6 bài", exact: true })
    .click();
  await expect(page.locator(".pv-card")).toHaveCount(12);
  await page
    .getByRole("button", { name: "Xem thêm 6 bài", exact: true })
    .click();
  await expect(page.locator(".pv-card")).toHaveCount(18);
  await page.getByRole("button", { name: "Học tập", exact: true }).click();
  await expect(page.locator(".pv-card")).toHaveCount(1);
  await expect(page.locator(".pv-card")).toContainText(
    "Ôn bài mà không học vẹt",
  );
});

test("phrasal account progress resumes and network failures remain retryable without false success", async ({
  page,
}) => {
  const email = `pv-${randomUUID()}@example.test`,
    password = "Phrasal-test-2026!";
  const registration = await page.request.post("/api/auth/register", {
    data: { email, password, name: "Phrasal test" },
  });
  expect(registration.status()).toBe(201);
  try {
    await page.goto("/#phrasal");
    await page
      .locator(".pv-card")
      .filter({ hasText: "Dọn bếp cùng nhau" })
      .click();
    await page
      .getByRole("button", { name: "3 Tự thử sức", exact: true })
      .click();
    await page.getByLabel("Cụm từ của bạn", { exact: true }).fill("clean up");
    await page.route("**/api/me/phrasal/*/attempts", (r) => r.abort());
    await page
      .getByRole("button", { name: "Kiểm tra câu trả lời", exact: true })
      .click();
    await expect(page.locator(".pv-quiz [role=alert]")).toContainText(
      "Chưa lưu",
    );
    await expect(page.locator(".pv-feedback")).toHaveCount(0);
    await page.unroute("**/api/me/phrasal/*/attempts");
    await page
      .getByRole("button", { name: "Kiểm tra câu trả lời", exact: true })
      .click();
    await expect(page.locator(".pv-feedback")).toContainText("Đã lưu");
    await page.reload();
    await page
      .locator(".pv-card")
      .filter({ hasText: "Dọn bếp cùng nhau" })
      .click();
    await page
      .getByRole("button", { name: "3 Tự thử sức", exact: true })
      .click();
    await expect(page.locator(".pv-quiz h3")).toContainText("I cooked dinner");
    const stored = await (await page.request.get("/api/me/phrasal")).json();
    expect(stored.attempts).toHaveLength(1);
    expect(stored.attempts[0].correct).toBe(true);
  } finally {
    const me = await (await page.request.get("/api/auth/me")).json();
    if (me.user?.email === email)
      await page.request.delete("/api/auth/account", {
        headers: { "x-csrf-token": me.csrf },
        data: { password },
      });
  }
});

for (const width of [390, 1440])
  test(`phrasal visual and accessibility ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#phrasal");
    await expect(page.locator(".pv-card")).toHaveCount(6);
    for (const img of await page.locator(".pv-card img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
        .toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/phrasal-library-${width}.png`,
      fullPage: true,
    });
    for (const step of ["library", "context", "cards", "quiz"]) {
      if (step === "context")
        await page
          .locator(".pv-card")
          .filter({ hasText: "Chiếc áo có vừa không?" })
          .click();
      if (step === "cards")
        await page
          .getByRole("button", { name: "2 Hiểu & nhớ", exact: true })
          .click();
      if (step === "quiz")
        await page
          .getByRole("button", { name: "3 Tự thử sức", exact: true })
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const scan = await new AxeBuilder({ page })
        .include(".pv-lab")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(scan.violations).toEqual([]);
      if (step === "context")
        await page.screenshot({
          path: `artifacts/phrasal-lesson-${width}.png`,
          fullPage: true,
        });
    }
  });
