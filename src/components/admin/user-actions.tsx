"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUser, toggleUserBlocked } from "@/lib/actions/admin-actions";
import type { Role } from "@prisma/client";

type UserSummary = {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    isBlocked: boolean;
};

export function UserActions({ user }: { user: UserSummary }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name ?? "");
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState<Role>(user.role);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function saveChanges() {
        setError(null);
        startTransition(async () => {
            const result = await updateUser(user.id, { name, email, role });
            if (result.ok) {
                setEditing(false);
                router.refresh();
            } else {
                setError(result.error);
            }
        });
    }

    function toggleBlocked() {
        setError(null);
        startTransition(async () => {
            const result = await toggleUserBlocked(user.id, !user.isBlocked);
            if (result.ok) router.refresh();
            else setError(result.error);
        });
    }

    if (editing) {
        return (
            <div className="min-w-64 space-y-2">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-label="User name"
                    className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    aria-label="User email"
                    className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as Role)}
                    aria-label="User role"
                    className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-3 text-sm">
                    <button
                        type="button"
                        onClick={saveChanges}
                        disabled={isPending}
                        className="font-medium text-emerald-700 hover:underline disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(false);
                            setError(null);
                        }}
                        className="text-neutral-600 hover:text-neutral-900"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-end gap-3 text-sm">
            {error && <p className="w-full text-xs text-red-600">{error}</p>}
            <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
                Edit
            </button>
            <button
                type="button"
                onClick={toggleBlocked}
                disabled={isPending}
                className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${user.isBlocked
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100"
                    : "border-red-200 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100"
                    }`}
            >
                {isPending ? "Updating..." : user.isBlocked ? "Unblock" : "Block"}
            </button>
        </div>
    );
}
