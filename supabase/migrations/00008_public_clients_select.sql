-- Allow anonymous users to read clients (needed for upsert + select)
CREATE POLICY "Anyone can read clients"
  ON clients FOR SELECT
  USING (true);
