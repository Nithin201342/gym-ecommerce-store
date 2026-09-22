import Image from "next/image";

export function NovaFitLogo({ className = "h-5 w-18" }: { className?: string }) {
    return (
        <Image
            src="/dumbbell-transparent.png"
            alt="NovaFit"
            width={768}
            height={300}
            className={className}
            priority
        />
    );
}
