export default function DashboardLoading() {
  // Skeleton loader while dashboard data / search params are resolved
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-sm text-muted-foreground">Loading dashboard…</p>
    </div>
  )
}
