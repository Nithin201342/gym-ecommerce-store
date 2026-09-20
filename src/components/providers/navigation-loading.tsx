"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationLoading() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const resetTimer = window.setTimeout(() => setIsLoading(false), 0);
        return () => window.clearTimeout(resetTimer);
    }, [pathname]);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target as HTMLElement | null;
            const anchor = target?.closest("a");
            if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
                return;
            }

            const url = new URL(anchor.href, window.location.href);
            if (
                url.origin !== window.location.origin ||
                url.pathname === window.location.pathname && url.search === window.location.search ||
                url.hash
            ) {
                return;
            }

            setIsLoading(true);
            window.setTimeout(() => setIsLoading(false), 10000);
        }

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/10 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
        >
            <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 shadow-xl">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-emerald-500" />
                Loading...
            </div>
        </div>
    );
}
