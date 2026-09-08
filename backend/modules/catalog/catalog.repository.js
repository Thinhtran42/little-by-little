// Accept the active transaction connection for atomic multi-step operations.
export function listTopics(connection) {
  return connection.query("SELECT content FROM topics ORDER BY position");
}
export function listPhrases(connection) {
  return connection.query(
    "SELECT content,revision FROM phrases ORDER BY position",
  );
}
export function listScenarios(connection) {
  return connection.query("SELECT content FROM scenarios ORDER BY position");
}
