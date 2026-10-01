import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from 'node:crypto';
import {readFile} from 'node:fs/promises';

test('course results survive reload and a second device; failed submissions are not reported saved',async({page,browser,baseURL})=>{
 const email=`course-${randomUUID()}@example.test`,password='Course-test-password-2026!';
 const registration=await page.request.post('/api/auth/register',{data:{email,password,name:'Course test'}});expect(registration.status()).toBe(201);
 const second=await browser.newContext({baseURL});
 try{
  await page.goto('/#courses');await expect(page.locator('.sync-banner')).toContainText(email);
  await page.getByRole('button',{name:/Một lời mời ở quán cà phê/}).click();await page.getByRole('button',{name:'Kiểm tra & ôn',exact:true}).click();
  const options=page.locator('.course-quiz input[type=radio]');await options.first().check();
  await page.route('**/api/me/courses/*/attempts',r=>r.abort());await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();await expect(page.locator('.course-quiz [role=alert]')).toContainText('Chưa lưu');await expect(page.locator('.course-quiz [role=status]')).toHaveCount(0);
  await page.unroute('**/api/me/courses/*/attempts');await page.getByRole('button',{name:'Kiểm tra đáp án',exact:true}).click();await expect(page.locator('.course-quiz [role=status]')).toContainText('Đã lưu kết quả');
  const stored=await (await page.request.get('/api/me/courses')).json();expect(stored.attempts).toHaveLength(1);
  await page.reload();expect((await (await page.request.get('/api/me/courses')).json()).attempts).toEqual(stored.attempts);
  const login=await second.request.post('/api/auth/login',{data:{email,password}});expect(login.status()).toBe(200);
  const other=await second.newPage();await other.goto('/#courses');await expect(other.locator('.sync-banner')).toContainText(email);
  expect((await (await second.request.get('/api/me/courses')).json()).attempts).toEqual(stored.attempts);
  await page.goto('/#home');await expect(page.locator('.learning-overview')).toContainText('ngày liên tiếp toàn tài khoản');
  await page.goto('/#insights');await expect(page.locator('.learning-overview')).toContainText('câu B1/B2 đúng không gợi ý');
  await page.goto('/#account');const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất bản sao lưu',exact:true}).click();const file=await downloading;const exported=JSON.parse(await readFile(await file.path(),'utf8'));expect(exported.lessons.attempts).toHaveLength(1);
  await page.getByRole('button',{name:'Xóa tiến độ tài khoản',exact:true}).click();await page.getByLabel('Gõ XÓA để xác nhận').fill('XÓA');await page.getByRole('button',{name:'Xóa vĩnh viễn',exact:true}).click();
  await expect.poll(async()=> (await (await page.request.get('/api/me/courses')).json()).attempts.length).toBe(0);
 }finally{const me=await (await page.request.get('/api/auth/me')).json();if(me.user?.email===email)await page.request.delete('/api/auth/account',{headers:{'x-csrf-token':me.csrf},data:{password}});await second.close();}
});

test('phrasal groups open the matching contextual lesson',async({page})=>{
 await page.goto('/#phrasal');await page.getByRole('button',{name:'Công việc',exact:true}).click();
 await expect(page.locator('.pv-card')).toHaveCount(4);
 await page.locator('.pv-card').filter({hasText:'Cuộc họp có một trục trặc'}).click();
 await expect(page.getByRole('heading',{name:'Cuộc họp có một trục trặc',exact:true})).toBeVisible();
});
test("B1 and B2 courses integrate grammar, cards, readings and a guest checkpoint", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#courses");
  await expect(page.locator(".course-unit-card")).toHaveCount(12);
  await page.getByRole("button", { name: /B2.*Diễn đạt/ }).click();
  await expect(page.locator(".course-unit-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: /Một thời hạn, hai phương án/ })
    .click();
  await expect(page.locator(".course-grammar")).toContainText("Provided that");
  await page.getByRole("button", { name: "Flashcard", exact: true }).click();
  await page.getByRole("button", { name: "Lật flashcard xem nghĩa" }).click();
  await expect(page.locator(".course-flash-face")).toContainText("sự đánh đổi");
  await page.getByRole("button", { name: "Thẻ tiếp", exact: true }).click();
  await expect(page.locator(".course-flash-face")).toContainText("take on");
  await expect(page.locator(".course-flash-face")).not.toContainText(
    "nhận thêm trách nhiệm",
  );
  await page
    .getByRole("button", { name: "Đọc & hội thoại", exact: true })
    .click();
  await expect(page.locator(".reading-text")).toContainText("Maya");
  await page
    .getByRole("button", { name: "Về bài trong lộ trình", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Kiểm tra & ôn", exact: true })
    .click();
  await page.getByLabel("Giải thích đánh đổi và chốt phạm vi").check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.locator(".course-quiz [role=status]")).toContainText(
    "Đúng rồi",
  );
  await page
    .getByRole("button", { name: "Câu tiếp theo", exact: true })
    .click();
  await page.getByLabel("Câu trả lời lộ trình").fill("wrong");
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.locator(".course-quiz [role=status]")).toContainText(
    "Chưa đúng",
  );
  await page
    .getByRole("button", { name: "Câu tiếp theo", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem gợi ý", exact: true }).click();
  await page.getByLabel("Câu trả lời lộ trình").fill("passes");
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem kết quả", exact: true }).click();
  await expect(page.locator(".course-grammar")).toContainText("1/3");
  expect(errors).toEqual([]);
});
for (const width of [390, 1440])
  test(`course layout and accessibility ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#courses");
    await expect(page.locator(".course-unit-card")).toHaveCount(12);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/courses-${width}.png`,
      fullPage: true,
    });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.locator('.course-unit-card').first().click();
    await page.getByRole('button',{name:'Kiểm tra & ôn',exact:true}).click();
    const quizAudit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();expect(quizAudit.violations).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
