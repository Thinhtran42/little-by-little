import React, { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="error-fallback">
          <h1>Ứng dụng cần tải lại một chút.</h1>
          <p>
            Dữ liệu học đã lưu vẫn nằm trên trình duyệt. Hãy thử tải lại trang;
            nếu lỗi tiếp tục, xuất dữ liệu bên dưới để giữ bản sao.
          </p>
          <div className="study-buttons">
            <button className="primary" onClick={() => location.reload()}>
              Tải lại
            </button>
            <button
              className="subtle-button"
              onClick={() => {
                const a = document.createElement("a"),
                  url = URL.createObjectURL(
                    new Blob(
                      [localStorage.getItem("little-progress") || "{}"],
                      { type: "application/json" },
                    ),
                  );
                a.href = url;
                a.download = "little-progress-recovery.json";
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Xuất dữ liệu dự phòng
            </button>
          </div>
        </main>
      );
    return this.props.children;
  }
}
