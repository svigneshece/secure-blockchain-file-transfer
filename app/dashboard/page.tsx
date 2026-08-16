"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      setUserEmail(user.email || "");

      const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "User";

      setUserName(name);

      setCheckingUser(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
    }
  }

  if (checkingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-slate-400">
            Loading your secure dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* TOP BAR */}
      <header className="border-b border-slate-800 bg-[#091525]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <div>
              <h1 className="font-bold">
                SecureTransfer
              </h1>

              <p className="text-xs text-slate-500">
                Blockchain File Integrity
              </p>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {userEmail}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>

          </div>

        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-5 py-8">

        {/* WELCOME */}
        <section className="mb-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 p-6">

          <p className="mb-2 text-sm text-blue-400">
            SECURE FILE TRANSFER SYSTEM
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Welcome, {userName} 👋
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Secure your files using encryption, SHA-256
            integrity verification and blockchain-based
            transaction records.
          </p>

        </section>

        {/* MAIN ACTIONS */}
        <section className="mb-8">

          <h2 className="mb-4 text-lg font-semibold">
            File Security
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* UPLOAD */}
            <button
              onClick={() => router.push("/upload")}
              className="group rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-[#102139]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v12" />
                  <path d="M7 8l5-5 5 5" />
                  <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
                </svg>

              </div>

              <h3 className="font-semibold">
                Upload File
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Encrypt and secure a file with SHA-256.
              </p>
            </button>

            {/* MY FILES */}
            <button
              onClick={() => router.push("/files")}
              className="group rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-[#102139]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5a2 2 0 0 1 2-2h5l2 3h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                </svg>

              </div>

              <h3 className="font-semibold">
                My Files
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                View your uploaded and secured files.
              </p>
            </button>

            {/* VERIFY */}
            <button
              onClick={() => router.push("/verify")}
              className="group rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-[#102139]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>

              </div>

              <h3 className="font-semibold">
                Verify File
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Check whether a file has been modified.
              </p>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="group rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5 text-left transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-[#102139]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                </svg>

              </div>

              <h3 className="font-semibold">
                Log Out
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sign out of your secure account.
              </p>
            </button>

          </div>
        </section>

        {/* SECURITY STATUS */}
        <section className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />

              <span className="text-sm font-medium">
                Authentication
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Firebase authentication is active.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />

              <span className="text-sm font-medium">
                SHA-256
              </span>
            </div>

            <p className="text-xs text-slate-500">
              File integrity hashing will be added next.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/40" />

              <span className="text-sm font-medium">
                Blockchain
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Blockchain transaction recording is next.
            </p>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          SecureTransfer • Secure Blockchain File Transfer System
        </footer>

      </div>
    </main>
  );
}