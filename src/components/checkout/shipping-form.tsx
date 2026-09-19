"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/lib/actions/checkout-actions";

const FIELDS: Array<{
  name:
    | "shippingName"
    | "shippingAddress"
    | "shippingCity"
    | "shippingState"
    | "shippingZip"
    | "shippingCountry";
  label: string;
  autoComplete: string;
  span?: "full";
}> = [
  { name: "shippingName", label: "Full name", autoComplete: "name", span: "full" },
  {
    name: "shippingAddress",
    label: "Street address",
    autoComplete: "street-address",
    span: "full",
  },
  { name: "shippingCity", label: "City", autoComplete: "address-level2" },
  { name: "shippingState", label: "State / Province", autoComplete: "address-level1" },
  { name: "shippingZip", label: "Postal code", autoComplete: "postal-code" },
  { name: "shippingCountry", label: "Country", autoComplete: "country-name" },
];

export function ShippingForm() {
  const [values, setValues] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createCheckoutSession(values);
      if (result.ok) {
        // Stripe Checkout is a hosted, external page — a full navigation,
        // not a Next.js client-side route.
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <h2 className="mb-4 text-lg font-semibold text-white">
        Shipping address
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.span === "full" ? "col-span-2" : ""}>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-sm text-neutral-300"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              autoComplete={field.autoComplete}
              required
              value={values[field.name]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.name]: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400/50 focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Starting checkout..." : "Continue to payment"}
      </button>
    </form>
  );
}
