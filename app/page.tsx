"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Go to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      console.error(error);

      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      switch (firebaseError.code) {
        case "auth/invalid-credential":
          setErrorMessage(
            "Incorrect email or password."
          );
          break;

        case "auth/user-not-found":
          setErrorMessage(
            "No account found with this email."
          );
          break;

        case "auth/wrong-password":
          setErrorMessage(
            "Incorrect password."
          );
          break;

        case "auth/invalid-email":
          setErrorMessage(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setErrorMessage(
            "Too many attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          setErrorMessage(
            "Network error. Check your internet connection."
          );
          break;

        default:
          setErrorMessage(
            firebaseError.message ||
              "Login failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
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

            <h1 className="text-3xl font-bold">
              SecureTransfer
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Blockchain-powered file integrity
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="rounded-3xl border border-slate-800 bg-[#0d1a2b] p-6 shadow-2xl sm:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-semibold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Sign in to securely manage your files.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-[#081423] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#081423] px-4 py-3.5 pr-20 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password reset will be added in the next phase."
                    )
                  }
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>

              {/* ERROR */}
              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-500">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />
            </div>

            {/* CREATE ACCOUNT */}
            <Link
              href="/register"
              className="block w-full rounded-xl border border-slate-700 py-3.5 text-center font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Create an account
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
            <span>🔒</span>
            <span>
              Your files are protected with cryptographic verification
            </span>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            SecureTransfer • Blockchain File Integrity System
          </p>

        </div>
      </div>
    </main>
  );
}