import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function NoteSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[60px] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-[120px]" />
      </CardFooter>
    </Card>
  )
}
