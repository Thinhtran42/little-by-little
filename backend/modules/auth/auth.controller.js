import { createGoogleProvider } from "./google.provider.js";
import { token, hashToken, csrfFor } from "../../common/security.js";
export function createAuthController({
  service,
  production,
  config,
  provider,
}) {
  const google = provider || createGoogleProvider(config.google);
  function cookie(reply, raw) {
    reply.setCookie("little_session", raw, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      maxAge: 7 * 86400,
    });
  }
  function oauthCookie(reply, raw) {
    reply.setCookie("google_oauth_state", raw, {
      path: "/api/auth/google",
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      maxAge: 600,
    });
  }
  function clearOauthCookie(reply) {
    reply.clearCookie("google_oauth_state", { path: "/api/auth/google" });
  }
  async function googleStart(req, reply) {
    if (!google.enabled) {
      return reply.redirect("/?auth_error=google_not_configured");
    }
    const state = token();
    oauthCookie(reply, state);
    return reply.redirect(google.authorizationUrl(state));
  }
  async function googleCallback(req, reply) {
    const state = String(req.query?.state || ""),
      expected = String(req.cookies.google_oauth_state || "");
    clearOauthCookie(reply);
    if (
      !google.enabled ||
      !state ||
      !expected ||
      hashToken(state) !== hashToken(expected)
    )
      return reply.redirect("/?auth_error=google_state");
    try {
      const code = String(req.query?.code || "");
      if (!code) return reply.redirect("/?auth_error=google_cancelled");
      const profile = await google.verifyCode(code);
      const raw = await service.loginGoogle(profile);
      cookie(reply, raw);
      return reply.redirect("/?auth=google_success");
    } catch (error) {
      req.log.warn({ err: error }, "google_auth_failed");
      return reply.redirect("/?auth_error=google_failed");
    }
  }
  async function register(req, reply) {
    const { sessionToken, ...result } = await service.register({
      input: req.body,
    });
    cookie(reply, sessionToken);
    return reply.code(201).send(result);
  }
  async function login(req, reply) {
    const { sessionToken, ...result } = await service.login({
      input: req.body,
    });
    cookie(reply, sessionToken);
    return result;
  }
  function me(req) {
    return req.user
      ? { user: req.user, csrf: csrfFor(req.cookies.little_session) }
      : { user: null };
  }
  async function logout(req, reply) {
    const result = await service.logout({
      input: req.body,
      actor: req.user,
      sessionToken: req.cookies.little_session,
    });
    reply.clearCookie("little_session", { path: "/" });
    return result;
  }
  async function recover(req, reply) {
    const result = await service.recover({
      input: req.body,
      actor: req.user,
      sessionToken: req.cookies.little_session,
    });
    reply.clearCookie("little_session", { path: "/" });
    return result;
  }
  async function deleteAccount(req, reply) {
    const result = await service.deleteAccount({
      input: req.body,
      actor: req.user,
      sessionToken: req.cookies.little_session,
    });
    reply.clearCookie("little_session", { path: "/" });
    return result;
  }
  async function changePassword(req) {
    return service.changePassword({
      input: req.body,
      actor: req.user,
      sessionToken: req.cookies.little_session,
    });
  }
  return {
    googleStart,
    googleCallback,
    register,
    login,
    me,
    logout,
    recover,
    changePassword,
    deleteAccount,
  };
}
