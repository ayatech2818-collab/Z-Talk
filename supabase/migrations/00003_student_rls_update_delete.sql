-- Run this in Supabase Dashboard > SQL Editor
-- Allows the anon role (used by all app requests) to update and delete student records.
-- Admin-level authorization is enforced by the cookie-based session check in server actions.

CREATE POLICY "allow_anon_update_students" ON students
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "allow_anon_delete_students" ON students
  FOR DELETE TO anon USING (true);
