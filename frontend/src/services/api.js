let csrf = "";
export const setCsrf = (value) => {
  csrf = value || "";
};
export async function api(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    signal: signal || AbortSignal.timeout(15000),
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(method !== "GET" && csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json"))
    throw new Error(
      "API chưa chạy hoặc proxy chưa đúng. Khởi động lại bằng npm run dev.",
    );
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(
      payload.error?.message || "Không thể kết nối máy chủ.",
    );
    error.status = response.status;
    error.code = payload.error?.code;
    throw error;
  }
  return payload;
}
