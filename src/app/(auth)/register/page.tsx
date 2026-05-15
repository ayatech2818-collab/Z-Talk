"use client";

import { useActionState } from "react";
import { registerStudent } from "@/lib/supabase/actions";

const initialState = { success: false, error: null as string | null };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerStudent,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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
            Registration Successful!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for registering. We will contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Register Student</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to register.
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="std_name"
              className="block text-sm font-medium text-gray-700"
            >
              Student Name
            </label>
            <input
              id="std_name"
              name="std_name"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label
              htmlFor="parent_name"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Name
            </label>
            <input
              id="parent_name"
              name="parent_name"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter parent name"
            />
          </div>

          <div>
            <label
              htmlFor="stud_age"
              className="block text-sm font-medium text-gray-700"
            >
              Student Age
            </label>
            <input
              id="stud_age"
              name="stud_age"
              type="number"
              min="1"
              max="100"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="parent_no"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Phone Number
            </label>
            <input
              id="parent_no"
              name="parent_no"
              type="tel"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
