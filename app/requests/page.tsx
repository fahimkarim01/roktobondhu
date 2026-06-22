import supabase from "@/lib/supabase";

type Request = {
  id: string;
  blood_group: string;
  hospital_name: string;
  district: string;
  requester_name: string;
  requester_phone: string;
  created_at: string;
};

function timeSincePosted(isoDate: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 1000
  );

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default async function RequestsPage() {
  const { data } = await supabase
    .from("requests")
    .select(
      "id, blood_group, hospital_name, district, requester_name, requester_phone, created_at"
    )
    .eq("is_open", true)
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as Request[];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Open Blood Requests
      </h1>

      {requests.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No open requests right now
        </p>
      )}

      {requests.length > 0 && (
        <ul className="flex flex-col gap-4">
          {requests.map((request) => (
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
