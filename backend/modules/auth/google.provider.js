import { OAuth2Client } from "google-auth-library";

/** External identity provider adapter. Inject a replacement when testing OAuth. */
export function createGoogleProvider(config, { fetchImpl = fetch } = {}) {
  const { clientId, clientSecret, redirectUri } = config;
  const client = clientId ? new OAuth2Client(clientId) : null;
  return {
    enabled: Boolean(client && clientSecret),
    authorizationUrl(state) {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    },
    async verifyCode(code) {
      const response = await fetchImpl("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
      if (!response.ok) throw new Error("Google token exchange failed");
      const tokens = await response.json();
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId,
      });
      const profile = ticket.getPayload();
      if (!profile?.sub || !profile.email || profile.email_verified !== true)
        throw new Error("Google account email is not verified");
      return profile;
    },
  };
}
