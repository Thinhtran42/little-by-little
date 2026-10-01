import React,{useState} from 'react';
import {courseUnits} from '../../../shared/courses.js';
import {RealPhoto} from './RealPhoto.jsx';
const phrasal=new Set(['catch up','try it on','take it back','get off','look for','look into','go over','follow up','run out of','leave out','put away','wash up','put off','fill out','come back','check in','check out','look up','hand in','turn on','plug in','back up','pick up','join in','help out','sort out','drop off','take on','push back','bring up','account for','cut down on','switch off','weigh up','carry out','follow through']);
const groups=[['daily','Sinh hoạt & mua sắm',['food','home','shopping','health']],['travel','Di chuyển & lưu trú',['travel']],['people','Hẹn gặp & cộng đồng',['plans','friends','help','phone','entertainment']],['work','Làm việc & học tập',['work','learning','tech','interview']]];
export default function PhrasalCourseGroups({onOpen}){
 const [group,setGroup]=useState('daily');const topics=groups.find(g=>g[0]===group)[2];
 const units=courseUnits.filter(u=>topics.includes(u.topic)).map(u=>({unit:u,terms:u.reading.terms.filter(t=>phrasal.has(t[0]))})).filter(x=>x.terms.length);
 return <section className="courses"><h2>Chọn việc bạn muốn nói được</h2><p>Học cụm động từ trong câu chuyện, luyện vị trí từ rồi dùng lại ở tình huống khác.</p><label>Nhóm tình huống phrasal verb<select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><div className="course-unit-grid">{units.map(({unit,terms})=><button className="course-unit-card" key={unit.id} onClick={()=>onOpen(unit.reading.id)}><RealPhoto scene={unit.reading.photo}/><div><span className="studio-kicker">{unit.level} · {terms.length} cụm trong bài</span><h3>{unit.reading.title}</h3><p>{terms.map(t=>t[0]).join(' · ')}</p><span className="course-open">Mở bài, flashcard & kiểm tra →</span></div></button>)}</div></section>;
}
