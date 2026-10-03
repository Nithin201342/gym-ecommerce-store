"use client";

import { useEffect, useState } from "react";
import { formatCents } from "@/lib/format";

export function CartSubtotal({ initialCents }: { initialCents: number }) {
    const [subtotalCents, setSubtotalCents] = useState(initialCents);

    useEffect(() => {
        function updateSubtotal(event: Event) {
            const delta = (event as CustomEvent<number>).detail;
            setSubtotalCents((subtotal) => Math.max(0, subtotal + delta));
        }

        window.addEventListener("novafit:cart-subtotal", updateSubtotal);
        return () => window.removeEventListener("novafit:cart-subtotal", updateSubtotal);
    }, []);

    return <span className="font-medium text-neutral-950">{formatCents(subtotalCents)}</span>;
}