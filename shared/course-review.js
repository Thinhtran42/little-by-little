// Transparent interval rules, not a calibrated proficiency score.
export const reviewIntervals = [0, 1, 3, 7, 14, 30];
export function scheduleCourseReview(previous, {day,correct,hinted,mode}) {
 const lastPassed = previous?.last_passed || null;
 if(!correct || hinted)return {level:0,lastPassed,due:day};
 let level=Math.max(1,previous?.review_level||0);
 if(previous?.review_level>0 && (!lastPassed || day>lastPassed) && day>=previous.due_day)level=Math.min(5,level+1);
 // Recognition is useful practice but cannot establish productive retention.
 if(mode==='choice')level=1;
 if(previous?.due_day>day)return {level:Math.min(level,previous.review_level||1),lastPassed:day,due:previous.due_day};
 const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+reviewIntervals[level]);
 return {level,lastPassed:day,due:date.toISOString().slice(0,10)};
}
export function studyStreak(days,today){
 const dates=new Set(days);const d=new Date(today+'T12:00:00Z');
 if(!dates.has(today))d.setUTCDate(d.getUTCDate()-1);
 let streak=0;while(dates.has(d.toISOString().slice(0,10))){streak++;d.setUTCDate(d.getUTCDate()-1);}return streak;
}
