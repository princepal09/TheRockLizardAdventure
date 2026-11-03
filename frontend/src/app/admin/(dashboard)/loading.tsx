import ModuleSkeleton from "@/components/ui/ModuleSkeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl border border-slate-200 bg-white">
      <ModuleSkeleton label="Loading dashboard page" />
    </div>
  );
}
