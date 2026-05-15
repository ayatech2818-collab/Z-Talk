-- Run this in Supabase Dashboard > SQL Editor
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow server-side (anon key) to verify credentials
CREATE POLICY "allow_anon_select_admins" ON admins
  FOR SELECT TO anon USING (true);

-- Seed default admin: username=admin  password=admin123
-- Change this after first login!
INSERT INTO admins (username, password_hash)
VALUES (
  'admin',
  encode(digest('admin123', 'sha256'), 'hex')
)
ON CONFLICT (username) DO NOTHING;
