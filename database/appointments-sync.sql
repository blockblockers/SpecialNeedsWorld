-- Appointments Sync Table
-- This syncs scheduling/organizational data (not health diagnoses)

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Appointment details (organizational, not diagnostic)
  type TEXT NOT NULL, -- 'therapy', 'doctor', 'school', 'evaluation', 'specialist', 'other'
  provider_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  location TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users can only access their own appointments
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

-- Index for faster queries
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Updated_at trigger
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

-- Grant permissions
GRANT ALL ON appointments TO authenticated;
