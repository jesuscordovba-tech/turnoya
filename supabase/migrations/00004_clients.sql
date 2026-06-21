CREATE TABLE clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  email       TEXT,
  total_visits INTEGER NOT NULL DEFAULT 0,
  last_visit  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_phone ON clients(phone);
