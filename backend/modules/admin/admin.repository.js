// Accept the active transaction connection for atomic multi-step operations.
export function lockPhrase(connection, { phraseId }) {
  return connection.query(
    "SELECT content,revision FROM phrases WHERE id=$1 FOR UPDATE",
    [phraseId],
  );
}
export function updatePhrase(connection, { phraseId, content }) {
  return connection.query(
    "UPDATE phrases SET content=$2,revision=revision+1,updated_at=now() WHERE id=$1",
    [phraseId, content],
  );
}
export function insertAudit(connection, { id, actorId, action, targetId }) {
  return connection.query(
    "INSERT INTO audit_log(id,actor_id,action,target_id) VALUES($1,$2,$3,$4)",
    [id, actorId, action, targetId],
  );
}
