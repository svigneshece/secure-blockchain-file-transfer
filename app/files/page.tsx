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
  storageUrl?: string;
  blockchainTx?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function FilesPage() {
  const router = useRouter();

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
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
        setError(
          "Unable to load your files. Please check your Firestore rules."
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  function formatFileSize(bytes: number) {
    if (!bytes) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
      units[index]
    }`;
  }

  function formatDate(timestamp?: {
    seconds: number;
    nanoseconds: number;
  }) {
    if (!timestamp) {
      return "Processing...";
    }

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleString();
  }

  function shortenHash(hash: string) {
    if (!hash) return "Not available";

    if (hash.length <= 24) {
      return hash;
    }

    return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#091525]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <div>
            <h1 className="font-bold">
              SecureTransfer
            </h1>

            <p className="text-xs text-slate-500">
              My Files
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-5 py-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-3xl font-bold">
              My Files
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              View your secured files and their SHA-256 fingerprints.
            </p>
          </div>

          <button
            onClick={() => router.push("/upload")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            + Upload File
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-10 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-slate-400">
              Loading your files...
            </p>

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">

            <p className="font-medium text-red-400">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && files.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0d1a2b] p-12 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              📁
            </div>

            <h3 className="text-xl font-semibold">
              No secured files yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Upload your first file to generate its SHA-256
              fingerprint.
            </p>

            <button
              onClick={() => router.push("/upload")}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
            >
              Upload Your First File
            </button>

          </div>
        )}

        {/* FILES */}
        {!loading && !error && files.length > 0 && (
          <div className="space-y-4">

            {files.map((file) => (
              <div
                key={file.id}
                className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-6 transition hover:border-blue-500/40"
              >

                {/* TOP */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                      📄
                    </div>

                    <div>

                      <h3 className="break-all font-semibold">
                        {file.fileName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(file.fileSize)}
                        {" • "}
                        {file.fileType || "Unknown type"}
                      </p>

                    </div>

                  </div>

                  <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                    SHA-256 Secured
                  </div>

                </div>

                {/* HASH */}
                <div className="mt-6">

                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    SHA-256 Fingerprint
                  </p>

                  <div className="break-all rounded-xl border border-slate-800 bg-[#07111f] p-4 font-mono text-xs text-blue-400">
                    {shortenHash(file.sha256Hash)}
                  </div>

                </div>

                {/* INFORMATION */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-500">
                      Secured At
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {formatDate(file.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Blockchain
                    </p>

                    <p className="mt-1 text-sm text-yellow-400">
                      {file.blockchainTx
                        ? "Transaction recorded"
                        : "Pending blockchain integration"}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}