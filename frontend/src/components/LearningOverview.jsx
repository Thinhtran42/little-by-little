import React,{useEffect,useState} from 'react';
import {useLearner} from '../state/LearnerContext.jsx';
import {api} from '../services/api.js';
import {courseUnits} from '../../../shared/courses.js';
import './courses.css';

export default function LearningOverview({onOpen,compact=false}){
 const {user}=useLearner();
 return <Overview key={user?.id||'guest'} user={user} onOpen={onOpen} compact={compact}/>;
}
function Overview({user,onOpen,compact}){
 const [data,setData]=useState(null),[error,setError]=useState(''),[reload,setReload]=useState(0);
 useEffect(()=>{if(!user)return;const ac=new AbortController();let active=true;
  async function load(){try{const p=await api('/me/courses',{signal:ac.signal});if(active){setData(p);setError('');}}catch(e){if(active&&!ac.signal.aborted)setError(e.message);}}
  load();const timer=setInterval(load,60000);window.addEventListener('focus',load);return ()=>{active=false;ac.abort();clearInterval(timer);window.removeEventListener('focus',load);};
 },[user,reload]);
 if(!user)return <section className="learning-overview"><h2>Tiếp tục học theo tình huống</h2><p>B1/B2 kết hợp từ, cấu trúc và hội thoại. Đăng nhập để lưu kết quả và lịch ôn.</p><button className="studio-link" onClick={()=>onOpen(null)}>Khám phá lộ trình B1/B2 →</button></section>;
 if(error)return <section className="learning-overview" role="alert"><p>Chưa tải được tiến độ bài học: {error}</p><button onClick={()=>setReload(n=>n+1)}>Thử tải tiến độ bài học</button></section>;
 if(!data)return <p role="status">Đang tổng hợp bài học…</p>;
 const due=courseUnits.map(unit=>({unit,count:data.attempts.filter(a=>a.lesson_id===unit.id&&a.due_day<=data.today).length})).filter(x=>x.count).sort((a,b)=>b.count-a.count);
 const next=due[0]?.unit||courseUnits.find(u=>u.questions.some(q=>!data.attempts.some(a=>a.lesson_id===u.id&&a.question_id===q.id&&a.correct&&!a.hinted)))||courseUnits[0];
 return <section className="learning-overview"><span className="studio-kicker">TIẾP NỐI BUỔI HỌC</span><h2>{due.length?'Ôn lại trước khi học tiếp.':'Một tình huống tiếp theo.'}</h2><div className="learning-overview-metrics"><p><strong>{data.stats.streak}</strong> ngày liên tiếp toàn tài khoản</p><p><strong>{data.stats.independent}/{data.stats.practiced}</strong> câu B1/B2 đúng không gợi ý ở lượt gần nhất</p><p><strong>{data.stats.due}</strong> câu B1/B2 đến hạn</p></div><p>Ngày học tính gộp kho câu, hội thoại và bài kiểm tra; một ngày chỉ tính một lần. Lật thẻ hoặc mở bài chưa được tính là kết quả.</p><button className="studio-button" onClick={()=>onOpen(next.reading.id)}>{due.length?'Ôn':'Học'}: {next.reading.title} →</button>{!compact&&<><h3>Hàng đợi ôn theo bài</h3>{due.length?<ul>{due.map(({unit,count})=><li key={unit.id}><button className="studio-link" onClick={()=>onOpen(unit.reading.id)}>{unit.reading.title} · {count} câu đến hạn →</button></li>)}</ul>:<p>Chưa có câu B1/B2 đến hạn. Bạn vẫn có thể chọn bài bất cứ lúc nào.</p>}<p>Đã có hoạt động vào {data.stats.activeDays} ngày. Lịch ôn dùng quy tắc tăng khoảng cách, không phải điểm chứng nhận trình độ.</p></>}</section>;
}
