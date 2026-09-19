"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImage({
    src,
    alt,
    sizes,
    priority = false,
    className = "object-cover",
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
                <span>Iron &amp; Fuel</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            priority={priority}
            onError={() => setFailed(true)}
        />
    );
}
