-- Run this in Supabase Dashboard > SQL Editor
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  std_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  stud_age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  parent_no TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a registration form
CREATE POLICY "allow_anon_insert" ON students
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anyone to view student records (admin view)
CREATE POLICY "allow_anon_select" ON students
  FOR SELECT TO anon USING (true);
