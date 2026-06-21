CREATE TABLE businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  phone         TEXT NOT NULL,
  email         TEXT,
  address       TEXT,
  logo_url      TEXT,
  cover_url     TEXT,
  timezone      TEXT NOT NULL DEFAULT 'America/Panama',
  slot_interval INTEGER NOT NULL DEFAULT 30,
  padding_before INTEGER NOT NULL DEFAULT 5,
  padding_after  INTEGER NOT NULL DEFAULT 5,
  max_advance_days INTEGER NOT NULL DEFAULT 30,
  allow_same_day   BOOLEAN NOT NULL DEFAULT true,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
