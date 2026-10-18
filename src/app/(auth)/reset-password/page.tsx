"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (!token) {
      setError("This reset link is invalid or has expired. Request a new link.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "The reset link is invalid or has expired.");
        return;
      }
      setMessage(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("We couldn't update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password."
      description="Create a new password with at least 8 characters. Your reset link can only be used once."
      footer={
        <p className="text-center text-sm text-neutral-500">
          Back to{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
        />
        <PasswordInput
          id="confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {message && (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            {message}{" "}
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}{" "}
            {!token && (
              <Link href="/forgot-password" className="font-semibold underline">
                Request a new link
              </Link>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating password..." : "Update password"}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </button>
      </form>
    </AuthShell>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          id={id}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
          placeholder="At least 8 characters"
        />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
