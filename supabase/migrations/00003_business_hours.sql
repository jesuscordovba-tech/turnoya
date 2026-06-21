CREATE TABLE business_hours (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_closed   BOOLEAN NOT NULL DEFAULT false,
  open_time   TIME NOT NULL,
  close_time  TIME NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_hours_business ON business_hours(business_id);
