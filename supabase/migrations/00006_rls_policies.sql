-- Businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can CRUD their business"
  ON businesses FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Public can view active businesses"
  ON businesses FOR SELECT
  USING (is_active = true);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their services"
  ON services FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Public view active services"
  ON services FOR SELECT
  USING (
    business_id IN (SELECT id FROM businesses WHERE is_active = true)
    AND is_active = true
  );

-- Business Hours
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage hours"
  ON business_hours FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Public view hours"
  ON business_hours FOR SELECT
  USING (business_id IN (SELECT id FROM businesses WHERE is_active = true));

-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clients"
  ON clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can read clients from their appointments"
  ON clients FOR SELECT
  USING (
    id IN (
      SELECT client_id FROM appointments
      WHERE business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
      )
    )
  );

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their appointments"
  ON appointments FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = business_id AND is_active = true
    )
  );
