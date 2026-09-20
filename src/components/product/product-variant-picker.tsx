import Link from "next/link";

type Variant = {
    id: string;
    slug: string;
    name: string;
    color: string | null;
    images: string[];
    stock: number;
};

const SWATCH_COLORS: Record<string, string> = {
    black: "#171717",
    white: "#ffffff",
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
    yellow: "#facc15",
    gray: "#737373",
    grey: "#737373",
    navy: "#1e3a8a",
    pink: "#ec4899",
    purple: "#9333ea",
    orange: "#f97316",
    brown: "#92400e",
};

function swatchColor(color: string | null) {
    if (!color) return "#d4d4d4";
    return SWATCH_COLORS[color.trim().toLowerCase()] ?? "#a3a3a3";
}

export function ProductVariantPicker({
    variants,
    currentSlug,
}: {
    variants: Variant[];
    currentSlug: string;
}) {
    if (variants.length < 2) return null;

    return (
        <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-neutral-900">Color</p>
            <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                    const isCurrent = variant.slug === currentSlug;
                    const label = variant.color ?? variant.name;

                    return (
                        <Link
                            key={variant.id}
                            href={`/products/${variant.slug}`}
                            title={`${label}${variant.stock === 0 ? " - Out of stock" : ""}`}
                            aria-label={`View ${label} color`}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${isCurrent
                                    ? "border-neutral-950 bg-neutral-950 text-white"
                                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950"
                                }`}
                        >
                            <span
                                className="h-4 w-4 rounded-full border border-black/20"
                                style={{ backgroundColor: swatchColor(variant.color) }}
                            />
                            {variant.color ?? "Option"}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}