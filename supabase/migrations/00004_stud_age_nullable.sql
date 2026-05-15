-- Run this in Supabase Dashboard > SQL Editor
-- Makes student age optional (no longer required)
ALTER TABLE students ALTER COLUMN stud_age DROP NOT NULL;
