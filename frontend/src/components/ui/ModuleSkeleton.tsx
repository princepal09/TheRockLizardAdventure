import { Skeleton } from "./skeleton";

type SkeletonVariant = "list" | "form" | "cards" | "overview";

function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-200">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-3 w-28 max-w-full" />
          </div>
          <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <Skeleton className="h-5 w-40" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((field) => (
          <div key={field} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function CardSkeleton({ withImage }: { withImage: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((card) => (
        <div key={card} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {withImage && <Skeleton className="aspect-video rounded-none" />}
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-28 max-w-full" />
            <Skeleton className="h-4 w-20 max-w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ModuleSkeleton({
  label,
  variant = "list",
}: {
  label: string;
  variant?: SkeletonVariant;
}) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-5">
        {variant === "form" && <FormSkeleton />}
        {variant === "cards" && <CardSkeleton withImage />}
        {variant === "overview" && <CardSkeleton withImage={false} />}
        {(variant === "list" || variant === "overview") && <ListSkeleton />}
      </div>
    </div>
  );
}
