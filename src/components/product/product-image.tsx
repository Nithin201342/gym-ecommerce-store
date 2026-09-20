"use client";

import { useState } from "react";

export function ProductImage({
    src,
    alt,
    sizes,
    priority = false,
    className = "object-contain",
}: {
    src?: string;
    alt: string;
    sizes: string;
    priority?: boolean;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 text-center text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                <span>NovaFit</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`h-full w-full ${className}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}
