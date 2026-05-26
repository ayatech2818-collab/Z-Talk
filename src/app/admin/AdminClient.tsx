"use client";

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  adminSaveStudent,
  adminDeactivateStudent,
  adminDeactivateStudents,
  adminRestoreStudent,
  adminLogout,
  adminMarkWhatsAppSent,
} from "@/lib/supabase/actions";
import type { Student } from "./page";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "91" + digits.slice(1);
  if (!digits.startsWith("91")) return "91" + digits;
  return digits;
}

function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`;
}

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { type: null }
  | { type: "add" }
  | { type: "edit"; student: Student }
  | { type: "deactivate"; student: Student };

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconRestore() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────

function StudentModal({
  initial,
  onClose,
  onSuccess,
}: {
  initial?: Student;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [state, action, pending] = useActionState(adminSaveStudent, {
    success: false,
    error: null,
  });

  const [fields, setFields] = useState({
    std_name: initial?.std_name ?? "",
    parent_name: initial?.parent_name ?? "",
    stud_age: initial?.stud_age?.toString() ?? "",
    gender: initial?.gender ?? "",
    parent_no: initial?.parent_no ?? "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    };

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!fields.std_name.trim()) errors.std_name = "Student name is required.";
    if (!fields.parent_name.trim()) errors.parent_name = "Parent name is required.";
    if (!fields.stud_age) {
      errors.stud_age = "Age is required.";
    } else {
      const age = Number(fields.stud_age);
      if (isNaN(age) || age < 1 || age > 100) errors.stud_age = "Enter a valid age (1–100).";
    }
    if (!fields.gender) errors.gender = "Please select a gender.";
    if (!fields.parent_no.trim()) {
      errors.parent_no = "Phone number is required.";
    } else if (fields.parent_no.replace(/\D/g, "").length !== 10) {
      errors.parent_no = "Enter a valid 10-digit number.";
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFieldErrors(errors);
    }
  };

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          {initial ? "Edit Student" : "Add Student"}
        </h2>
        <form action={action} onSubmit={handleSubmit} className="space-y-3">
          {initial && <input type="hidden" name="id" value={initial.id} />}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Student Name</label>
            <input
              name="std_name"
              value={fields.std_name}
              onChange={set("std_name")}
              placeholder="Enter student name"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.std_name ? "border-red-400" : "border-gray-300"}`}
            />
            {fieldErrors.std_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.std_name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Parent / Guardian Name</label>
            <input
              name="parent_name"
              value={fields.parent_name}
              onChange={set("parent_name")}
              placeholder="Enter parent name"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.parent_name ? "border-red-400" : "border-gray-300"}`}
            />
            {fieldErrors.parent_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.parent_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Age</label>
              <input
                name="stud_age"
                type="number"
                min={1}
                max={100}
                value={fields.stud_age}
                onChange={set("stud_age")}
                placeholder="Age"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.stud_age ? "border-red-400" : "border-gray-300"}`}
              />
              {fieldErrors.stud_age && <p className="mt-1 text-xs text-red-500">{fieldErrors.stud_age}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={fields.gender}
                onChange={set("gender")}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.gender ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {fieldErrors.gender && <p className="mt-1 text-xs text-red-500">{fieldErrors.gender}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Parent WhatsApp Number</label>
            <input
              name="parent_no"
              type="text"
              inputMode="text"
              value={fields.parent_no}
              onChange={set("parent_no")}
              placeholder="e.g. 9876543210"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.parent_no ? "border-red-400" : "border-gray-300"}`}
            />
            {fieldErrors.parent_no && <p className="mt-1 text-xs text-red-500">{fieldErrors.parent_no}</p>}
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {pending ? "Saving…" : initial ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Deactivate confirm modal ──────────────────────────────────────────────────

function DeactivateModal({
  student,
  onClose,
  onSuccess,
}: {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [state, action, pending] = useActionState(adminDeactivateStudent, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl">
        <h2 className="mb-1.5 text-base font-semibold text-gray-900">Remove Student</h2>
        <p className="mb-4 text-sm text-gray-600">
          Remove{" "}
          <span className="font-semibold text-gray-900">{student.std_name}</span>{" "}
          from active records? You can restore them later from History.
        </p>
        <form action={action}>
          <input type="hidden" name="id" value={student.id} />
          {state.error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {pending ? "Removing…" : "Remove"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── History panel ─────────────────────────────────────────────────────────────

function HistoryPanel({
  inactiveStudents,
  onClose,
  onRestore,
}: {
  inactiveStudents: Student[];
  onClose: () => void;
  onRestore: () => void;
}) {
  const [restoringIds, setRestoringIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    setRestoringIds((prev) => new Set(prev).add(id));
    setError(null);
    const result = await adminRestoreStudent([id]);
    if (result.success) {
      onRestore();
    } else {
      setError(result.error);
      setRestoringIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Removed Students</h2>
            <p className="text-xs text-gray-500 mt-0.5">{inactiveStudents.length} student{inactiveStudents.length !== 1 ? "s" : ""} in history</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-2">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {inactiveStudents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No removed students yet.</p>
            </div>
          ) : (
            inactiveStudents.map((student) => {
              const isRestoring = restoringIds.has(student.id);
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{student.std_name}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                      <span>{student.parent_name}</span>
                      <span>Age {student.stud_age}</span>
                      <span className="capitalize">{student.gender}</span>
                      <span>{student.parent_no}</span>
                      <span>
                        {new Date(student.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(student.id)}
                    disabled={isRestoring}
                    title="Restore student"
                    className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50 shrink-0"
                  >
                    <IconRestore />
                    {isRestoring ? "Restoring…" : "Restore"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main AdminClient ──────────────────────────────────────────────────────────

export default function AdminClient({
  students,
  inactiveStudents,
  fetchError,
}: {
  students: Student[];
  inactiveStudents: Student[];
  fetchError: string | null;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [waFilter, setWAFilter] = useState<"all" | "sent" | "unsent">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [showHistory, setShowHistory] = useState(false);

  const refresh = () => {
    setSelectedIds(new Set());
    startTransition(() => router.refresh());
  };

  const visibleStudents = students
    .filter((s) => {
      if (waFilter === "all") return true;
      return waFilter === "sent" ? s.whatsapp_sent : !s.whatsapp_sent;
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.std_name.toLowerCase().includes(q) ||
        s.parent_name.toLowerCase().includes(q) ||
        s.parent_no.includes(q)
      );
    });

  const allSelected = visibleStudents.length > 0 && selectedIds.size === visibleStudents.length;

  const toggleAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(visibleStudents.map((s) => s.id)));

  const toggleOne = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectedStudents = students.filter((s) => selectedIds.has(s.id));

  const handleBulkDeactivate = async () => {
    if (!window.confirm(`Remove ${selectedStudents.length} student${selectedStudents.length !== 1 ? "s" : ""} from active records?`)) return;
    const result = await adminDeactivateStudents([...selectedIds]);
    if (result.success) refresh();
    else alert(result.error);
  };

  const handleWhatsAppClick = (studentId: string, phone: string) => {
    if (!canSendWa) return;
    setSentIds((prev) => new Set(prev).add(studentId));
    window.open(buildWaUrl(phone, message), "_blank");
    adminMarkWhatsAppSent(studentId).then((res) => {
      if (!res.success) {
        setSentIds((prev) => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
      }
    });
  };

  const closeModal = () => setModal({ type: null });
  const onMutationSuccess = () => { closeModal(); refresh(); };

  const canSendWa = message.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-3 sm:px-5 py-5 sm:py-8 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {students.length} student{students.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 relative"
            >
              <IconHistory />
              <span className="hidden sm:inline">History</span>
              {inactiveStudents.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] sm:text-[10px] font-bold text-white">
                  {inactiveStudents.length > 9 ? "9+" : inactiveStudents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setModal({ type: "add" })}
              className="whitespace-nowrap rounded-lg bg-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white"
            >
              + Add
            </button>
            <form action={adminLogout}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* ── WhatsApp compose ── */}
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <label htmlFor="wa-message" className="mb-1.5 block text-sm font-medium text-gray-800">
            WhatsApp Message
          </label>
          <textarea
            id="wa-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Type a message, then tap the WhatsApp button on a student."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="mt-1 text-xs text-gray-400">{message.length} characters</p>
        </div>

        {/* ── Search ── */}
        {students.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, parent, or phone..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── WhatsApp filter ── */}
        {students.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-xs font-medium text-gray-500">WhatsApp</span>
            {(["all", "sent", "unsent"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setWAFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  waFilter === f
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All" : f === "sent" ? "✓ Shared" : "○ Not Shared"}
              </button>
            ))}
            {(waFilter !== "all" || searchQuery) && (
              <span className="ml-auto text-xs text-gray-400">
                {visibleStudents.length} of {students.length}
              </span>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {fetchError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load records: {fetchError}
          </div>
        )}

        {/* ── Empty ── */}
        {!fetchError && students.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-gray-400 text-sm">No active students.</p>
            <button
              onClick={() => setModal({ type: "add" })}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white"
            >
              Add First Student
            </button>
          </div>
        )}

        {!fetchError && students.length > 0 && visibleStudents.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
            <p className="text-gray-400 text-sm">
              {searchQuery
                ? `No students match "${searchQuery}".`
                : "No students match this filter."}
            </p>
          </div>
        )}

        {students.length > 0 && visibleStudents.length > 0 && (
          <>
            {/* ── Bulk action bar ── */}
            {selectedStudents.length > 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5">
                <span className="text-sm font-medium text-red-800">
                  {selectedStudents.length} selected
                </span>
                <button
                  onClick={handleBulkDeactivate}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <IconTrash />
                  Remove
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="ml-auto text-xs text-gray-500"
                >
                  Clear
                </button>
              </div>
            )}

            {/* ── Mobile: card list ── */}
            <div className="md:hidden space-y-2">
              {/* Select-all row */}
              <div className="flex items-center gap-2 px-1 pb-1">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-400">Select all</span>
              </div>

              {visibleStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);
                return (
                  <div
                    key={student.id}
                    className={`rounded-xl border bg-white px-4 py-3 shadow-sm transition-colors ${
                      isSelected ? "border-blue-200 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    {/* Top row: checkbox + name + actions */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(student.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {student.std_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{student.parent_name}</p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleWhatsAppClick(student.id, student.parent_no)}
                          disabled={!canSendWa}
                          title={canSendWa ? `WhatsApp ${student.parent_name}` : "Type a message first"}
                          className={`relative rounded-lg p-2 ${
                            canSendWa
                              ? "bg-green-100 text-green-700"
                              : "cursor-not-allowed bg-gray-100 text-gray-300"
                          }`}
                        >
                          <IconWhatsApp />
                          {(student.whatsapp_sent || sentIds.has(student.id)) && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-white">
                              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-none stroke-current stroke-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setModal({ type: "edit", student })}
                          className="rounded-lg bg-gray-100 p-2 text-gray-600"
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => setModal({ type: "deactivate", student })}
                          className="rounded-lg bg-red-50 p-2 text-red-500"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>

                    {/* Detail row */}
                    <div className="mt-2 ml-7 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                      <span>Age {student.stud_age}</span>
                      <span className="capitalize">{student.gender}</span>
                      <span>{student.parent_no}</span>
                      <span>
                        {new Date(student.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop: table ── */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <colgroup>
                    <col className="w-10" />
                    <col className="w-8" />
                    <col />
                    <col />
                    <col className="w-14" />
                    <col className="w-16" />
                    <col className="w-[145px]" />
                    <col className="w-[135px]" />
                    <col className="w-[128px]" />
                  </colgroup>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      {["#", "Student Name", "Parent / Guardian", "Age", "Gender", "Phone", "Registered On", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {visibleStudents.map((student, index) => {
                      const isSelected = selectedIds.has(student.id);
                      return (
                        <tr
                          key={student.id}
                          className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOne(student.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                          <td className="truncate px-4 py-3 text-sm font-medium text-gray-900" title={student.std_name}>{student.std_name}</td>
                          <td className="truncate px-4 py-3 text-sm text-gray-700" title={student.parent_name}>{student.parent_name}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{student.stud_age}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-700">{student.gender}</td>
                          <td className="truncate px-4 py-3 text-sm text-gray-700">{student.parent_no}</td>
                          <td className="truncate px-4 py-3 text-sm text-gray-500">
                            {new Date(student.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleWhatsAppClick(student.id, student.parent_no)}
                                disabled={!canSendWa}
                                title={canSendWa ? `WhatsApp ${student.parent_name}` : "Type a message first"}
                                className={`relative rounded-lg p-1.5 transition-colors ${
                                  canSendWa
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                                }`}
                              >
                                <IconWhatsApp />
                                {(student.whatsapp_sent || sentIds.has(student.id)) && (
                                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-white">
                                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-none stroke-current stroke-3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => setModal({ type: "edit", student })}
                                title="Edit student"
                                className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => setModal({ type: "deactivate", student })}
                                title="Remove student"
                                className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {(modal.type === "add" || modal.type === "edit") && (
        <StudentModal
          initial={modal.type === "edit" ? modal.student : undefined}
          onClose={closeModal}
          onSuccess={onMutationSuccess}
        />
      )}
      {modal.type === "deactivate" && (
        <DeactivateModal
          student={modal.student}
          onClose={closeModal}
          onSuccess={onMutationSuccess}
        />
      )}
      {showHistory && (
        <HistoryPanel
          inactiveStudents={inactiveStudents}
          onClose={() => setShowHistory(false)}
          onRestore={() => { setShowHistory(false); refresh(); }}
        />
      )}
    </div>
  );
}
