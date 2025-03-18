-- Create tables for CNAMM assessment data

-- Table to store anonymous assessment results
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_maturity NUMERIC NOT NULL,
  function_scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to store email request data
CREATE TABLE IF NOT EXISTS email_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  assessment_data JSONB NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  error_message TEXT
);

-- Create index on processed status for faster queries
CREATE INDEX IF NOT EXISTS email_requests_processed_idx ON email_requests(processed);

-- Enable Row Level Security (RLS)
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous inserts but restrict other operations
CREATE POLICY "Allow anonymous inserts on assessment_results" 
  ON assessment_results FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on email_requests" 
  ON email_requests FOR INSERT 
  WITH CHECK (true);

-- Create policies to allow service role to view and update records
CREATE POLICY "Allow service role to select from assessment_results" 
  ON assessment_results FOR SELECT 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to select from email_requests" 
  ON email_requests FOR SELECT 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to update email_requests" 
  ON email_requests FOR UPDATE 
  USING (auth.role() = 'service_role');