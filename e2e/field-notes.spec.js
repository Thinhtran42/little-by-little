import { test, expect } from "@playwright/test";

test("meaning animations complete, replay, and allow recall without motion", async ({
  page,
}) => {
  await page.goto("/?preview=field-notes");
  await page.getByRole("button", { name: "Bắt đầu ở quán cà phê" }).click();
  const scene = page.getByRole("region", { name: "Học cụm từ qua hành động" });
  await scene
    .getByRole("button", { name: "Xem hành động", exact: true })
    .click();
  await expect(scene.locator(".action-art")).toHaveClass(/action-playing/);
  await expect(scene.locator(".action-art")).toHaveClass(/action-after/, {
    timeout: 5000,
  });
  await scene.screenshot({path:'artifacts/action-cafe-after.png'});
  await scene.getByRole("button", { name: "Phát lại", exact: true }).click();
  await expect(scene.locator(".action-art")).toHaveClass(/action-playing/);
  await page
    .getByRole("button", { name: "Giảm chuyển động", exact: true })
    .click();
  await expect(scene.locator(".action-art")).toHaveClass(/action-after/);
  await scene.getByRole("button", { name: "Giấu cụm, thử nhớ" }).click();
  await scene.getByLabel("Cụm từ cho hành động").fill("pick up it");
  await scene.getByRole("button", { name: "Kiểm tra cụm" }).click();
  await expect(scene.getByRole("status")).toContainText("Cụm cần điền");
  await page.getByRole("button", { name: "Tất cả tình huống" }).click();
  await page
    .locator(".fn-lesson-card")
    .filter({ hasText: "Lỡ chuyến xe" })
    .click();
  await scene
    .getByRole("button", { name: "Xem hành động", exact: true })
    .click();
  await expect(scene.locator(".action-art")).toHaveClass(/action-after/);
  await expect(scene.locator(".action-static-note")).toBeVisible();
  await page.getByRole('button',{name:'Bật chuyển động',exact:true}).click();
  await scene.getByRole('button',{name:'Phát lại',exact:true}).click();
  await expect(scene.locator('.action-art')).toHaveClass(/action-playing/);
  await expect(scene.locator('.action-art')).toHaveClass(/action-after/,{timeout:5000});
  await scene.screenshot({path:'artifacts/action-bus-after.png'});
  await scene.getByRole("button", { name: "Giấu cụm, thử nhớ" }).click();
  await scene.getByLabel("Cụm từ cho hành động").fill("get off");
  await scene.getByRole("button", { name: "Kiểm tra cụm" }).click();
  await expect(scene.getByRole("status")).toContainText("Đúng rồi");
});

test("scene cues and appearance controls work with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?preview=field-notes");
  await page.getByRole("button", { name: "pick it up", exact: true }).click();
  await expect(page.locator(".fn-stage-note")).toHaveText(
    "You can pick it up over here.",
  );
  await expect(
    page.getByRole("button", { name: "pick it up", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".fn-stage-note")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page
    .getByRole("button", { name: "Giảm chuyển động", exact: true })
    .click();
  await expect(page.locator(".fn-app")).toHaveClass(/fn-still/);
  await page
    .getByRole("group", { name: "Phong cách", exact: true })
    .getByRole("button", { name: "Sổ tay", exact: true })
    .click();
  await expect(page.locator(".fn-app")).toHaveClass(/fn-look-paper/);
  await page.getByRole("button", { name: "Studio", exact: true }).click();
  await expect(page.locator(".fn-app")).toHaveClass(/fn-look-studio/);
});

test("preview supports search, context, flashcards and persisted assisted/independent recall", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?preview=field-notes");
  await expect(page.locator(".fn-lesson-card")).toHaveCount(6);
  await page
    .getByRole("textbox", { name: "Tìm tình huống hoặc từ" })
    .fill("deadline");
  await expect(page.locator(".fn-lesson-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Tìm tình huống hoặc từ" }).fill("");
  await page.getByRole("button", { name: "Bắt đầu ở quán cà phê" }).click();
  await expect(page.locator(".fn-dialogue>div")).toHaveCount(6);
  await page.getByRole("button", { name: "Xem bản dịch", exact: true }).click();
  await expect(page.locator(".fn-translation")).toBeVisible();
  await page.getByRole("button", { name: "02 Lật thẻ khám phá" }).click();
  await page.getByRole("button", { name: "Lật thẻ xem cách nói" }).click();
  await expect(page.locator(".fn-flashcard h2")).toHaveText("counter");
  await page.getByRole("button", { name: "03 Tự nhớ lại" }).click();
  await expect(page.locator(".fn-gap")).not.toContainText("counter");
  await page.getByLabel("Cụm tiếng Anh").fill("COUNTER");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Bạn đã tự nhớ đúng");
  await page.getByRole("button", { name: "Tiếp", exact: true }).click();
  await page.getByRole("button", { name: "Cho mình một gợi ý" }).click();
  await page.getByLabel("Cụm tiếng Anh").fill("oat milk");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("có hỗ trợ");
  await page.reload();
  await expect(page.locator(".fn-progress-strip")).toContainText("2/36");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lbl-field-notes-preview-v1")),
  );
  expect(saved["cafe-1"].hinted).toBe(false);
  expect(saved["cafe-2"].hinted).toBe(true);
  expect(saved["cafe-1"].due).toBeGreaterThan(saved["cafe-2"].due);
  expect(errors).toEqual([]);
});

for (const width of [390, 1440])
  test(`preview layout at ${width}px and return to original UI`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/?preview=field-notes");
    await expect(page.locator(".fn-lesson-card")).toHaveCount(6);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: `artifacts/field-notes-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "Bắt đầu ở quán cà phê" }).click();
    await expect(page.locator(".fn-reading")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: `artifacts/field-notes-lesson-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("link", { name: "Về giao diện hiện tại" }).click();
    await expect(page.locator(".fn-app")).toHaveCount(0);
  });
