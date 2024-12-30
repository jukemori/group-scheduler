import { Skeleton } from '@/components/ui/skeleton'

export function SidebarSkeleton() {
  return (
    <div className="flex items-center justify-between w-full px-3 py-2">
      <Skeleton className="h-4 w-[160px]" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  )
}
