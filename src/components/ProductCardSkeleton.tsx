export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border">
      <div className="aspect-[3/4] skeleton-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-20 skeleton-pulse" />
        <div className="h-4 w-full skeleton-pulse" />
        <div className="h-4 w-3/4 skeleton-pulse" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-16 skeleton-pulse" />
          <div className="h-8 w-20 skeleton-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
