export function fail(statusCode, message, code = "REQUEST_FAILED") {
  const e = new Error(message);
  e.statusCode = statusCode;
  e.code = code;
  throw e;
}
export function text(value, name, { min = 1, max = 2000 } = {}) {
  if (typeof value !== "string" || value.length < min || value.length > max)
    fail(400, `${name} không hợp lệ.`, "VALIDATION");
  return value;
}
export function email(value) {
  return text(value, "Email", { max: 254 }).trim().toLowerCase();
}
export function validateEmail(value) {
  const v = email(value);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    fail(400, "Địa chỉ email không hợp lệ.", "VALIDATION");
  return v;
}
