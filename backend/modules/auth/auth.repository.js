// Accept the active transaction connection for atomic multi-step operations.
export function findSessionUser(connection, { tokenHash }) {
  return connection.query(
    "SELECT u.id,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",
    [tokenHash],
  );
}
export function insertSession(connection, { tokenHash, userId, expiresAt }) {
  return connection.query(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
    [tokenHash, userId, expiresAt],
  );
}
export function insertPasswordUser(
  connection,
  { id, email, passwordHash, recoveryHash },
) {
  return connection.query(
    "INSERT INTO users(id,email,password_hash,recovery_hash) VALUES($1,$2,$3,$4)",
    [id, email, passwordHash, recoveryHash],
  );
}
export function insertSettings(connection, { userId, profile, audio }) {
  return connection.query(
    "INSERT INTO learner_settings(user_id,profile,audio) VALUES($1,$2,$3)",
    [userId, profile, audio],
  );
}
export function findByEmail(connection, { email }) {
  return connection.query("SELECT * FROM users WHERE email=$1", [email]);
}
export function deleteSession(connection, { tokenHash }) {
  return connection.query("DELETE FROM sessions WHERE token_hash=$1", [
    tokenHash,
  ]);
}
export function lockRecoveryUser(connection, { email, recoveryHash }) {
  return connection.query(
    "SELECT * FROM users WHERE email=$1 AND recovery_hash=$2 FOR UPDATE",
    [email, recoveryHash],
  );
}
export function replaceRecoveryPassword(
  connection,
  { userId, passwordHash, recoveryHash },
) {
  return connection.query(
    "UPDATE users SET password_hash=$2,recovery_hash=$3 WHERE id=$1",
    [userId, passwordHash, recoveryHash],
  );
}
export function deleteUserSessions(connection, { userId }) {
  return connection.query("DELETE FROM sessions WHERE user_id=$1", [userId]);
}
export function insertAudit(connection, { id, actorId, action }) {
  return connection.query(
    "INSERT INTO audit_log(id,actor_id,action) VALUES($1,$2,$3)",
    [id, actorId, action],
  );
}
export function findPassword(connection, { userId }) {
  return connection.query("SELECT password_hash FROM users WHERE id=$1", [
    userId,
  ]);
}
export function updatePassword(connection, { userId, passwordHash }) {
  return connection.query("UPDATE users SET password_hash=$2 WHERE id=$1", [
    userId,
    passwordHash,
  ]);
}
export function deleteOtherSessions(connection, { userId, tokenHash }) {
  return connection.query(
    "DELETE FROM sessions WHERE user_id=$1 AND token_hash<>$2",
    [userId, tokenHash],
  );
}
export function deleteUser(connection, { userId }) {
  return connection.query("DELETE FROM users WHERE id=$1", [userId]);
}
export function findGoogleIdentity(connection, { subject }) {
  return connection.query(
    "SELECT * FROM users WHERE auth_provider='google' AND provider_subject=$1",
    [subject],
  );
}
export function insertGoogleUser(
  connection,
  { id, email, passwordHash, subject },
) {
  return connection.query(
    "INSERT INTO users(id,email,password_hash,auth_provider,provider_subject) VALUES($1,$2,$3,'google',$4) RETURNING *",
    [id, email, passwordHash, subject],
  );
}
export function linkGoogleIdentity(connection, { userId, subject }) {
  return connection.query(
    "UPDATE users SET auth_provider='google',provider_subject=COALESCE(provider_subject,$2) WHERE id=$1",
    [userId, subject],
  );
}
