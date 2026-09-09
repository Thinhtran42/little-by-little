import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Bookmark,
  Compass,
  Home,
  Menu,
  RotateCcw,
  Settings,
  TrendingUp,
  Route,
  MessageCircle,
  X,
  Play,
  Pause,
} from "lucide-react";
import { FieldScene } from "../FieldScene.jsx";
import { StudioHome } from "./StudioHome.jsx";
import { StudioLibrary } from "./StudioLibrary.jsx";
import { StudioReview, StudioPath } from "./StudioReview.jsx";
import { sceneFor } from "./studio-data.js";
import PhrasalHub from "../PhrasalHub.jsx";
import CloudAccount, { SyncBanner } from "../CloudAccount.jsx";
import AppStatus from "../AppStatus.jsx";
import StudySession from "../StudySession.jsx";
import {
  Onboarding,
  PracticePage,
  InsightsPage,
  AccountPage,
} from "../ProductPages.jsx";

import "./studio.css";
import "./studio-learning.css";

const links = [
  ["home", Home, "Tổng quan"],
  ["topics", Compass, "Khám phá chủ đề"],
  ["phrasal", BookOpen, "Phrasal verbs"],
  ["review", RotateCcw, "Ôn tập"],
  ["saved", Bookmark, "Câu đã lưu"],
  ["path", Route, "Lộ trình"],
  ["practice", MessageCircle, "Luyện tập"],
  ["insights", TrendingUp, "Tiến bộ"],
  ["account", Settings, "Cài đặt"],
];
const titles = {
  home: "Một chút hôm nay.",
  topics: "Tiếng Anh ở quanh bạn.",
  phrasal: "Một tình huống. Một nhóm từ.",
  review: "Gặp lại để nhớ lâu.",
  saved: "Những câu muốn giữ lại.",
  path: "Đi từng bước nhỏ.",
  practice: "Đến lượt bạn lên tiếng.",
  insights: "Nhìn lại chặng đường.",
  account: "Không gian của bạn.",
};
const descriptions = {
  topics: "Chọn nơi bạn muốn tự tin hơn. Mỗi chủ đề là một lát cắt đời sống.",
  phrasal: "Đọc câu chuyện, hình dung hành động, rồi tự nhớ lại cách nói.",
  review: "Ưu tiên câu đến hạn. Không cần học lại mọi thứ cùng lúc.",
  saved: "Gom những cách nói hữu ích cho cuộc sống của riêng bạn.",
  path: "Chọn một chủ đề. Mỗi buổi chỉ tập trung vào 5 câu.",
  practice: "Thử tự viết, nhận diện hoặc nhập vai trong một cuộc trò chuyện.",
  insights: "Tiến bộ đến từ những lần tự nhớ, không chỉ số câu đã xem.",
  account: "Tài khoản, nhịp học và lựa chọn âm thanh.",
};
export default function StudioWorkspace({ controller: c }) {
  const [menu, setMenu] = useState(false),
    [motion, setMotion] = useState(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  useEffect(() => {
    setMenu(false);
  }, [c.page]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div className={`studio-app ${motion ? "" : "studio-still"}`}>
      <a className="studio-skip" href="#studio-main">
        Đến nội dung
      </a>
      <aside className="studio-sidebar">
        <a
          className="studio-brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            c.nav("home");
          }}
        >
          little
          <br />
          by little<span>ENGLISH, IN REAL LIFE.</span>
        </a>
        <button
          className="studio-menu"
          aria-label={menu ? "Đóng menu" : "Mở menu"}
          aria-expanded={menu}
          aria-controls="studio-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <nav
          id="studio-navigation"
          className={menu ? "is-open" : ""}
          aria-label="Điều hướng chính"
        >
          {links.map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={c.page === id ? "page" : undefined}
              onClick={() => c.nav(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === "review" && c.due.length > 0 && (
                <small>{c.due.length}</small>
              )}
            </button>
          ))}
        </nav>
        <div className="studio-side-note">
          <span>THE DAILY PRACTICE</span>
          <p>
            Không cần hoàn hảo.
            <br />
            Chỉ cần quay lại.
          </p>
          <span>Học một chút, mỗi ngày.</span>
        </div>
      </aside>
      <div className="studio-workspace">
        <AppStatus />
        <header className="studio-topbar">
          <span>
            YOUR ENGLISH STUDIO{" "}
            <b>/ {links.find((l) => l[0] === c.page)?.[2]}</b>
          </span>
          <button
            aria-label={motion ? "Tắt chuyển động" : "Bật chuyển động"}
            aria-pressed={motion}
            onClick={() => setMotion(!motion)}
          >
            {motion ? <Pause size={16} /> : <Play size={16} />}
            <span>Chuyển động</span>
          </button>
        </header>
        <main id="studio-main" tabIndex={-1}>
          <SyncBanner openAccount={() => c.nav("account")} />
          <div className="studio-heading">
            <span className="studio-kicker">
              LITTLE BY LITTLE /{" "}
              {String(links.findIndex((l) => l[0] === c.page) + 1).padStart(
                2,
                "0",
              )}
            </span>
            <h1>
              {c.page === "home" && c.data.profile.name
                ? `Chào ${c.data.profile.name}.`
                : titles[c.page]}
            </h1>
            {descriptions[c.page] && <p>{descriptions[c.page]}</p>}
          </div>
          {c.page === "home" && <StudioHome c={c} motion={motion} />}
          {(c.page === "topics" || c.page === "saved") && (
            <StudioLibrary key={`${c.page}-${c.topic}`} c={c} />
          )}
          {c.page === "phrasal" && (
            <div className="studio-learning">
              <PhrasalHub speak={c.speak} illustration={StudioStoryScene} />
            </div>
          )}
          {c.page === "review" && <StudioReview c={c} />}
          {c.page === "path" && <StudioPath c={c} />}
          {c.page === "practice" && (
            <div className="studio-learning">
              <PracticePage
                data={c.data}
                setData={c.setData}
                start={c.start}
                speak={c.speak}
                notify={c.setToast}
              />
            </div>
          )}
          {c.page === "insights" && (
            <div className="studio-learning">
              <InsightsPage data={c.data} start={c.start} />
            </div>
          )}
          {c.page === "account" && (
            <div className="studio-learning">
              <CloudAccount />
              <AccountPage
                data={c.data}
                setData={c.setData}
                notify={c.setToast}
                onSetup={() => c.setSetup(true)}
                speak={c.speak}
              />
            </div>
          )}
          <footer className="studio-footer">
            A little practice. A little more you.
            <span>Tiếng Anh cho cuộc sống hằng ngày</span>
          </footer>
        </main>
      </div>
      {c.setup && (
        <Onboarding
          data={c.data}
          setData={c.setData}
          onClose={() => c.setSetup(false)}
        />
      )}
      {c.session && (
        <StudySession
          illustration={StudioScene}
          key={c.session.items.map((p) => p.id).join(",") + c.session.mode}
          items={c.session.items}
          mode={c.session.mode}
          data={c.data}
          onResult={c.submitAttempt}
          speak={c.speak}
          onNote={(id, note) => {
            c.setData((d) => ({ ...d, notes: { ...d.notes, [id]: note } }));
            c.setToast("Đã lưu ví dụ của bạn.");
          }}
          onClose={() => {
            c.setSession(null);
            window.speechSynthesis?.cancel();
          }}
        />
      )}
      {c.toast && (
        <div role="status" className="toast">
          {c.toast}
        </div>
      )}
    </div>
  );
}

function StudioStoryScene({ scene, title }) {
  return (
    <FieldScene scene={scene === "travel" ? "bus" : scene} title={title} />
  );
}

function StudioScene({ topic, title }) {
  return <FieldScene scene={sceneFor(topic)} title={title} />;
}
