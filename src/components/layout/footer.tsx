import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NovaFitLogo } from "@/components/brand/novafit-logo";

const SHOP_LINKS = [
    { label: "Equipment", href: "/products?type=EQUIPMENT" },
    { label: "Supplements", href: "/products?type=SUPPLEMENT" },
    { label: "Accessories", href: "/products?type=ACCESSORY" },
    { label: "New Arrivals", href: "/products" },
];

const SUPPORT_LINKS = [
    { label: "Help Center", href: "/products" },
    { label: "Shipping", href: "/products" },
    { label: "Returns", href: "/products" },
    { label: "Contact Us", href: "/products" },
];

const COMPANY_LINKS = [
    { label: "About", href: "/products" },
    { label: "Our Story", href: "/products" },
    { label: "Journal", href: "/products" },
    { label: "Privacy", href: "/products" },
];

export function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr]">
                    <div>
                        <Link href="/" aria-label="NovaFit home" className="inline-flex items-center">
                            <NovaFitLogo className="h-14 w-40 object-cover object-center" />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-400">
                            Premium gear and everyday essentials for athletes who want better routines,
                            stronger recovery, and smarter training.
                        </p>
                        <div className="mt-6 space-y-3 text-sm text-neutral-400">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-emerald-400" />
                                <span>15 Forge Street, Austin, TX</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-emerald-400" />
                                <span>+1 (800) 555-0199</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-emerald-400" />
                                <span>hello@novafit.co</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                            Shop
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-neutral-400">
                            {SHOP_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                            Support
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-neutral-400">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                            Company
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-neutral-400">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 NovaFit. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/products" className="transition-colors hover:text-white">
                            Terms
                        </Link>
                        <Link href="/products" className="transition-colors hover:text-white">
                            Privacy
                        </Link>
                        <Link href="/products" className="transition-colors hover:text-white">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
