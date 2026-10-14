"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationLoading() {
    const pathname = usePathname();
    const searchParams = useSearchParams().toString();
    const [isLoading, setIsLoading] = useState(false);
    const resetTimer = useRef<number | null>(null);

    useEffect(() => {
        if (resetTimer.current !== null) {
            window.clearTimeout(resetTimer.current);
            resetTimer.current = null;
        }

        const routeChangeTimer = window.setTimeout(() => setIsLoading(false), 0);
        return () => window.clearTimeout(routeChangeTimer);
    }, [pathname, searchParams]);

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
            if (resetTimer.current !== null) {
                window.clearTimeout(resetTimer.current);
            }
            resetTimer.current = window.setTimeout(() => {
                setIsLoading(false);
                resetTimer.current = null;
            }, 10000);
        }

        document.addEventListener("click", handleClick, true);
        return () => {
            document.removeEventListener("click", handleClick, true);
            if (resetTimer.current !== null) {
                window.clearTimeout(resetTimer.current);
            }
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className="navigation-loading-indicator fixed inset-x-0 top-0 z-[100]"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
        >
            <span aria-hidden="true" />
        </div>
    );
}
