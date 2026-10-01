import test from 'node:test';import assert from 'node:assert/strict';
import {scheduleCourseReview,studyStreak} from '../shared/course-review.js';
const answer={correct:true,hinted:false,mode:'recall'};
test('course spacing grows only across due days and does not reward same-day repetition',()=>{
 const first=scheduleCourseReview(null,{...answer,day:'2026-09-28'});assert.deepEqual(first,{level:1,lastPassed:'2026-09-28',due:'2026-09-29'});
 const old={review_level:1,last_passed:first.lastPassed,due_day:first.due};
 assert.deepEqual(scheduleCourseReview(old,{...answer,day:'2026-09-28'}),first);
 const second=scheduleCourseReview(old,{...answer,day:'2026-09-29'});assert.equal(second.level,2);assert.equal(second.due,'2026-10-02');
 const early=scheduleCourseReview({review_level:2,last_passed:'2026-09-29',due_day:'2026-10-02'},{...answer,day:'2026-09-30'});assert.equal(early.level,2);assert.equal(early.due,'2026-10-02');
});
test('wrong and hinted answers return today; recognition cannot inflate productive spacing',()=>{
 const previous={review_level:4,last_passed:'2026-09-01',due_day:'2026-09-15'};
 for(const change of [{correct:false},{hinted:true}]){const r=scheduleCourseReview(previous,{...answer,day:'2026-09-28',...change});assert.equal(r.level,0);assert.equal(r.due,'2026-09-28');}
 assert.equal(scheduleCourseReview(previous,{...answer,day:'2026-09-28',mode:'choice'}).level,1);
 assert.equal(scheduleCourseReview({...previous,review_level:0},{...answer,day:'2026-09-28'}).level,1);
 const cap=scheduleCourseReview({...previous,review_level:5},{...answer,day:'2026-09-28'});assert.equal(cap.level,5);assert.equal(cap.due,'2026-10-28');
});
test('combined activity streak counts each calendar day once and allows returning today',()=>{
 assert.equal(studyStreak(['2026-09-28','2026-09-28','2026-09-27'],'2026-09-28'),2);
 assert.equal(studyStreak(['2026-09-27','2026-09-26'],'2026-09-28'),2);
 assert.equal(studyStreak(['2026-09-25'],'2026-09-28'),0);
});
