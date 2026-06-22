"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    await supabase.auth.signOut();

    setLoading(false);
    setSuccess(true);
    setEmail("");
    setPassword("");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Sign Up
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-950"
        >
          {loading ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          Sign-up successful! Check your email to confirm, then go to{" "}
          <Link href="/signin" className="font-medium underline hover:opacity-80">
            Sign In
          </Link>
          .
        </p>
      )}
    </div>
  );
}
