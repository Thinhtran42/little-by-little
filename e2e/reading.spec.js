import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readingLessons} from '../shared/reading-lessons.js';

test('readings: photos, definitions, translations, conversations and self-practice',async({page})=>{
 test.setTimeout(90000); // Exercises every reading; collection grew from 6 to 18.
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#reading');await expect(page.locator('.reading-tile')).toHaveCount(readingLessons.length);
 const before=await page.evaluate(()=>localStorage.getItem('little-progress'));
 for(const l of readingLessons){
  await page.getByRole('button',{name:new RegExp(l.title)}).click();
  await expect(page.locator('.reading-cover img')).toBeVisible();
  await expect.poll(()=>page.locator('.reading-cover img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await page.locator('.reading-text button').first().click();await expect(page.locator('.reading-definition')).toBeVisible();
  await page.getByText('Xem nghĩa tiếng Việt',{exact:true}).click();await expect(page.getByText(l.readings[0].vi,{exact:true})).toBeVisible();
  await page.locator('.reading-chapters button').nth(1).click();await expect(page.locator('.reading-text')).toContainText(l.readings[1].text.split('**')[0].trim());
  await page.getByRole('button',{name:'Từ & cách dùng',exact:true}).click();await expect(page.locator('.reading-word-list section')).toHaveCount(l.terms.length);
  await page.getByRole('button',{name:'Hội thoại',exact:true}).click();await page.locator('.reading-dialogue summary').nth(1).click();await expect(page.getByText(l.dialogue[1][1],{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Thử nhớ',exact:true}).click();await page.getByLabel('Câu trả lời bài đọc').fill('wrong');await page.getByRole('button',{name:'Kiểm tra câu trả lời'}).click();await expect(page.locator('.reading-recall [role=status]')).toContainText('Chưa khớp');
  await page.getByLabel('Câu trả lời bài đọc').fill(l.recall.answer);await page.getByRole('button',{name:'Kiểm tra câu trả lời'}).click();await expect(page.locator('.reading-recall [role=status]')).toContainText('Đúng rồi');
  await page.getByRole('button',{name:'Các bài đọc',exact:true}).click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('little-progress'))).toBe(before);expect(errors).toEqual([]);
});
for(const width of [390,1440])test(`reading layout and accessibility ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/#reading');
 await page.getByLabel('Chủ đề bài đọc').selectOption('Mua sắm');await expect(page.locator('.reading-tile')).toHaveCount(1);
 await page.locator('.reading-tile').click();await expect(page.locator('.reading-text')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/reading-shop-${width}.png`,fullPage:true});
 await expect(page.locator('h1 .reading-lesson')).toHaveCount(0);
 const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();expect(a.violations).toEqual([]);
});
