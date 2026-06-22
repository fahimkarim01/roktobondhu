"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(session !== null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(session !== null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between bg-red-600 px-6 py-4 text-white">
      <Link
        href="/"
        className="cursor-pointer text-2xl font-bold transition-opacity hover:opacity-80"
      >
        RoktoBondhu
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/search" className="mx-3 text-white hover:opacity-80">
          Search
        </Link>
        <Link href="/request" className="mx-3 text-white hover:opacity-80">
          Post Request
        </Link>
        <Link href="/requests" className="mx-3 text-white hover:opacity-80">
          View Requests
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="mx-3 text-white hover:opacity-80">
              My Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mx-1 rounded-md bg-white px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="mx-1 rounded-md bg-white px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="mx-1 rounded-md bg-white px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
