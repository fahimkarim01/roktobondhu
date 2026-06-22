import { createSupabaseServerClient } from "@/lib/supabase";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ blood_group?: string }>;
}) {
  const { blood_group } = await searchParams;
  const bloodGroup =
    typeof blood_group === "string" && blood_group.length > 0
      ? blood_group
      : undefined;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = user !== null;

  let donors: {
    name: string;
    district: string;
    blood_group: string;
    phone?: string;
  }[] = [];

  if (bloodGroup) {
    const columns = isLoggedIn
      ? "name, district, blood_group, phone"
      : "name, district, blood_group";

    const { data } = await supabase
      .from("donors")
      .select(columns)
      .eq("blood_group", bloodGroup)
      .eq("is_available", true)
      .returns<typeof donors>();

    donors = data ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Find Donors
      </h1>

      <form
        action="/search"
        method="GET"
        className="mb-8 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Blood Group
          </span>
          <select
            name="blood_group"
            defaultValue={bloodGroup ?? ""}
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-900"
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

        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          Search
        </button>
      </form>

      {!isLoggedIn && (
        <p className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          Sign in to see donor phone numbers and contact them directly.
        </p>
      )}

      {!bloodGroup && (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Select a blood group to search
        </p>
      )}

      {bloodGroup && donors.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No donors found
        </p>
      )}

      {donors.length > 0 && (
        <ul className="flex flex-col gap-4">
          {donors.map((donor, index) => (
            <li
              key={`${donor.name}-${donor.district}-${index}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {donor.name}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {donor.district}
                  </p>
                  {isLoggedIn ? (
                    <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                      {donor.phone}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm italic text-zinc-400 dark:text-zinc-500">
                      Sign in to see phone number
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                  {donor.blood_group}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
