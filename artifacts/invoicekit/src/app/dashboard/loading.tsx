import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-muted/40" />
          <Skeleton className="h-5 w-72 bg-muted/30" />
        </div>
        <Skeleton className="h-10 w-32 bg-muted/40" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full bg-muted/20 rounded-xl" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-40 bg-muted/30" />
        <Skeleton className="h-[300px] w-full bg-muted/10 rounded-xl" />
      </div>
    </div>
  );
}
