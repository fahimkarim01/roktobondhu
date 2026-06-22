"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AvailabilityToggle({
  donorId,
  initialAvailable,
}: {
  donorId: string;
  initialAvailable: boolean;
}) {
  const [available, setAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const next = !available;
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase
      .from("donors")
      .update({ is_available: next })
      .eq("id", donorId);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setAvailable(next);
    setSuccess(
      next ? "You are now available to donate." : "You are now unavailable.",
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${
            available
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {loading ? "Updating…" : "Toggle Availability"}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-3 rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {success}
        </p>
      )}
    </div>
  );
}
