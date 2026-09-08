import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  House,
  Activity,
  Laptop,
  Phone,
  LifeBuoy,
  Music,
  Award,
  Route,
  MessageCircle,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CircleCheck,
  Clock3,
  Coffee,
  Compass,
  Eye,
  Flame,
  GraduationCap,
  HardDrive,
  Heart,
  Info,
  Layers,
  LayoutDashboard,
  LibraryBig,
  PartyPopper,
  Plane,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useCatalog, CatalogProvider } from "./state/CatalogContext.jsx";
import { useLearner, LearnerProvider } from "./state/LearnerContext.jsx";
import CloudAccount, { SyncBanner } from "./components/CloudAccount.jsx";
import "./cloud.css";
import {
  dayKey,
  streak,
  loadProgress,
  markLearned,
  dailyPlan,
  recordAttempt,
  mastery,
} from "./progress";
import StudySession from "./components/StudySession.jsx";
import {
  Onboarding,
  PlanPanel,
  PathPage,
  PracticePage,
  InsightsPage,
  AccountPage,
} from "./components/ProductPages.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AppStatus from "./components/AppStatus.jsx";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import "./style.css";
import "./product.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
const icons = {
  House,
  Activity,
  Laptop,
  Phone,
  LifeBuoy,
  Music,
  Award,
  Route,
  MessageCircle,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CircleCheck,
  Clock3,
  Coffee,
  Compass,
  Eye,
  Flame,
  GraduationCap,
  HardDrive,
  Heart,
  Info,
  Layers,
  LayoutDashboard,
  LibraryBig,
  PartyPopper,
  Plane,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Users,
  Volume2,
  X,
};
const Icon = ({ name, size = 20, ...props }) => {
  const C = icons[name] || BookOpen;
  return <C size={size} strokeWidth={1.8} {...props} />;
};
const types = {
  sentence: "Câu giao tiếp",
  phrasal: "Phrasal verb",
  expression: "Cách nói tự nhiên",
};
function App() {
  const { data, setData, user, ready, submitAttempt } = useLearner();
  const { topics, phrases } = useCatalog();
  const [page, setPage] = useState(() =>
      [
        "home",
        "topics",
        "phrasal",
        "review",
        "saved",
        "path",
        "practice",
        "insights",
        "account",
      ].includes(location.hash.slice(1))
        ? location.hash.slice(1)
        : "home",
    ),
    [topic, setTopic] = useState(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [status, setStatus] = useState("all"),
    [session, setSession] = useState(null),
    [setup, setSetup] = useState(false),
    [mobileMore, setMobileMore] = useState(false),
    [toast, setToast] = useState("");
  const today = dayKey(),
    learned = Object.keys(data.learned).filter((id) =>
      phrases.some((p) => p.id === id),
    ).length,
    todayCount = data.history[today]?.length || 0,
    plan = dailyPlan(data, phrases),
    due = phrases.filter((p) => data.learned[p.id]?.due <= today),
    daily = plan.items,
    percent = Math.round((learned / phrases.length) * 100);
  const [, setClockTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setClockTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const onRoute = () => {
      const route = location.hash.slice(1);
      setPage(
        [
          "home",
          "topics",
          "phrasal",
          "review",
          "saved",
          "path",
          "practice",
          "insights",
          "account",
        ].includes(route)
          ? route
          : "home",
      );
      setTopic(null);
      setQuery("");
      setFilter("all");
      setStatus("all");
    };
    window.addEventListener("hashchange", onRoute);
    window.addEventListener("popstate", onRoute);
    return () => {
      window.removeEventListener("hashchange", onRoute);
      window.removeEventListener("popstate", onRoute);
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSession(null);
        setMobileMore(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (!session) return;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const items = [
        ...document.querySelectorAll(
          '[role="dialog"] button, [role="dialog"] input, [role="dialog"] select, [role="dialog"] textarea, [role="dialog"] summary',
        ),
      ].filter((x) => !x.disabled);
      const first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [!!session]);
  function nav(p) {
    setMobileMore(false);
    setPage(p);
    window.history.pushState(null, "", `#${p}`);
    setTopic(null);
    setQuery("");
    setFilter("all");
    setStatus("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(id) {
    setData((d) => ({
      ...d,
      saved: d.saved.includes(id)
        ? d.saved.filter((x) => x !== id)
        : [...d.saved, id],
    }));
  }
  function toggle(id) {
    setData((d) => {
      if (d.learned[id]) {
        const next = { ...d.learned };
        delete next[id];
        return { ...d, learned: next };
      }
      return markLearned(d, id);
    });
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) {
      setToast("Trình duyệt này chưa hỗ trợ đọc thành tiếng.");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = data.audio.accent;
    utterance.rate = data.audio.rate;
    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled")
        setToast(
          "Không thể phát âm lúc này. Hãy kiểm tra giọng tiếng Anh trên thiết bị.",
        );
    };
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.lang === data.audio.accent);
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  }
  function start(items, mode = "learn") {
    if (!items.length) {
      setToast(
        "Không có câu trong nhóm này. Bạn có thể chọn một bài trong lộ trình hoặc luyện hội thoại.",
      );
      return;
    }
    setSession({ items, mode });
  }
  if (!ready)
    return (
      <div className="app-loading">
        <Icon name="Sprout" size={35} />
        <h2>Đang mở không gian học của bạn…</h2>
      </div>
    );
  const selected = topics.find((t) => t.id === topic);
  const visible = phrases.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      (page !== "saved" || data.saved.includes(p.id)) &&
      (page !== "phrasal" || p.type === "phrasal") &&
      (filter === "all" || p.type === filter) &&
      (status === "all" ||
        (status === "learned" ? !!data.learned[p.id] : !data.learned[p.id])) &&
      `${p.en} ${p.vi}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
    return {
      key: dayKey(d),
      label: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i],
    };
  });
  const card = (p) => (
    <article className="phrase" key={p.id}>
      <div className="phrase-main">
        <span className={`type-label ${p.type}`}>{types[p.type]}</span>
        <h3>{p.en}</h3>
        <p>{p.vi}</p>
        <span className={`mastery-badge ${mastery(data.learned[p.id])}`}>
          {
            {
              new: "Chưa luyện",
              seen: "Đã xem · chưa kiểm chứng",
              growing: "Đang nhớ",
              strong: "Nhớ vững",
            }[mastery(data.learned[p.id])]
          }
        </span>
        {p.note && <div className="example">{p.note}</div>}
        {data.notes[p.id] && (
          <div className="example personal-example">
            Ví dụ của bạn: {data.notes[p.id]}
          </div>
        )}
      </div>
      <div className="phrase-actions">
        <button
          className="subtle-button"
          onClick={() => start([p], "learn")}
          aria-label={`Luyện ${p.en}`}
        >
          <Icon name="Play" size={15} />
          Luyện
        </button>
        <button
          className="icon-button"
          title="Nghe phát âm"
          aria-label={`Nghe ${p.en}`}
          onClick={() => speak(p.type === "phrasal" ? p.note : p.en)}
        >
          <Icon name="Volume2" size={19} />
        </button>
        <button
          className={`icon-button ${data.saved.includes(p.id) ? "is-saved" : ""}`}
          aria-label={`Lưu ${p.en}`}
          aria-pressed={data.saved.includes(p.id)}
          onClick={() => save(p.id)}
        >
          <Icon name="Bookmark" size={19} />
        </button>
        <button
          className={`learn-check ${data.learned[p.id] ? "checked" : ""}`}
          onClick={() => toggle(p.id)}
          aria-pressed={!!data.learned[p.id]}
        >
          <Icon
            name={data.learned[p.id] ? "CircleCheck" : "Circle"}
            size={17}
          />
          {data.learned[p.id] ? "Đã xem" : "Chưa xem"}
        </button>
      </div>
    </article>
  );
  return (
    <div className="app">
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            nav("home");
          }}
        >
          <span className="brand-mark">
            <Icon name="Sprout" size={26} />
          </span>
          <span>
            little<span className="brand-light">by</span>little
            <span className="brand-dot">.</span>
            <small>MỖI NGÀY MỘT CHÚT TIẾNG ANH</small>
          </span>
        </a>
        <div className="nav-label">KHÔNG GIAN HỌC TẬP</div>
        <nav>
          {[
            ["home", "LayoutDashboard", "Tổng quan"],
            ["topics", "LibraryBig", "Khám phá chủ đề"],
            ["phrasal", "Sparkles", "Phrasal verbs"],
            ["review", "RotateCcw", "Ôn tập"],
            ["saved", "Bookmark", "Câu đã lưu"],
            ["path", "Route", "Lộ trình"],
            ["practice", "MessageCircle", "Luyện tập"],
            ["insights", "TrendingUp", "Tiến bộ"],
            ["account", "Settings", "Cài đặt"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => nav(id)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {id === "review" && due.length > 0 && <b>{due.length}</b>}
              {id === "saved" && data.saved.length > 0 && (
                <b>{data.saved.length}</b>
              )}
            </button>
          ))}
          <button
            className="nav-item mobile-more"
            aria-expanded={mobileMore}
            aria-controls="mobile-extra-nav"
            onClick={() => setMobileMore((v) => !v)}
          >
            <Icon name="Layers" />
            <span>Thêm</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="grow-card">
            <span className="tiny-spark">✧</span>
            <Icon name="Sprout" size={37} />
            <h4>Nhỏ mỗi ngày. Lớn mai sau.</h4>
            <p>Tự nhớ. Tự nói. Tự tin hơn mỗi ngày.</p>
            <span className="grow-line" />
          </div>
          <button className="profile" onClick={() => setSetup(true)}>
            <span className="avatar">B</span>
            <span>
              <strong>{data.profile.name || "Người học bền bỉ"}</strong>
              <small>Hành trình của bạn</small>
            </span>
            <Icon name="Settings" size={18} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        {mobileMore && (
          <div className="mobile-extra-nav" id="mobile-extra-nav">
            <div className="section-heading">
              <strong>Không gian của bạn</strong>
              <button
                className="icon-button"
                onClick={() => setMobileMore(false)}
                aria-label="Đóng menu"
              >
                <Icon name="X" />
              </button>
            </div>
            {[
              ["path", "Route", "Lộ trình"],
              ["phrasal", "Sparkles", "Phrasal verbs"],
              ["saved", "Bookmark", "Câu đã lưu"],
              ["insights", "TrendingUp", "Tiến bộ"],
              ["account", "Settings", "Cài đặt"],
            ].map(([id, icon, label]) => (
              <button key={id} onClick={() => nav(id)}>
                <Icon name={icon} size={18} />
                {label}
                <Icon name="ArrowRight" size={15} />
              </button>
            ))}
          </div>
        )}
        <AppStatus />
        <header className="topbar">
          <div className="breadcrumb">
            Không gian học tập <Icon name="ChevronRight" size={14} />
            <strong>
              {selected?.name ||
                {
                  home: "Tổng quan",
                  topics: "Khám phá chủ đề",
                  phrasal: "Phrasal verbs",
                  review: "Ôn tập",
                  saved: "Câu đã lưu",
                  path: "Lộ trình",
                  practice: "Luyện tập",
                  insights: "Tiến bộ",
                  account: "Cài đặt",
                }[page]}
            </strong>
          </div>
          <div className="header-right">
            <span className="date-label">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            <span className="streak-pill">
              <Icon name="Flame" size={17} />
              {streak(data.history)} ngày liên tiếp
            </span>
            <button
              className="avatar small"
              onClick={() => setSetup(true)}
              aria-label="Cài đặt học tập"
            >
              B
            </button>
          </div>
        </header>
        <main>
          <SyncBanner openAccount={() => nav("account")} />
          <div className="page-heading">
            <div>
              <div className="eyebrow">A LITTLE PROGRESS, EVERY DAY</div>
              <h1>
                {page === "home" ? (
                  <>
                    Chào {data.profile.name || "bạn"}, hôm nay học gì?{" "}
                    <span className="wave">☀</span>
                  </>
                ) : (
                  selected?.name ||
                  {
                    topics: "Một chủ đề, nhiều điều để nói.",
                    phrasal: "Phrasal verbs, dùng thật tự nhiên.",
                    review: "Nhớ lâu hơn, tự tin hơn.",
                    saved: "Những câu bạn muốn giữ lại.",
                    path: "Lộ trình nhỏ, tiến bộ thật.",
                    practice: "Đến lượt bạn lên tiếng.",
                    insights: "Nhìn thấy điều bạn đang làm tốt.",
                    account: "Một không gian học của riêng bạn.",
                  }[page]
                )}
              </h1>
              <p>
                {selected?.description ||
                  (page === "home"
                    ? "Không cần học thật nhiều. Chỉ cần đều đặn, mỗi ngày một chút."
                    : page === "review"
                      ? "Ôn lại đúng lúc để biến điều đã học thành điều bạn nhớ."
                      : "Tiếng Anh gần gũi, dành cho những cuộc trò chuyện mỗi ngày.")}
              </p>
            </div>
            {page === "home" && (
              <button className="subtle-button" onClick={() => setSetup(true)}>
                <Icon name="SlidersHorizontal" size={16} />
                Mục tiêu học tập
              </button>
            )}
            {topic && (
              <button className="subtle-button" onClick={() => setTopic(null)}>
                <Icon name="ArrowLeft" size={16} />
                Tất cả chủ đề
              </button>
            )}
          </div>
          {page === "home" && (
            <>
              {!data.profile.onboarded && (
                <section className="welcome-strip">
                  <div>
                    <strong>Thiết kế nhịp học phù hợp với bạn</strong>
                    <p>
                      Chọn mục đích để ưu tiên đúng chủ đề. Mất khoảng 30 giây.
                    </p>
                  </div>
                  <button className="primary" onClick={() => setSetup(true)}>
                    Bắt đầu thiết lập <Icon name="ArrowRight" size={16} />
                  </button>
                </section>
              )}
              <section className="hero">
                <div className="hero-copy">
                  <span className="hero-tag">
                    <span /> KẾ HOẠCH HÔM NAY
                  </span>
                  <h2>
                    Một chút tiếng Anh.
                    <br />
                    Một bước tự tin hơn.
                  </h2>
                  <p>
                    Ôn {plan.due.length} câu cũ · luyện {plan.fresh.length} câu
                    mới.
                    <br />
                    Nhớ lại trước khi nhìn đáp án. Dùng được mới là đích đến.
                  </p>
                  <div className="hero-buttons">
                    <button
                      className="primary light"
                      onClick={() => start(daily)}
                    >
                      {daily.length
                        ? "Bắt đầu buổi học"
                        : "Hoàn thành kế hoạch hôm nay"}
                      <Icon
                        name={daily.length ? "ArrowRight" : "Check"}
                        size={18}
                      />
                    </button>
                    <span>
                      <Icon name="Clock3" size={15} />
                      Khoảng {Math.max(5, daily.length * 2)} phút
                    </span>
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <span className="art-spark s1">✦</span>
                  <span className="art-spark s2">✧</span>
                  <div className="orbit" />
                  <div className="floating-note note-top">
                    <span>✦ phrase of the day</span>
                    <strong>You've got this!</strong>
                    <small>Bạn làm được mà!</small>
                  </div>
                  <div className="book book-bottom">
                    <span>ONE DAY AT A TIME</span>
                  </div>
                  <div className="book book-top">
                    <Icon name="Sprout" size={37} />
                    <span>
                      A little
                      <br />
                      <b>better.</b>
                    </span>
                  </div>
                  <div className="plant">
                    <i />
                    <i />
                    <i />
                    <i />
                    <div className="stem" />
                    <div className="pot" />
                  </div>
                  <div className="floating-note note-bottom">
                    <span className="check-bubble">✓</span> Small steps. Big
                    dreams.
                  </div>
                </div>
              </section>
              <section className="stats">
                <div className="stat">
                  <span className="stat-icon mint">
                    <Icon name="BookOpen" />
                  </span>
                  <div>
                    <span>Câu đã xem / luyện</span>
                    <strong>
                      {learned}
                      <small> / {phrases.length} câu</small>
                    </strong>
                  </div>
                  <svg className="mini-ring" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      style={{ strokeDasharray: `${percent} 100` }}
                    />
                  </svg>
                </div>
                <div className="stat">
                  <span className="stat-icon peach">
                    <Icon name="Flame" />
                  </span>
                  <div>
                    <span>Chuỗi ngày học</span>
                    <strong>
                      {streak(data.history)}
                      <small> ngày liên tiếp</small>
                    </strong>
                  </div>
                  <span className="stat-decoration">↗</span>
                </div>
                <div className="stat">
                  <span className="stat-icon lavender">
                    <Icon name="Target" />
                  </span>
                  <div>
                    <span>Câu mới hôm nay</span>
                    <strong>
                      {Math.min(plan.newCount, data.goal)}
                      <small> / {data.goal} câu</small>
                    </strong>
                  </div>
                  <div className="goal-bars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={
                          plan.newCount / data.goal > i / 5 ? "filled" : ""
                        }
                      />
                    ))}
                  </div>
                </div>
              </section>
              <PlanPanel
                data={data}
                plan={plan}
                start={start}
                onPractice={() => nav("practice")}
                onSetup={() => setSetup(true)}
              />
              <div className="home-grid">
                <section className="topics-section">
                  <div className="section-heading">
                    <div>
                      <h2>
                        Khám phá theo chủ đề <span>{topics.length}</span>
                      </h2>
                      <p>Chuyện quen thuộc, cách nói thật tự nhiên.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => nav("topics")}
                    >
                      Xem tất cả
                      <Icon name="ArrowUpRight" size={16} />
                    </button>
                  </div>
                  <div className="topic-grid">
                    {topics.slice(0, 6).map((t) => (
                      <TopicCard
                        key={t.id}
                        topic={t}
                        data={data}
                        onClick={() => {
                          nav("topics");
                          setTopic(t.id);
                        }}
                      />
                    ))}
                  </div>
                </section>
                <aside className="right-column">
                  <section className="week-card">
                    <div className="section-heading">
                      <h3>Nhịp học của bạn</h3>
                      <Icon name="CalendarDays" size={18} />
                    </div>
                    <p>Đều đặn là một siêu năng lực.</p>
                    <div className="week-days">
                      {week.map((d) => (
                        <div key={d.key}>
                          <span>{d.label}</span>
                          <b
                            className={`${data.history[d.key]?.length ? "complete" : ""} ${d.key === today ? "today" : ""}`}
                          >
                            {data.history[d.key]?.length ? (
                              <Icon name="Check" size={14} />
                            ) : d.key === today ? (
                              <span />
                            ) : (
                              "·"
                            )}
                          </b>
                        </div>
                      ))}
                    </div>
                    <div className="week-message">
                      <Icon name="Sprout" size={17} />
                      {todayCount
                        ? "Bạn đã dành thời gian cho bản thân hôm nay!"
                        : "Một khởi đầu nhỏ cũng đáng tự hào."}
                    </div>
                  </section>
                  <section className="daily-phrase">
                    <div className="daily-label">
                      <Icon name="Sparkles" size={16} /> MỘT CÂU HAY CHO BẠN
                      <button
                        className="icon-button"
                        onClick={() => save("learning-15")}
                        aria-label="Lưu câu One step at a time"
                        aria-pressed={data.saved.includes("learning-15")}
                      >
                        <Icon
                          name={
                            data.saved.includes("learning-15")
                              ? "BookmarkCheck"
                              : "Bookmark"
                          }
                          size={17}
                        />
                      </button>
                    </div>
                    <span className="quote-mark">“</span>
                    <h3>
                      One step
                      <br />
                      at a time.
                    </h3>
                    <p>Cứ từng bước một.</p>
                    <div className="daily-footer">
                      <span>Không vội. Không dừng lại.</span>
                      <button
                        aria-label="Nghe One step at a time"
                        onClick={() => speak("One step at a time.")}
                      >
                        <Icon name="Volume2" size={17} />
                      </button>
                    </div>
                  </section>
                </aside>
              </div>
              <section className="review-banner">
                <div className="review-symbol">
                  <Icon name="Layers" size={24} />
                </div>
                <div>
                  <h3>Gặp lại một chút, nhớ lâu hơn.</h3>
                  <p>
                    {due.length
                      ? `Có ${due.length} câu đang chờ bạn ôn lại hôm nay.`
                      : "Câu đã học sẽ xuất hiện ở đây khi đến lịch ôn."}
                  </p>
                </div>
                <button className="subtle-button" onClick={() => nav("review")}>
                  Góc ôn tập
                  <Icon name="ArrowRight" size={16} />
                </button>
              </section>
            </>
          )}
          {page === "topics" && !topic && (
            <>
              <div className="library-intro">
                <Icon name="Compass" size={23} />
                <span>
                  <strong>
                    {topics.length} chủ đề · {phrases.length} cách mở lời
                  </strong>
                  <br />
                  Mỗi chủ đề có 24 câu giao tiếp, 8 phrasal verbs và 8 cách nói
                  tự nhiên.
                </span>
              </div>
              <div className="topic-grid full">
                {topics.map((t) => (
                  <TopicCard
                    key={t.id}
                    topic={t}
                    data={data}
                    onClick={() => setTopic(t.id)}
                  />
                ))}
              </div>
            </>
          )}
          {(topic || page === "phrasal" || page === "saved") && (
            <>
              <div className="library-toolbar">
                <div className="search">
                  <Icon name="Search" size={18} />
                  <input
                    aria-label="Tìm câu tiếng Anh hoặc nghĩa tiếng Việt"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm câu tiếng Anh, nghĩa tiếng Việt..."
                  />
                </div>
                <select
                  aria-label="Lọc tiến độ"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">Tất cả tiến độ</option>
                  <option value="new">Chưa xem</option>
                  <option value="learned">Đã xem / luyện</option>
                </select>
                {topic && (
                  <button
                    className="primary"
                    onClick={() =>
                      start(
                        visible
                          .filter((p) => !data.learned[p.id])
                          .slice(0, data.goal),
                      )
                    }
                  >
                    <Icon name="Play" size={16} />
                    Học chủ đề này
                  </button>
                )}
              </div>
              <div className="filter-row">
                {page !== "phrasal" &&
                  [["all", "Tất cả"], ...Object.entries(types)].map(
                    ([id, label]) => (
                      <button
                        className={filter === id ? "selected" : ""}
                        key={id}
                        onClick={() => setFilter(id)}
                      >
                        {label}
                      </button>
                    ),
                  )}
                <span>{visible.length} câu</span>
              </div>
              <div className="phrase-list">{visible.map(card)}</div>
              {!visible.length && (
                <div className="empty">
                  <Icon
                    name={page === "saved" ? "Bookmark" : "Search"}
                    size={40}
                  />
                  <h3>
                    {page === "saved" && !query
                      ? "Bộ sưu tập bắt đầu từ một câu hay."
                      : "Chưa tìm thấy câu phù hợp."}
                  </h3>
                  <p>
                    {page === "saved"
                      ? "Bấm biểu tượng lưu bên cạnh câu bạn thích để tìm lại tại đây."
                      : "Thử từ khóa khác hoặc thay đổi bộ lọc nhé."}
                  </p>
                  <button className="primary" onClick={() => nav("topics")}>
                    Khám phá chủ đề
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          {page === "review" && (
            <>
              <div className="review-overview">
                <div>
                  <span className="eyebrow">LẶP LẠI NGẮT QUÃNG</span>
                  <h2>
                    {due.length
                      ? `${due.length} câu đang chờ gặp lại bạn.`
                      : "Bạn đang bắt nhịp rất tốt."}
                  </h2>
                  <p>
                    Viết câu từ trí nhớ trước khi nhìn đáp án. Câu sai quay lại
                    sớm; câu nhớ qua nhiều ngày mới được giãn lịch đến 3, 7, 14,
                    30 và 60 ngày.
                  </p>
                  <button
                    className="primary"
                    onClick={() =>
                      due.length
                        ? start(due, "review")
                        : start(
                            phrases.filter((p) => data.learned[p.id]),
                            "review",
                          )
                    }
                  >
                    <Icon name="RotateCcw" size={17} />
                    {due.length ? "Ôn tập ngay" : "Luyện lại các câu đã học"}
                  </button>
                </div>
                <span className="big-review">
                  <Icon name="Brain" size={70} />
                </span>
              </div>
              {due.length ? (
                due.map(card)
              ) : (
                <div className="empty">
                  <Icon name="CircleCheck" size={40} />
                  <h3>Không có câu đến hạn ôn hôm nay.</h3>
                  <p>
                    {learned
                      ? "Bạn có thể luyện thêm hoặc quay lại vào ngày mai."
                      : "Học vài câu đầu tiên để bắt đầu xây dựng trí nhớ nhé."}
                  </p>
                  <button className="text-button" onClick={() => nav("topics")}>
                    Khám phá câu mới
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          {page === "path" && <PathPage data={data} start={start} />}
          {page === "practice" && (
            <PracticePage
              data={data}
              setData={setData}
              start={start}
              speak={speak}
              notify={setToast}
            />
          )}
          {page === "insights" && <InsightsPage data={data} start={start} />}
          {page === "account" && (
            <>
              <CloudAccount />
              <AccountPage
                data={data}
                setData={setData}
                notify={setToast}
                onSetup={() => setSetup(true)}
                speak={speak}
              />
            </>
          )}
          <footer>
            <span>
              <Icon name="Sprout" size={14} /> Một chút mỗi ngày, một phiên bản
              tự tin hơn.
            </span>
            <span>
              Made for your everyday English{" "}
              <span className="footer-heart">♡</span>
            </span>
          </footer>
        </main>
      </div>
      {setup && (
        <Onboarding
          data={data}
          setData={setData}
          onClose={() => setSetup(false)}
        />
      )}
      {session && (
        <StudySession
          key={session.items.map((p) => p.id).join(",") + session.mode}
          items={session.items}
          mode={session.mode}
          data={data}
          onResult={submitAttempt}
          onNote={(id, note) => {
            setData((d) => ({ ...d, notes: { ...d.notes, [id]: note } }));
            setToast("Đã lưu ví dụ của bạn.");
          }}
          onClose={() => {
            setSession(null);
            window.speechSynthesis?.cancel();
          }}
          speak={speak}
        />
      )}
      {toast && (
        <div role="status" className="toast">
          <Icon name="Info" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
function TopicCard({ topic: t, data, onClick }) {
  const { phrases } = useCatalog();
  const count = phrases.filter(
    (p) => p.topic === t.id && data.learned[p.id],
  ).length;
  return (
    <button className="topic-card" onClick={onClick}>
      <div className="topic-card-top">
        <span className={`topic-icon ${t.color}`}>
          <Icon name={t.icon} size={23} />
        </span>
        <span className="topic-count">
          40 câu <Icon name="ArrowUpRight" size={15} />
        </span>
      </div>
      <h3>{t.name}</h3>
      <p>{t.en}</p>
      <div className="topic-progress">
        <span>
          <i style={{ width: `${(count / 40) * 100}%` }} />
        </span>
        <small>{count}/40</small>
      </div>
    </button>
  );
}
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <CatalogProvider>
      <LearnerProvider>
        <App />
      </LearnerProvider>
    </CatalogProvider>
  </ErrorBoundary>,
);
