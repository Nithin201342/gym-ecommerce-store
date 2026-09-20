export default function Loading() {
    return (
        <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                    <div className="h-2.5 w-28 animate-pulse rounded-full bg-neutral-200" />
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-8 w-2/3 animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200/80" />
                    <div className="h-4 w-5/6 animate-pulse rounded-full bg-neutral-200/80" />
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
                    <div className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
                    <div className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
                </div>
            </div>
        </div>
    );
}
