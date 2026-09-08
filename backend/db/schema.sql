CREATE TABLE IF NOT EXISTS schema_migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS users (
 id text PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL,
 role text NOT NULL DEFAULT 'learner' CHECK (role IN ('learner','admin')),
 auth_provider text NOT NULL DEFAULT 'password', provider_subject text,
 recovery_hash text, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider text NOT NULL DEFAULT 'password';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_subject text;
CREATE UNIQUE INDEX IF NOT EXISTS users_provider_subject_idx ON users(auth_provider,provider_subject) WHERE provider_subject IS NOT NULL;
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS learner_settings (
 user_id text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 profile jsonb NOT NULL, goal smallint NOT NULL DEFAULT 5 CHECK(goal IN (5,10,15)),
 audio jsonb NOT NULL, timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh', revision bigint NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS topics (id text PRIMARY KEY, position integer NOT NULL, content jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS phrases (
 id text PRIMARY KEY, topic_id text NOT NULL REFERENCES topics(id), position integer NOT NULL,
 content jsonb NOT NULL, revision integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS phrases_topic_idx ON phrases(topic_id,position);
CREATE TABLE IF NOT EXISTS scenarios (id text PRIMARY KEY, position integer NOT NULL, content jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS phrase_progress (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 phrase_id text NOT NULL REFERENCES phrases(id), first_seen date NOT NULL, due_day date NOT NULL,
 level smallint NOT NULL DEFAULT 0 CHECK(level BETWEEN 0 AND 5), verified boolean NOT NULL DEFAULT false,
 correct_count integer NOT NULL DEFAULT 0, wrong_count integer NOT NULL DEFAULT 0, last_passed date,
 PRIMARY KEY(user_id,phrase_id)
);
CREATE INDEX IF NOT EXISTS progress_due_idx ON phrase_progress(user_id,due_day);
CREATE TABLE IF NOT EXISTS attempts (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, event_key text NOT NULL,
 phrase_id text NOT NULL REFERENCES phrases(id), mode text NOT NULL CHECK(mode IN ('recall','listen','choice')),
 answer text NOT NULL, correct boolean NOT NULL, hinted boolean NOT NULL, day date NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,event_key)
);
CREATE INDEX IF NOT EXISTS attempts_user_time_idx ON attempts(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS daily_activity (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, day date NOT NULL, phrase_id text NOT NULL REFERENCES phrases(id),
 PRIMARY KEY(user_id,day,phrase_id)
);
CREATE TABLE IF NOT EXISTS bookmarks (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, phrase_id text NOT NULL REFERENCES phrases(id),
 PRIMARY KEY(user_id,phrase_id)
);
CREATE TABLE IF NOT EXISTS personal_notes (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, phrase_id text NOT NULL REFERENCES phrases(id),
 note text NOT NULL CHECK(length(note)<=2000), PRIMARY KEY(user_id,phrase_id)
);
CREATE TABLE IF NOT EXISTS scenario_attempts (
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, event_key text NOT NULL,
 scenario_id text NOT NULL REFERENCES scenarios(id), answers jsonb NOT NULL, correct integer NOT NULL,
 total integer NOT NULL, day date NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,event_key)
);
CREATE INDEX IF NOT EXISTS scenario_user_time_idx ON scenario_attempts(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS audit_log (
 id text PRIMARY KEY, actor_id text REFERENCES users(id) ON DELETE SET NULL,
 action text NOT NULL, target_id text, created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO schema_migrations(version) VALUES(1) ON CONFLICT DO NOTHING;
