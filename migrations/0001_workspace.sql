CREATE TABLE disk_workspace (
  owner_id TEXT NOT NULL,
  space TEXT NOT NULL,
  revision INTEGER NOT NULL,
  write_token TEXT NOT NULL,
  PRIMARY KEY (owner_id, space)
);
--> statement-breakpoint
CREATE TABLE disk_workspace_part (
  owner_id TEXT NOT NULL,
  space TEXT NOT NULL,
  revision INTEGER NOT NULL,
  part INTEGER NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (owner_id, space, revision, part)
);
