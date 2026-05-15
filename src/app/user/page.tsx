"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { secretFormAction } from "@/lib/supabase/actions";

const initialState = { success: false, error: null as string | null };

export default function UserPage() {
  const [state, formAction, pending] = useActionState(
    secretFormAction,
    initialState
  );

  const [fields, setFields] = useState({
    std_name: "",
    parent_name: "",
    stud_age: "",
    gender: "",
    parent_no: "",
  });

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  if (state.success) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Student Registered Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            The student record has been saved. We will be in touch soon.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Student Registration Form
        </h2>
        <p className="mt-1 text-sm text-gray-500">Fields marked * are required.</p>

        <form action={formAction} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="std_name" className="block text-sm font-medium text-gray-700">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              id="std_name"
              name="std_name"
              type="text"
              required
              placeholder="Enter student full name"
              value={fields.std_name}
              onChange={set("std_name")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
              Parent / Guardian Name <span className="text-red-500">*</span>
            </label>
            <input
              id="parent_name"
              name="parent_name"
              type="text"
              placeholder="Enter parent full name"
              value={fields.parent_name}
              onChange={set("parent_name")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="stud_age" className="block text-sm font-medium text-gray-700">
              Student Age
            </label>
            <input
              id="stud_age"
              name="stud_age"
              type="number"
              min="1"
              max="25"
              placeholder="Age (1–25)"
              value={fields.stud_age}
              onChange={set("stud_age")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={fields.gender}
              onChange={set("gender")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="parent_no" className="block text-sm font-medium text-gray-700">
              Parent / Guardian Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="parent_no"
              name="parent_no"
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={fields.parent_no}
              onChange={set("parent_no")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {state.error && (
            <div className="sm:col-span-2">
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </p>
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {pending ? "Submitting..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
