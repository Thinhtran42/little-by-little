import React, { useState } from "react";
import {
  Cloud,
  LogIn,
  LogOut,
  ShieldCheck,
  KeyRound,
  Download,
  RefreshCw,
} from "lucide-react";
import { useLearner } from "../state/LearnerContext.jsx";
import { useCatalog } from "../state/CatalogContext.jsx";
import { api } from "../services/api.js";
import { loadProgress } from "../progress.js";
export function SyncBanner({ openAccount }) {
  const { user, status, error, revision } = useLearner();
  return (
    <div className={`sync-banner ${status === "error" ? "sync-error" : ""}`}>
      <Cloud size={17} />
      <span>
        {user
          ? status === "saving"
            ? "Đang lưu lên tài khoản…"
            : status === "error"
              ? `Chưa lưu: ${error}`
              : `Tiến độ của ${user.email} · đã lưu trên máy chủ`
          : "Đang dùng thử trên thiết bị. Đăng nhập để lưu và đồng bộ tiến độ."}
      </span>
      <button className="text-button" onClick={openAccount}>
        {user ? "Tài khoản" : "Đăng nhập / Đăng ký"}
      </button>
    </div>
  );
}
export default function CloudAccount() {
  const { user, status, error, authenticate, logout, importProgress, refresh } =
      useLearner(),
    [mode, setMode] = useState("login"),
    [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      recoveryCode: "",
    }),
    [pending, setPending] = useState(false),
    [message, setMessage] = useState(""),
    [recovery, setRecovery] = useState(""),
    [confirmImport, setConfirmImport] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    try {
      if (mode === "recover") {
        const p = await api("/auth/recover", { method: "POST", body: form });
        setRecovery(p.recoveryCode);
        setMessage("Đã đặt lại mật khẩu. Hãy lưu mã mới rồi đăng nhập.");
        setMode("login");
      } else {
        const p = await authenticate(mode, form);
        setRecovery(p.recoveryCode || "");
        setForm({ name: "", email: "", password: "", recoveryCode: "" });
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setPending(false);
    }
  }
  function downloadCode() {
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob(
          [
            `Little by little recovery code\n${recovery}\nGiữ kín mã này. Mã cho phép đặt lại mật khẩu và chỉ dùng một lần.\n`,
          ],
          { type: "text/plain" },
        ),
      );
    a.href = url;
    a.download = "little-english-recovery-code.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="cloud-account account-card">
      <span className="modal-emblem">
        <Cloud size={28} />
      </span>
      <h2>
        {user ? "Tài khoản & đồng bộ" : "Hành trình theo bạn đến mọi thiết bị."}
      </h2>
      <p>
        {user
          ? `${user.email} · ${user.role === "admin" ? "Biên tập viên" : "Người học"}`
          : "Bài làm, lịch ôn, câu đã lưu và ghi chú được lưu riêng trong tài khoản."}
      </p>
      {!user && (
        <>
          <div className="exercise-tabs">
            {[
              ["login", "Đăng nhập"],
              ["register", "Tạo tài khoản"],
              ["recover", "Khôi phục"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={mode === id ? "active" : ""}
                onClick={() => {
                  setMode(id);
                  setMessage("");
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={submit}>
            {mode === "register" && (
              <>
                <label className="field-label" htmlFor="account-name">
                  Tên hiển thị
                </label>
                <input
                  id="account-name"
                  className="text-field"
                  maxLength={40}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                />
              </>
            )}
            <label className="field-label" htmlFor="account-email">
              Email
            </label>
            <input
              id="account-email"
              className="text-field"
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            {mode === "recover" && (
              <>
                <label className="field-label" htmlFor="recovery-code">
                  Mã khôi phục đã lưu
                </label>
                <input
                  id="recovery-code"
                  className="text-field"
                  required
                  value={form.recoveryCode}
                  onChange={(e) =>
                    setForm({ ...form, recoveryCode: e.target.value })
                  }
                />
              </>
            )}
            <label className="field-label" htmlFor="account-password">
              {mode === "recover" ? "Mật khẩu mới" : "Mật khẩu"}
              {mode !== "login" ? " · ít nhất 12 ký tự" : ""}
            </label>
            <input
              id="account-password"
              className="text-field"
              required
              type="password"
              minLength={mode === "login" ? 1 : 12}
              maxLength={128}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="primary wide onboarding-finish"
              disabled={pending}
            >
              {pending
                ? "Đang xử lý…"
                : mode === "register"
                  ? "Tạo tài khoản của tôi"
                  : mode === "recover"
                    ? "Đặt lại mật khẩu"
                    : "Đăng nhập"}
              <LogIn size={16} />
            </button>
          </form>
          <p className="account-help">
            Email hiện dùng làm tên đăng nhập, chưa có xác minh qua email. Khi
            đăng ký, hãy giữ mã khôi phục để tự đặt lại mật khẩu.
          </p>
        </>
      )}
      {user && (
        <>
          <div className="backup-actions">
            <button
              className="subtle-button"
              onClick={async () => {
                setPending(true);
                try {
                  await logout();
                  setRecovery("");
                } catch (e) {
                  setMessage(e.message);
                } finally {
                  setPending(false);
                }
              }}
              disabled={pending || status === "saving"}
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
            <button className="subtle-button" onClick={refresh}>
              <RefreshCw size={16} />
              Lấy tiến độ mới nhất
            </button>
            <button className="primary" onClick={() => setConfirmImport(true)}>
              Chuyển tiến độ cũ trên thiết bị
            </button>
          </div>
          {confirmImport && (
            <div className="hint-box">
              <p>
                Chuyển {Object.keys(loadProgress().learned).length} câu đã xem
                từ chế độ dùng thử và thay thế tiến độ hiện tại của tài khoản?
                Mức nhớ sẽ được kiểm tra lại trên máy chủ.
              </p>
              <button
                className="subtle-button"
                onClick={() => setConfirmImport(false)}
              >
                Hủy
              </button>
              <button
                className="primary"
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  try {
                    await importProgress(loadProgress());
                    setConfirmImport(false);
                    setMessage(
                      "Đã chuyển tiến độ. Câu cũ được đưa vào lịch kiểm tra lại.",
                    );
                  } catch (e) {
                    setMessage(e.message);
                  } finally {
                    setPending(false);
                  }
                }}
              >
                Xác nhận chuyển
              </button>
            </div>
          )}
        </>
      )}
      {recovery && (
        <div className="recovery-box">
          <KeyRound size={20} />
          <strong>Lưu mã khôi phục ngay bây giờ</strong>
          <p>
            Mã chỉ hiện sau khi tạo/khôi phục tài khoản. Giữ kín như mật khẩu.
          </p>
          <code>{recovery}</code>
          <button className="subtle-button" onClick={downloadCode}>
            <Download size={16} />
            Tải mã khôi phục
          </button>
          <button className="text-button" onClick={() => setRecovery("")}>
            Tôi đã lưu mã
          </button>
        </div>
      )}
      {(message || error) && (
        <p role="status" className="account-message">
          {message || error}
        </p>
      )}
      {user?.role === "admin" && <ContentEditor />}
      {user && <AccountSecurity />}
    </section>
  );
}
function AccountSecurity() {
  const { deleteAccount } = useLearner();
  const [currentPassword, setCurrent] = useState(""),
    [newPassword, setNew] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <details className="content-editor">
      <summary>Bảo mật và xóa tài khoản</summary>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await api("/auth/change-password", {
              method: "POST",
              body: { currentPassword, newPassword },
            });
            setCurrent("");
            setNew("");
            setMessage("Đã đổi mật khẩu và đăng xuất các thiết bị khác.");
          } catch (err) {
            setMessage(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="field-label">
          Mật khẩu hiện tại
          <input
            className="text-field"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        <label className="field-label">
          Mật khẩu mới
          <input
            className="text-field"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
          />
        </label>
        <button className="primary" disabled={busy}>
          Đổi mật khẩu
        </button>
      </form>
      <p>
        Xóa tài khoản sẽ xóa vĩnh viễn bài làm, ghi chú và tiến độ trên máy chủ.
        Bạn có thể xuất bản sao lưu ở bên dưới trước khi xóa.
      </p>
      <label className="field-label">
        Gõ XÓA TÀI KHOẢN để xác nhận
        <input
          className="text-field"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      <button
        className="danger-button"
        disabled={busy || confirm !== "XÓA TÀI KHOẢN" || !currentPassword}
        onClick={async () => {
          setBusy(true);
          try {
            await deleteAccount(currentPassword);
          } catch (err) {
            setMessage(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        Xóa tài khoản vĩnh viễn
      </button>
      <p className="account-help">
        Điền mật khẩu hiện tại ở trên để xác nhận xóa.
      </p>
      {message && <p role="status">{message}</p>}
    </details>
  );
}
function ContentEditor() {
  const { phrases, refresh } = useCatalog(),
    [id, setId] = useState(""),
    [draft, setDraft] = useState(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="content-editor">
      <h3>Biên tập nội dung</h3>
      <p>
        Sửa câu, ngữ cảnh và đáp án thay thế trên database. Thay đổi có hiệu lực
        sau khi tải lại nội dung.
      </p>
      <select
        aria-label="Chọn câu để sửa"
        className="text-field"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          const p = phrases.find((x) => x.id === e.target.value);
          setDraft(
            p
              ? { ...p, alternativesText: (p.alternatives || []).join("\n") }
              : null,
          );
        }}
      >
        <option value="">Chọn câu học…</option>
        {phrases.map((p) => (
          <option key={p.id} value={p.id}>
            {p.id} · {p.en}
          </option>
        ))}
      </select>
      {draft && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await api(`/admin/phrases/${id}`, {
                method: "PATCH",
                body: {
                  ...draft,
                  alternatives: draft.alternativesText
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              });
              await refresh();
              setDraft(null);
              setId("");
              setMessage("Đã lưu nội dung.");
            } catch (err) {
              setMessage(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {[
            ["en", "Câu tiếng Anh"],
            ["vi", "Nghĩa tiếng Việt"],
            ["note", "Ngữ cảnh / ví dụ"],
            ["alternativesText", "Đáp án thay thế · mỗi dòng một câu"],
          ].map(([field, label]) => (
            <label className="field-label" key={field}>
              {label}
              <textarea
                value={draft[field] || ""}
                onChange={(e) =>
                  setDraft({ ...draft, [field]: e.target.value })
                }
              />
            </label>
          ))}
          <button className="primary" disabled={busy}>
            Lưu thay đổi nội dung
          </button>
        </form>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
