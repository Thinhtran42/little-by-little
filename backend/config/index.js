/** Read runtime configuration once at the composition boundary; never log it. */
export function readConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const publicOrigin = env.PUBLIC_ORIGIN || env.RENDER_EXTERNAL_URL;
  return {
    production,
    publicOrigin,
    port: Number(env.PORT || 3001),
    host: env.HOST || "127.0.0.1",
    trustProxy: env.TRUST_PROXY === "true",
    serveFrontend: production || env.SERVE_FRONTEND === "true",
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      redirectUri:
        env.GOOGLE_REDIRECT_URI ||
        `${publicOrigin || "http://localhost:3001"}/api/auth/google/callback`,
    },
  };
}
