"use client";

import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
    >
      Log out
    </button>
  );
}
