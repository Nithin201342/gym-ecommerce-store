import { getAdminUsers } from "@/lib/admin";
import { FadeIn } from "@/components/admin/fade-in";
import { UserActions } from "@/components/admin/user-actions";

export default async function AdminUsersPage() {
    const users = await getAdminUsers();

    return (
        <div>
            <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Users</h1>
            <p className="mb-6 text-sm text-neutral-600">
                Manage customer accounts, access roles, and account status.
            </p>

            <FadeIn className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
                <table className="w-full min-w-[760px] text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 text-left text-neutral-500">
                            <th className="px-4 py-3 font-medium">User</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Orders</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Joined</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-neutral-200 align-top transition-colors last:border-0 hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-medium text-neutral-900">
                                        {user.name ?? "Unnamed user"}
                                    </p>
                                    <p className="text-neutral-500">{user.email}</p>
                                </td>
                                <td className="px-4 py-3 text-neutral-700">{user.role}</td>
                                <td className="px-4 py-3 text-neutral-700">
                                    {user._count.orders}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${user.isBlocked
                                                ? "bg-red-100 text-red-700"
                                                : "bg-emerald-100 text-emerald-700"
                                            }`}
                                    >
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-neutral-500">
                                    {user.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <UserActions user={user} />
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                                    No users yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </FadeIn>
        </div>
    );
}
