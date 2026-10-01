import {test,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {phrasalLessons} from '../shared/phrasal-lessons.js';
test('completed phrasal lesson waits for its due date and offers optional extra practice',async({page})=>{
 const email=`pv-review-${randomUUID()}@example.test`,password='Phrasal-review-2026!';
 const r=await page.request.post('/api/auth/register',{data:{email,password,name:'Review'}});expect(r.status()).toBe(201);
 const {csrf}=await r.json(),lesson=phrasalLessons[0];
 try{
  for(const q of lesson.questions){const saved=await page.request.post(`/api/me/phrasal/${lesson.id}/attempts`,{headers:{'x-csrf-token':csrf},data:{key:randomUUID(),version:lesson.version,questionId:q.id,answer:q.answer,hinted:false}});expect(saved.status()).toBe(200);}
  await page.goto('/#phrasal');await page.getByLabel('Chỉ bài đến hạn',{exact:true}).check();await expect(page.locator('.pv-empty')).toBeVisible();
  await page.getByRole('button',{name:'Xem tất cả bài học',exact:true}).click();await page.locator('.pv-card').filter({hasText:lesson.title}).click();await page.getByRole('button',{name:'3 Tự thử sức',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Hôm nay bài này chưa cần ôn.',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Luyện thêm cả bài',exact:true}).click();await expect(page.locator('.pv-quiz .pv-eyebrow')).toContainText('1 / 5');
 }finally{await page.request.delete('/api/auth/account',{headers:{'x-csrf-token':csrf},data:{password}});}
});
