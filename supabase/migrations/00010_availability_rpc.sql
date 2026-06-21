CREATE OR REPLACE FUNCTION get_busy_slots(p_business_id UUID, p_date DATE)
RETURNS TABLE(start_time TIMESTAMPTZ, end_time TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT start_time, end_time
  FROM appointments
  WHERE business_id = p_business_id
    AND start_time::date = p_date
    AND status NOT IN ('cancelled', 'no_show')
  ORDER BY start_time;
$$;
