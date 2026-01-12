-- Appointments Sync Table (SAFE VERSION)
-- Drops existing policies before recreating

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

-- ============================================
-- DROP EXISTING TRIGGERS/FUNCTIONS (if any)
-- ============================================

DROP TRIGGER IF EXISTS appointments_updated_at ON appointments;
DROP FUNCTION IF EXISTS update_appointments_updated_at();

-- ============================================
-- CREATE TABLE (IF NOT EXISTS)
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Appointment details
  type TEXT NOT NULL,
  provider_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  location TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES
-- ============================================

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CREATE INDEXES (IF NOT EXISTS)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- ============================================
-- CREATE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON appointments TO authenticated;

-- ============================================
-- DONE!
-- ============================================
