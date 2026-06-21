CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  duration    INTEGER NOT NULL CHECK (duration >= 15),
  price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_business ON services(business_id, is_active);
