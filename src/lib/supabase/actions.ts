"use server";

import { createHash, createHmac } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "./server";

// ── Password & session helpers ────────────────────────────────────────────────

function hashPassword(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

function makeSessionToken(username: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "ztalk-admin-secret-change-me";
  return createHmac("sha256", secret).update(username).digest("hex");
}

// ── Student registration (used by /user) ──────────────────────────────────────

export async function registerStudent(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const data = {
    std_name: formData.get("std_name") as string,
    parent_name: formData.get("parent_name") as string,
    stud_age: Number(formData.get("stud_age")),
    gender: formData.get("gender") as string,
    parent_no: formData.get("parent_no") as string,
  };

  const { error } = await supabase.from("students").insert(data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/user");
  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Secret form (used by /user) ──────────────────────────────────────────────
// Student Name + Phone → checked against admins table first.
// Match   → session cookie + redirect to /admin.
// No match + only those two fields filled → credential error (admin intent).
// No match + student fields present → student registration path.

export async function secretFormAction(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const std_name    = (formData.get("std_name")    as string)?.trim();
  const parent_no   = (formData.get("parent_no")   as string)?.trim();
  const parent_name = (formData.get("parent_name") as string)?.trim();
  const stud_age_raw = (formData.get("stud_age")   as string)?.trim();
  const gender      = (formData.get("gender")      as string)?.trim();

  if (!std_name || !parent_no) {
    return { success: false, error: "Student name and phone number are required." };
  }

  // ── Step 1: admin credential check ────────────────────────────────────────
  const { data: adminMatch, error: adminError } = await supabase
    .from("admins")
    .select("username")
    .eq("username", std_name)
    .eq("password_hash", hashPassword(parent_no))
    .maybeSingle();

  if (adminError) {
    console.error("[Z-Talk] Admin auth error:", adminError.message);
    return { success: false, error: `Admin table error: ${adminError.message}` };
  }

  if (adminMatch) {
    const cookieStore = await cookies();
    const token = makeSessionToken(std_name);
    const opts = { httpOnly: true, path: "/", maxAge: 60 * 60 * 8 } as const;
    cookieStore.set("admin_user", std_name, opts);
    cookieStore.set("admin_token", token, opts);
    redirect("/admin");
  }

  // ── Step 2: determine intent ───────────────────────────────────────────────
  // Only name + phone filled and credentials didn't match → admin login attempt.
  // Return silently so nothing reveals a hidden login exists.
  const hasStudentFields = parent_name || stud_age_raw || gender;

  if (!hasStudentFields) {
    return { success: false, error: "Please fill in all required fields." };
  }

  // ── Step 3: student registration — validate all remaining fields ───────────
  if (!parent_name) {
    return { success: false, error: "Please enter the parent / guardian name." };
  }

  if (!gender) {
    return { success: false, error: "Please select a gender." };
  }

  if (!stud_age_raw) {
    return { success: false, error: "Please enter the student's age." };
  }
  const stud_age = Number(stud_age_raw);
  if (isNaN(stud_age) || stud_age < 1 || stud_age > 25) {
    return { success: false, error: "Please enter a valid age (1–25)." };
  }

  // Phone validation skipped when std_name is "admin" — the number field is
  // used as an admin password in that case, not a phone number.
  if (std_name !== "admin") {
    const phoneDigits = parent_no.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return { success: false, error: "Please enter a valid 10-digit phone number." };
    }
  }

  const { error } = await supabase.from("students").insert({
    std_name, parent_name, stud_age, gender, parent_no,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Admin session verification ────────────────────────────────────────────────

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const username = cookieStore.get("admin_user")?.value;
  const token = cookieStore.get("admin_token")?.value;
  if (!username || !token) return false;
  return makeSessionToken(username) === token;
}

// ── Admin logout ──────────────────────────────────────────────────────────────

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_user");
  cookieStore.delete("admin_token");
  redirect("/");
}

// ── Admin CRUD — save (create or update) a student ───────────────────────────
// If formData contains a non-empty "id" field the row is updated; otherwise a
// new row is inserted. Auth is verified before any mutation.

export async function adminSaveStudent(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  const supabase = await createClient();

  const id         = (formData.get("id")          as string)?.trim();
  const std_name   = (formData.get("std_name")    as string)?.trim();
  const parent_name = (formData.get("parent_name") as string)?.trim();
  const stud_age_raw = (formData.get("stud_age")  as string)?.trim();
  const gender     = (formData.get("gender")      as string)?.trim();
  const parent_no  = (formData.get("parent_no")   as string)?.trim();

  if (!std_name || !parent_name || !stud_age_raw || !gender || !parent_no) {
    return { success: false, error: "All fields are required." };
  }

  const stud_age = Number(stud_age_raw);
  if (isNaN(stud_age) || stud_age < 1 || stud_age > 100) {
    return { success: false, error: "Please enter a valid age (1–100)." };
  }

  const data = { std_name, parent_name, stud_age, gender, parent_no };

  const { error } = id
    ? await supabase.from("students").update(data).eq("id", id)
    : await supabase.from("students").insert(data);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Admin CRUD — deactivate a student (soft-delete) ──────────────────────────

export async function adminDeactivateStudent(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  const supabase = await createClient();

  const id = (formData.get("id") as string)?.trim();
  if (!id) return { success: false, error: "No student ID provided." };

  const { error } = await supabase
    .from("students")
    .update({ is_active: false })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Admin CRUD — bulk deactivate students (soft-delete) ──────────────────────

export async function adminDeactivateStudents(
  ids: string[]
): Promise<{ success: boolean; error: string | null }> {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  if (!ids.length) return { success: false, error: "No students selected." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ is_active: false })
    .in("id", ids);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Admin CRUD — restore a deactivated student ────────────────────────────────

export async function adminRestoreStudent(
  ids: string[]
): Promise<{ success: boolean; error: string | null }> {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  if (!ids.length) return { success: false, error: "No students selected." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ is_active: true })
    .in("id", ids);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true, error: null };
}

// ── Fetch active students (admin dashboard) ───────────────────────────────────

export async function getStudents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ── Fetch deactivated students (history view) ─────────────────────────────────

export async function getInactiveStudents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("is_active", false)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
