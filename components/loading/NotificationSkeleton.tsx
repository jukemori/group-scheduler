import { Skeleton } from '@/components/ui/skeleton'

export function NotificationSkeleton() {
  return (
    <div className="notification-item p-4 mb-3 bg-card rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-[250px] mb-2" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
    </div>
  )
}
