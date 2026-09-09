import { Volume2 as PlaybackIcon } from "lucide-react";
import React, { useState } from 'react';
import { Coffee, Plane, BriefcaseBusiness, House, Users, ShoppingBag, MessageCircle, Volume2 } from 'lucide-react';

const scenes = {
  food: ['Ở quán ăn', 'Bạn đang trao đổi với nhân viên hoặc người cùng bàn.', Coffee],
  travel: ['Trên chuyến đi', 'Bạn cần trao đổi thông tin khi di chuyển hoặc đến một nơi mới.', Plane],
  work: ['Một ngày làm việc', 'Bạn đang trao đổi với đồng nghiệp về công việc.', BriefcaseBusiness],
  interview: ['Buổi phỏng vấn', 'Bạn đang trò chuyện với người tuyển dụng.', BriefcaseBusiness],
  home: ['Ở nhà', 'Bạn đang trò chuyện về sinh hoạt cùng người thân.', House],
  shopping: ['Tại cửa hàng', 'Bạn trao đổi với nhân viên về việc mua sắm.', ShoppingBag],
  friends: ['Gặp gỡ bạn bè', 'Bạn trò chuyện với một người bạn.', Users],
};

export default function ContextPractice({ phrase: p, speak, onReady, illustration: Scene }) {
  const [step, setStep] = useState('card');
  const [flipped, setFlipped] = useState(false);
  const [picked, setPicked] = useState([]);
  const [checked, setChecked] = useState(false);
  const words = p.en.split(/\s+/);
  const [tiles] = useState(() => words.map((word, id) => ({ word, id })).reverse());
  const [title, context, Illustration] = scenes[p.topic] || ['Một cuộc trò chuyện', 'Bạn muốn diễn đạt ý dưới đây trong cuộc trò chuyện.', MessageCircle];
  const answer = picked.map(id => words[id]).join(' ');
  const correct = answer === p.en;
  return <div className="context-practice">
    {Scene ? <div className="studio-context-scene"><Scene topic={p.topic} title={title}/></div> : <div className="scene-art" role="img" aria-label={title}>
      <span className="scene-sun" /><span className="scene-window" />
      <Illustration size={76} strokeWidth={1.3} />
      <span className="scene-bubble">Let's talk!</span>
      <span className="scene-caption">{title}</span>
    </div>}
    <div className="practice-path"><span className={step === 'card' ? 'current' : ''}>01 · Khám phá</span><span className={step === 'build' ? 'current' : ''}>02 · Xếp câu</span><span>03 · Tự nhớ</span></div>
    <p className="context-note">{context} Chủ đề minh họa; hãy xem ghi chú để hiểu cách dùng riêng của mẫu câu.</p>
    {step === 'card' ? <>
      <button className="context-flip" onClick={() => setFlipped(!flipped)} aria-label={flipped ? 'Lật về nghĩa tiếng Việt' : 'Lật thẻ xem tiếng Anh'}>
        <small>{flipped ? 'MẪU CÂU TIẾNG ANH' : 'BẠN SẼ DIỄN ĐẠT THẾ NÀO?'}</small>
        <h2>{flipped ? p.en : p.vi}</h2>
        <span>{flipped ? p.vi : 'Thử nói trước, rồi chạm để lật thẻ ↻'}</span>
      </button>
      {flipped && <div className="context-reveal"><button className="listen-button" onClick={() => speak(p.en)} aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>{p.note && <p>{p.note}</p>}<p>Hãy nghĩ đến một người mà bạn có thể nói câu này cùng.</p></div>}
      <button className="primary wide" disabled={!flipped} onClick={() => setStep('build')}>Thử xếp câu →</button>
    </> : <>
      <h3>Ghép lại điều bạn vừa học</h3><p>{p.vi}</p>
      <div className="tile-answer" aria-label="Câu đang xếp">{picked.length ? picked.map((id, i) => <button key={id} disabled={checked} onClick={() => setPicked(picked.filter((_, n) => n !== i))}>{words[id]} <small>×</small></button>) : <span>Chọn các từ bên dưới theo thứ tự…</span>}</div>
      <div className="word-tiles">{tiles.map(({word, id}) => <button key={id} disabled={picked.includes(id) || checked} onClick={() => setPicked([...picked, id])}>{word}</button>)}</div>
      {checked && <p role="status" className="hint-box">{correct ? 'Đúng thứ tự rồi! Tiếp theo hãy thử khi không còn từ gợi ý.' : `Cùng nhìn lại: ${p.en}`}</p>}
      {!checked ? <button className="primary wide" disabled={picked.length !== words.length} onClick={() => setChecked(true)}>Kiểm tra cách xếp</button> : <button className="primary wide" onClick={onReady}>Ẩn gợi ý · tự nhớ câu →</button>}
      <p className="study-hint">Lật thẻ và xếp câu là bước làm quen. Bài tự nhớ tiếp theo mới được ghi vào kết quả học.</p>
    </>}
  </div>;
}
