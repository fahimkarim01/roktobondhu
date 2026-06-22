"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace(
          "/signin?message=Please sign in first to register as a donor.",
        );
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("donors").insert({
      name,
      phone,
      blood_group: bloodGroup,
      district,
      user_id: user?.id ?? null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setName("");
    setPhone("");
    setBloodGroup("");
    setDistrict("");
  }

  if (checking) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
        <p className="text-zinc-600 dark:text-zinc-400">
          Checking your session…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Donor Registration
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Phone
          </span>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Blood Group
          </span>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="" disabled>
              Select blood group
            </option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            District
          </span>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-950"
        >
          {loading ? "Submitting…" : "Register"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          Registration successful!
        </p>
      )}
    </div>
  );
}
