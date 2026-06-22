import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import AvailabilityToggle from "@/app/components/AvailabilityToggle";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

type NearbyRequest = {
  id: string;
  blood_group: string;
  hospital_name: string;
  district: string;
  requester_name: string;
  requester_phone: string;
  created_at: string;
};

function timeSincePosted(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: donor } = await supabase
    .from("donors")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!donor) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-red-600">
          Find a Blood Donor
        </h1>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-700 dark:text-zinc-300">
            You&apos;re not registered as a donor yet, but you can still search
            for donors in your area.
          </p>

          <form
            action="/search"
            method="GET"
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Blood Group
              </span>
              <select
                name="blood_group"
                required
                defaultValue=""
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
              className="rounded-md bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              Search Donors
            </button>
          </form>
        </div>

        <Link
          href="/register"
          className="mt-6 inline-block rounded-md bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          Register as a Donor
        </Link>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Or{" "}
          <Link
            href="/request"
            className="font-medium text-red-600 hover:underline dark:text-red-400"
          >
            post a blood request
          </Link>{" "}
          for someone you know
        </p>
      </div>
    );
  }

  const { data: nearbyData } = await supabase
    .from("requests")
    .select(
      "id, blood_group, hospital_name, district, requester_name, requester_phone, created_at",
    )
    .eq("district", donor.district)
    .eq("is_open", true)
    .order("created_at", { ascending: false });

  const nearbyRequests = (nearbyData ?? []) as NearbyRequest[];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-red-600">My Donor Profile</h1>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Name
            </dt>
            <dd className="text-base text-zinc-900 dark:text-zinc-50">
              {donor.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Phone
            </dt>
            <dd className="text-base text-zinc-900 dark:text-zinc-50">
              {donor.phone}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Blood Group
            </dt>
            <dd className="mt-1">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                {donor.blood_group}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              District
            </dt>
            <dd className="text-base text-zinc-900 dark:text-zinc-50">
              {donor.district}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Availability
            </dt>
            <dd>
              <AvailabilityToggle
                donorId={donor.id}
                initialAvailable={donor.is_available}
              />
            </dd>
          </div>
        </dl>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Open Blood Requests in Your Area
      </h2>

      {nearbyRequests.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No open requests in your area right now
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {nearbyRequests.map((request) => (
            <li
              key={request.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {request.hospital_name}
                </p>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                  {request.blood_group}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {request.district}
              </p>
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                {request.requester_name} ·{" "}
                <span className="font-medium text-red-600 dark:text-red-400">
                  {request.requester_phone}
                </span>
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                {timeSincePosted(request.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
