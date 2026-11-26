CREATE TABLE disk_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE INDEX disk_sessions_expiry ON disk_sessions(expires);
