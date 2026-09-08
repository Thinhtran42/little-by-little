import {
  scrypt as scryptCallback,
  randomBytes,
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback),
  options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export const hashToken = (value) =>
  createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex"),
    key = await scrypt(password, salt, 64, options);
  return `scrypt:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  const [, salt, hex] = encoded.split(":");
  const key = await scrypt(password, salt, 64, options),
    expected = Buffer.from(hex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}
export const csrfFor = (raw) => hashToken(`${raw}:csrf`);
export const safeUser = (row) => ({
  id: row.id,
  email: row.email,
  role: row.role,
});
