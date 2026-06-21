-- Prevent double-booking by ensuring no two appointments
-- overlap for the same business at the same time.

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
  ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    business_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'no_show'));
