import { Skeleton } from '@/components/ui/skeleton'

export function MemberSkeleton() {
  return (
    <li className="flex flex-col items-center gap-2">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </li>
  )
}
