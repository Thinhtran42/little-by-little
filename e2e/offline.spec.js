import { prepareRecall } from './helpers/study.js';
import { test, expect } from "@playwright/test";
test('work course and reorganized categories are available offline',async({page,context})=>{
 await page.goto('/#learn');await expect(page.locator('.study-hub-card')).toHaveCount(3);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'4 tuần công việc',exact:true}).click();await page.locator('.wc-weeks button').nth(3).click();await page.locator('.wc-day').last().click();await expect(page.locator('.wc-reading article')).toContainText('core booking feature');await context.setOffline(false);
});
test('phrasal photographs and guest recall work offline after caching',async({page,context})=>{
 await page.goto('/#phrasal');await expect(page.locator('.pv-card')).toHaveCount(6);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();
 await page.locator('.pv-card').filter({hasText:'Dọn bếp cùng nhau'}).click();
 await expect.poll(()=>page.locator('.pv-context-photo img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 await page.getByRole('button',{name:'3 Tự thử sức',exact:true}).click();
 await page.getByLabel('Cụm từ của bạn',{exact:true}).fill('clean up');
 await page.getByRole('button',{name:'Kiểm tra câu trả lời',exact:true}).click();
 await expect(page.locator('.pv-feedback')).toContainText('Đúng rồi!');
 await expect(page.locator('.pv-feedback')).toContainText('chưa lưu tài khoản');
 await context.setOffline(false);
});
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
  await expect(page.getByRole("heading", { name: /Một chút hôm nay/ })).toBeVisible();
  await expect(
    page.getByText("Bạn đang ngoại tuyến.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Thư viện", exact: true }).click();
  await page.getByRole("button", { name: "Luyện tập", exact: true }).click();
  await expect(page.locator(".scenario-card")).toHaveCount(16);
  await page.getByRole("button", { name: "Tổng quan", exact: true }).click();
  await page
    .getByRole("button", { name: "Bắt đầu buổi học", exact: true })
    .click();
  await prepareRecall(page, "How's your day going?");
  await page.getByLabel("Câu trả lời tiếng Anh").fill("How's your day going?");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Chính xác");
  await context.setOffline(false);
});

test('reading lessons and real photographs are available in production offline cache', async ({page,context})=>{
  await page.goto('/#reading');
  await expect(page.locator('.reading-tile').first()).toBeVisible();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button',{name:/Đổi chiếc áo không vừa/}).click();
  await expect.poll(()=>page.locator('.reading-cover img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await page.getByRole('button',{name:'Thử nhớ',exact:true}).click();
  await page.getByLabel('Câu trả lời bài đọc').fill('exchange for');
  await page.getByRole('button',{name:'Kiểm tra câu trả lời'}).click();
  await expect(page.locator('.reading-recall [role=status]')).toContainText('Đúng rồi');
  await page.getByRole('button',{name:'Các bài đọc',exact:true}).click();
  await page.getByRole('button',{name:/Chuẩn bị cho buổi khám/}).click();
  await expect.poll(()=>page.locator('.reading-cover img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect(page.locator('.reading-text')).toContainText('appointment');
  await context.setOffline(false);
});

test('B2 course content and guest flashcards work offline after caching',async({page,context})=>{
 await page.goto('/#courses');await expect(page.locator('.course-unit-card')).toHaveCount(12);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();
 await page.getByRole('button',{name:/B2.*Diễn đạt/}).click();
 await page.getByRole('button',{name:/Một thời hạn, hai phương án/}).click();
 await page.getByRole('button',{name:'Flashcard',exact:true}).click();
 await page.getByRole('button',{name:'Lật flashcard xem nghĩa'}).click();
 await expect(page.locator('.course-flash-face')).toContainText('sự đánh đổi');
 await context.setOffline(false);
});
