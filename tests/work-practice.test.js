import test from 'node:test';
import assert from 'node:assert/strict';
import {workLessons} from '../shared/work-course.js';
import {workComprehension, matchesDictation} from '../shared/work-practice.js';
test('every work lesson has an original explained comprehension check',()=>{
 assert.deepEqual(Object.keys(workComprehension).sort(),workLessons.map(l=>l.id).sort());
 for(const q of Object.values(workComprehension)) {
  assert.equal(new Set(q.options).size,3);
  assert.ok(q.options[q.answer]);
  assert.ok(q.explanation.length>50);
 }
});
test('dictation accepts punctuation and typography but detects missing and changed words',()=>{
 assert.equal(matchesDictation("  I'M in charge of checking the reports! ","I’m in charge of checking the reports."),true);
 assert.equal(matchesDictation('I am in charge','I’m in charge'),false);
 assert.equal(matchesDictation('Could you deadline?','Could you clarify the deadline?'),false);
 assert.equal(matchesDictation('','Who should I contact?'),false);
});
