import React, { useEffect, useState } from "react";
import { Download, X, RefreshCw } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
export default function AppStatus() {
  const [offline, setOffline] = useState(!navigator.onLine),
    [install, setInstall] = useState(null),
    [dismissed, setDismissed] = useState(false),
    [swError, setSwError] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [ready, setReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError() {
      setSwError(true);
    },
  });
  useEffect(() => {
    const online = () => setOffline(!navigator.onLine),
      prompt = (e) => {
        e.preventDefault();
        setInstall(e);
      };
    window.addEventListener("online", online);
    window.addEventListener("offline", online);
    window.addEventListener("beforeinstallprompt", prompt);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", online);
      window.removeEventListener("beforeinstallprompt", prompt);
    };
  }, []);
  return (
    <>
      {offline && (
        <div className="offline-indicator" role="status">
          Bạn đang ngoại tuyến. Chế độ dùng thử vẫn học được; tài khoản cần mạng
          để lưu bài làm.
        </div>
      )}
      {(needRefresh || ready || swError || (install && !dismissed)) && (
        <div className="install-strip" role="status">
          <span>
            {needRefresh
              ? "Có phiên bản mới. Hoàn thành buổi học trước khi cập nhật."
              : ready
                ? "Đã tải nội dung để dùng thử ngoại tuyến."
                : swError
                  ? "Chưa bật được ngoại tuyến. Bạn vẫn học được khi có mạng."
                  : "Cài ứng dụng để mở nhanh mỗi ngày."}
          </span>
          {needRefresh ? (
            <button
              className="primary"
              onClick={() => updateServiceWorker(true)}
            >
              <RefreshCw size={15} />
              Cập nhật
            </button>
          ) : install && !ready && !swError ? (
            <button
              className="primary"
              onClick={async () => {
                await install.prompt();
                await install.userChoice;
                setInstall(null);
              }}
            >
              <Download size={15} />
              Cài đặt
            </button>
          ) : null}
          <button
            className="icon-button"
            aria-label="Đóng thông báo"
            onClick={() => {
              setNeedRefresh(false);
              setReady(false);
              setDismissed(true);
              setSwError(false);
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
