ALTER TABLE appointments ALTER COLUMN status SET DEFAULT 'pending';
UPDATE appointments SET status = 'pending' WHERE status = 'confirmed';
