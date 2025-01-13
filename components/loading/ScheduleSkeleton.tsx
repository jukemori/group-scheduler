import { Skeleton } from '@/components/ui/skeleton'

export function ScheduleSkeleton() {
  return (
    <div className="w-full h-[550px] border rounded-md bg-white">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 p-4">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`weekday-${i}`} className="h-6 w-full" />
          ))}

        {Array(35)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`cell-${i}`} className="h-20 w-full" />
          ))}
      </div>
    </div>
  )
}
