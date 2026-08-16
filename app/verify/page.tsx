"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserFiles } from "@/lib/firestore";

type FileRecord = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  sha256Hash: string;
  blockchainTx?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function VerifyPage() {
  const router = useRouter();

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<FileRecord | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [currentHash, setCurrentHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const [result, setResult] = useState<
    "match" | "modified" | null
  >(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        setLoading(true);

        const userFiles = await getUserFiles(user.uid);

        setFiles(userFiles as FileRecord[]);
      } catch (err) {
        console.error(err);
        setError("Unable to load your secured files.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function calculateSHA256(file: File) {
    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      buffer
    );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    return hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");
  }

  async function handleVerify() {
    if (!selectedRecord) {
      setError("Please select a secured file.");
      return;
    }

    if (!selectedFile) {
      setError("Please select the file you want to verify.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setResult(null);
      setCurrentHash("");

      const hash = await calculateSHA256(selectedFile);

      setCurrentHash(hash);

      if (
        hash.toLowerCase() ===
        selectedRecord.sha256Hash.toLowerCase()
      ) {
        setResult("match");
      } else {
        setResult("modified");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to calculate the file hash.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#091525]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">

          <div>
            <h1 className="font-bold">
              SecureTransfer
            </h1>

            <p className="text-xs text-slate-500">
              File Verification
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-blue-500 hover:text-white"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">

        {/* TITLE */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Verify File Integrity
          </h2>

          <p className="mt-2 text-slate-400">
            Compare a file against its original SHA-256
            fingerprint.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-10 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-slate-400">
              Loading secured files...
            </p>

          </div>
        )}

        {!loading && (
          <div className="grid gap-6 lg:grid-cols-2">

            {/* LEFT */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-6">

              <h3 className="text-lg font-semibold">
                1. Select secured file
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Choose the original record stored in Firestore.
              </p>

              <select
                value={selectedRecord?.id || ""}
                onChange={(e) => {
                  const record = files.find(
                    (item) => item.id === e.target.value
                  );

                  setSelectedRecord(record || null);
                  setSelectedFile(null);
                  setCurrentHash("");
                  setResult(null);
                  setError("");
                }}
                className="mt-5 w-full rounded-xl border border-slate-700 bg-[#081423] px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  Select a secured file
                </option>

                {files.map((file) => (
                  <option
                    key={file.id}
                    value={file.id}
                  >
                    {file.fileName}
                  </option>
                ))}
              </select>

              {selectedRecord && (
                <div className="mt-5 rounded-xl bg-[#081423] p-4">

                  <p className="text-xs text-slate-500">
                    Stored SHA-256
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-blue-400">
                    {selectedRecord.sha256Hash}
                  </p>

                </div>
              )}

            </div>

            {/* RIGHT */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-6">

              <h3 className="text-lg font-semibold">
                2. Select file to verify
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select the file you want to check.
              </p>

              <input
                type="file"
                onChange={(e) => {
                  setSelectedFile(
                    e.target.files?.[0] || null
                  );

                  setCurrentHash("");
                  setResult(null);
                  setError("");
                }}
                className="mt-5 w-full rounded-xl border border-slate-700 bg-[#081423] p-4 text-sm text-slate-300"
              />

              {selectedFile && (
                <div className="mt-5 rounded-xl bg-[#081423] p-4">

                  <p className="text-xs text-slate-500">
                    Selected file
                  </p>

                  <p className="mt-1 break-all text-sm">
                    {selectedFile.name}
                  </p>

                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={
                  !selectedRecord ||
                  !selectedFile ||
                  verifying
                }
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {verifying
                  ? "Verifying..."
                  : "Verify File"}
              </button>

            </div>

          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* HASH RESULT */}
        {currentHash && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0d1a2b] p-6">

            <p className="text-sm font-medium text-slate-400">
              Current file SHA-256
            </p>

            <p className="mt-3 break-all rounded-xl bg-[#07111f] p-4 font-mono text-xs text-blue-400">
              {currentHash}
            </p>

          </div>
        )}

        {/* SUCCESS */}
        {result === "match" && (
          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-7 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl">
              ✓
            </div>

            <h3 className="text-2xl font-bold text-green-400">
              File Authentic
            </h3>

            <p className="mt-2 text-sm text-green-300/70">
              The SHA-256 fingerprint matches the secured
              record. No modification was detected.
            </p>

          </div>
        )}

        {/* MODIFIED */}
        {result === "modified" && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-7 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl">
              !
            </div>

            <h3 className="text-2xl font-bold text-red-400">
              File Modified
            </h3>

            <p className="mt-2 text-sm text-red-300/70">
              The SHA-256 fingerprint does not match the
              secured record. The file may have been changed.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}