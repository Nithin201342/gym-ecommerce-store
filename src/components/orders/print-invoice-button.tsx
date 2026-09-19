"use client";

import { Printer } from "lucide-react";

export function PrintInvoiceButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
            <Printer size={16} />
            Print / Save PDF
        </button>
    );
}
