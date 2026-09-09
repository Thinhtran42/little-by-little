import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Sprout } from "lucide-react";
import { useCatalog, CatalogProvider } from "./state/CatalogContext.jsx";
import { useLearner, LearnerProvider } from "./state/LearnerContext.jsx";
import { dayKey, markLearned, dailyPlan } from "./progress";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./cloud.css";
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
        <Sprout size={35} />
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

  return (
    <React.Suspense fallback={<p>Đang mở Studio…</p>}>
      <StudioWorkspace
        controller={{
          data,
          setData,
          user,
          page,
          nav,
          topic,
          setTopic,
          query,
          setQuery,
          filter,
          setFilter,
          status,
          setStatus,
          topics,
          phrases,
          selected,
          visible,
          daily,
          due,
          plan,
          learned,
          todayCount,
          start,
          speak,
          save,
          toggle,
          setup,
          setSetup,
          session,
          setSession,
          submitAttempt,
          toast,
          setToast,
        }}
      />
    </React.Suspense>
  );
}
const StudioWorkspace = React.lazy(
  () => import("./components/studio/StudioWorkspace.jsx"),
);
const FieldNotesPreview =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get("preview") === "field-notes"
    ? React.lazy(() => import("./components/FieldNotesPreview.jsx"))
    : null;
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <CatalogProvider>
      <LearnerProvider>
        {FieldNotesPreview ? (
          <React.Suspense fallback={<p>Đang mở sổ tay…</p>}>
            <FieldNotesPreview />
          </React.Suspense>
        ) : (
          <App />
        )}
      </LearnerProvider>
    </CatalogProvider>
  </ErrorBoundary>,
);
