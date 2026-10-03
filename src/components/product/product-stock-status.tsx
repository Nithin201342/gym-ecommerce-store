const LOW_STOCK_THRESHOLD = 10;
const CRITICAL_STOCK_THRESHOLD = 5;

export function ProductStockStatus({
    stock,
    className = "",
}: {
    stock: number;
    className?: string;
}) {
    const message =
        stock <= 0
            ? "Out of stock"
            : stock <= LOW_STOCK_THRESHOLD
                ? `Only ${stock} remaining`
                : `${stock} in stock`;
    const colorClass =
        stock <= 0 || stock <= CRITICAL_STOCK_THRESHOLD
            ? "text-red-700"
            : stock <= LOW_STOCK_THRESHOLD
                ? "text-neutral-500"
                : "text-neutral-600";

    return (
        <p role="status" className={`text-xs font-medium ${colorClass} ${className}`}>
            {message}
        </p>
    );
}