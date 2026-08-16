"use client";

import { useState } from "react";
import { saveFileRecord } from "@/lib/firestore";
import { getAuth } from "firebase/auth";
import app from "@/lib/firebase";
import { registerFileOnBlockchain } from "../../lib/blockchain";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const calculateSHA256 = async (
    selectedFile: File
  ): Promise<string> => {
    const buffer = await selectedFile.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      buffer
    );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    return hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setHash("");
    setMessage("");

    try {
      setMessage("Generating SHA-256 hash...");

      const generatedHash =
        await calculateSHA256(selectedFile);

      setHash(generatedHash);
      setMessage(
        "SHA-256 hash generated successfully."
      );
    } catch (error) {
      console.error("SHA-256 error:", error);
      setMessage("Failed to generate SHA-256 hash.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    if (!hash) {
      setMessage("Hash is not ready yet.");
      return;
    }

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Connecting to MetaMask...");

      const blockchainTx =
        await registerFileOnBlockchain(hash);

      setMessage(
        "Blockchain transaction confirmed. Saving file information..."
      );

      await saveFileRecord({
        userId: user.uid,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        sha256Hash: hash,
        blockchainTx: blockchainTx,
      });

      setMessage(
        "File secured successfully on Firebase and blockchain!"
      );

      setFile(null);
      setHash("");
    } catch (error: unknown) {
      console.error(
        "Upload / blockchain error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "";

      if (
        errorMessage.toLowerCase().includes(
          "user rejected"
        )
      ) {
        setMessage(
          "Transaction rejected in MetaMask."
        );
      } else if (
        errorMessage
          .toLowerCase()
          .includes("already registered")
      ) {
        setMessage(
          "This exact file has already been registered on the blockchain."
        );
      } else {
        setMessage(
          errorMessage ||
            "Blockchain transaction failed. Check MetaMask and Hardhat Local."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <h1 className="mb-3 text-center text-3xl font-bold">
          Secure File Upload
        </h1>

        <p className="mb-10 text-center text-slate-400">
          Generate SHA-256 hash and secure your file on blockchain
        </p>

        <div className="rounded-2xl border border-slate-700 bg-[#0d1b2e] p-8">

          <label className="mb-3 block text-sm font-medium">
            Select File
          </label>

          <input
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-[#081423] p-4 text-slate-300"
          />

          {file && (
            <div className="mt-6 rounded-xl bg-[#081423] p-5">

              <p className="text-sm text-slate-400">
                File Name
              </p>

              <p className="mb-4 break-all font-medium">
                {file.name}
              </p>

              <p className="text-sm text-slate-400">
                File Size
              </p>

              <p className="mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="text-sm text-slate-400">
                SHA-256 Hash
              </p>

              <div className="mt-2 break-all rounded-lg bg-[#07111f] p-4 font-mono text-sm text-blue-400">
                {hash || "Generating..."}
              </div>

            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || !hash || loading}
            className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading
              ? "Securing on Blockchain..."
              : "Upload & Secure"}
          </button>

          {message && (
            <div className="mt-5 break-words text-center text-sm text-slate-300">
              {message}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}