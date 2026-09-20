"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/actions/admin-actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCategory({ name, slug, description });
      if (result.ok) {
        setName("");
        setSlug("");
        setDescription("");
        setSlugTouched(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)]"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
        New category
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="Name"
          required
          className={inputClass}
        />
        <input
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          placeholder="slug"
          required
          className={inputClass}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className={inputClass}
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400 disabled:opacity-70"
      >
        {isPending ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}
