import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NovaFitLogo } from "@/components/brand/novafit-logo";

export function AuthShell({
    eyebrow,
    title,
    description,
    children,
    footer,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
    footer: ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#e9ece8] p-3 sm:p-5 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100svh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(17,17,17,0.14)] sm:min-h-[calc(100svh-2.5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:min-h-[calc(100svh-4rem)]">
                <section
                    className="relative hidden min-h-[680px] overflow-hidden bg-neutral-950 bg-cover bg-center lg:block"
                    style={{
                        backgroundImage:
                            "linear-gradient(180deg, rgba(7,12,11,0.12) 0%, rgba(7,12,11,0.2) 38%, rgba(7,12,11,0.88) 100%), url('/cda3a1bf1a3db02e925e5a3605bf1114.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.35),transparent_48%,rgba(16,185,129,0.12))]" />
                    <div className="relative flex h-full flex-col justify-between p-8 xl:p-12">
                        <Link
                            href="/"
                            className="flex w-fit items-center"
                        >
                            <NovaFitLogo className="h-16 w-44 object-cover object-center" />
                        </Link>

                        <div className="max-w-xl text-white">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                                Strength starts here
                            </p>
                            <h1 className="max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-0.04em] xl:text-6xl">
                                Build a body of work.
                            </h1>
                            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-300">
                                Serious equipment, considered nutrition, and the momentum to keep showing up.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-neutral-200">
                                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                                    Equipment that lasts
                                </span>
                                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                                    Fuel for the work
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-[680px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
                    <div className="mb-12 flex items-center justify-between lg:hidden">
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <NovaFitLogo className="h-14 w-40 object-cover object-center" />
                        </Link>
                        <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                {eyebrow}
                            </p>
                            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
                                {title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-neutral-500">{description}</p>
                        </div>

                        {children}
                        <div className="mt-8 border-t border-neutral-200 pt-6">{footer}</div>
                    </div>
                </section>
            </div>
        </main>
    );
}
