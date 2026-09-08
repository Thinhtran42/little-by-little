import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { api, setCsrf } from "../services/api.js";
import {
  loadProgress,
  initialState,
  normalizeProgress,
  recordAttempt,
  dayKey,
} from "../../../shared/progress.js";
const Context = createContext(null);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function commands(before, after) {
  const result = [];
  if (
    !same(before.profile, after.profile) ||
    before.goal !== after.goal ||
    !same(before.audio, after.audio)
  )
    result.push({
      type: "preferences",
      value: { profile: after.profile, goal: after.goal, audio: after.audio },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  for (const id of new Set([...before.saved, ...after.saved]))
    if (before.saved.includes(id) !== after.saved.includes(id))
      result.push({ type: "bookmark", id, value: after.saved.includes(id) });
  for (const id of new Set([
    ...Object.keys(before.learned),
    ...Object.keys(after.learned),
  ]))
    if (!!before.learned[id] !== !!after.learned[id])
      result.push({ type: "seen", id, value: !!after.learned[id] });
  for (const id of new Set([
    ...Object.keys(before.notes),
    ...Object.keys(after.notes),
  ]))
    if (before.notes[id] !== after.notes[id])
      result.push({ type: "note", id, value: after.notes[id] || "" });
  return result;
}
export function LearnerProvider({ children }) {
  const [data, commit] = useState(loadProgress),
    [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [status, setStatus] = useState("guest"),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  const current = useRef(data),
    identity = useRef(null),
    hydrated = useRef(false),
    chain = useRef(Promise.resolve()),
    version = useRef(0),
    busy = useRef(0),
    epoch = useRef(0);
  current.current = data;
  function apply(payload) {
    if (payload.state && payload.revision >= version.current) {
      const next = normalizeProgress(payload.state);
      hydrated.current = true;
      version.current = payload.revision;
      setRevision(payload.revision);
      current.current = next;
      commit(next);
    }
  }
  async function refresh() {
    if (!identity.current || busy.current) return;
    const e = epoch.current;
    try {
      const p = await api("/me/progress");
      if (e === epoch.current) {
        apply(p);
        setStatus("saved");
        setError("");
      }
    } catch (err) {
      if (e === epoch.current) {
        setStatus("error");
        setError(err.message);
      }
    }
  }
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await api("/auth/me");
        if (!alive) return;
        if (me.user) {
          current.current = initialState();
          commit(current.current);
          identity.current = me.user;
          setUser(me.user);
          setCsrf(me.csrf);
          const p = await api("/me/progress");
          if (alive) {
            apply(p);
            setStatus("saved");
          }
        }
      } catch (err) {
        if (alive) {
          setError(
            identity.current
              ? "Chưa tải được tiến độ tài khoản. Hãy kết nối mạng và bấm Lấy tiến độ mới nhất."
              : "Máy chủ chưa kết nối. Bạn đang ở chế độ dùng thử trên thiết bị.",
          );
          setStatus(identity.current ? "error" : "guest");
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    const online = () => refresh();
    window.addEventListener("focus", online);
    window.addEventListener("online", online);
    const t = setInterval(online, 30000);
    return () => {
      alive = false;
      clearInterval(t);
      window.removeEventListener("focus", online);
      window.removeEventListener("online", online);
    };
  }, []);
  useEffect(() => {
    if (!ready || user) return;
    try {
      localStorage.setItem("little-progress", JSON.stringify(data));
    } catch {
      setError("Bộ nhớ trình duyệt đã đầy. Hãy xuất bản sao lưu.");
    }
  }, [data, user, ready]);
  function queue(task, { throwError = false } = {}) {
    const e = epoch.current;
    busy.current++;
    setStatus("saving");
    setError("");
    const work = chain.current
      .catch(() => {})
      .then(async () => {
        try {
          if (e !== epoch.current)
            throw new Error("Tài khoản đã thay đổi. Vui lòng thử lại.");
          if (!hydrated.current)
            throw new Error(
              "Chưa tải được tiến độ tài khoản. Hãy bấm Lấy tiến độ mới nhất trước khi lưu.",
            );
          const payload = await task();
          if (e === epoch.current) {
            apply(payload);
            setStatus("saved");
          }
          return payload;
        } catch (err) {
          if (e === epoch.current) {
            setStatus("error");
            setError(err.message);
          }
          if (throwError) throw err;
          return null;
        } finally {
          busy.current--;
        }
      });
    chain.current = work.catch(() => {});
    return work;
  }
  function setData(update) {
    const next =
      typeof update === "function" ? update(current.current) : update;
    if (!identity.current) {
      current.current = next;
      commit(next);
      return Promise.resolve(next);
    }
    const ops = commands(current.current, next);
    if (!ops.length) return Promise.resolve(null);
    return queue(() =>
      api("/me/commands", { method: "POST", body: { commands: ops } }),
    );
  }
  async function authenticate(mode, form) {
    if (busy.current) await chain.current;
    const p = await api(`/auth/${mode}`, { method: "POST", body: form });
    epoch.current++;
    hydrated.current = false;
    current.current = initialState();
    commit(current.current);
    identity.current = p.user;
    setUser(p.user);
    setCsrf(p.csrf);
    version.current = 0;
    try {
      const progress = await api("/me/progress");
      apply(progress);
      setStatus("saved");
      setError("");
    } catch (err) {
      setStatus("error");
      setError(
        "Đã đăng nhập nhưng chưa tải được tiến độ. Hãy bấm Lấy tiến độ mới nhất.",
      );
    }
    return p;
  }
  async function logout() {
    await chain.current;
    try {
      await api("/auth/logout", { method: "POST", body: {} });
    } catch (err) {
      if (err.status !== 401) throw err;
    }
    returnToGuest();
  }
  function returnToGuest() {
    epoch.current++;
    hydrated.current = false;
    identity.current = null;
    setUser(null);
    setCsrf("");
    version.current = 0;
    setRevision(0);
    const guest = loadProgress();
    current.current = guest;
    commit(guest);
    setStatus("guest");
    setError("");
  }
  async function deleteAccount(password) {
    await chain.current;
    await api("/auth/account", { method: "DELETE", body: { password } });
    returnToGuest();
  }
  async function submitAttempt(id, result) {
    if (!identity.current) {
      const next = recordAttempt(current.current, id, result);
      current.current = next;
      commit(next);
      return { correct: result.correct && !result.hinted };
    }
    const p = await queue(
      () =>
        api("/me/attempts", {
          method: "POST",
          body: {
            phraseId: id,
            answer: result.answer,
            mode: result.mode,
            hinted: result.hinted,
            key: result.key,
          },
        }),
      { throwError: true },
    );
    return p.result;
  }
  async function submitScenario(scenarioId, answers, scenario, key) {
    if (!identity.current) {
      const correct = scenario.steps.filter(
        (s, i) => s.answer === answers[i],
      ).length;
      setData((d) => ({
        ...d,
        scenarios: {
          ...d.scenarios,
          [scenarioId]: { correct, total: answers.length, date: dayKey() },
        },
      }));
      return { correct, total: answers.length };
    }
    const p = await queue(
      () =>
        api(`/me/scenarios/${scenarioId}`, {
          method: "POST",
          body: { answers, key },
        }),
      { throwError: true },
    );
    return p.result;
  }
  async function importProgress(progress) {
    if (!identity.current) {
      setData(normalizeProgress(progress));
      return;
    }
    await queue(
      () =>
        api("/me/import", {
          method: "POST",
          body: { confirm: true, progress },
        }),
      { throwError: true },
    );
  }
  async function resetProgress() {
    if (!identity.current) {
      setData(initialState());
      return;
    }
    await queue(
      () => api("/me/progress", { method: "DELETE", body: { confirm: true } }),
      { throwError: true },
    );
  }
  return (
    <Context.Provider
      value={{
        data,
        setData,
        user,
        ready,
        status,
        error,
        revision,
        authenticate,
        logout,
        deleteAccount,
        submitAttempt,
        submitScenario,
        importProgress,
        resetProgress,
        refresh,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useLearner = () => useContext(Context);
