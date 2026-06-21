CREATE TYPE appointment_status AS ENUM (
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
);

CREATE TABLE appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id        UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  start_time        TIMESTAMPTZ NOT NULL,
  end_time          TIMESTAMPTZ NOT NULL,
  status            appointment_status NOT NULL DEFAULT 'confirmed',
  client_name       TEXT NOT NULL,
  client_phone      TEXT NOT NULL,
  client_email      TEXT,
  notes             TEXT,
  cancellation_reason TEXT,
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_times CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_business_date
  ON appointments(business_id, start_time);

CREATE INDEX idx_appointments_client
  ON appointments(client_id);

CREATE INDEX idx_appointments_status
  ON appointments(business_id, status);
