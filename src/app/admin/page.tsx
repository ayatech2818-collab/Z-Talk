import { redirect } from "next/navigation";
import { checkAdminAuth, getStudents, getInactiveStudents } from "@/lib/supabase/actions";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export type Student = {
  id: string;
  std_name: string;
  parent_name: string;
  stud_age: number;
  gender: string;
  parent_no: string;
  created_at: string;
  is_active: boolean;
};

export default async function AdminPage() {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) redirect("/");

  const [{ data: students, error }, { data: inactiveStudents }] =
    await Promise.all([getStudents(), getInactiveStudents()]);

  return (
    <AdminClient
      students={(students as Student[]) ?? []}
      inactiveStudents={(inactiveStudents as Student[]) ?? []}
      fetchError={error}
    />
  );
}
