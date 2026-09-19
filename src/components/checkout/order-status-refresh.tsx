"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrderStatusRefresh({ pending }: { pending: boolean }) {
    const router = useRouter();

    useEffect(() => {
        if (!pending) return;

        const intervalId = window.setInterval(() => {
            router.refresh();
        }, 2000);

        return () => window.clearInterval(intervalId);
    }, [pending, router]);

    return null;
}
