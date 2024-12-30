import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Skeleton className="h-8 w-32 mb-4" /> {/* Title */}
      <div className="space-y-8">
        {/* Photo section */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" /> {/* Avatar */}
            <Skeleton className="h-9 w-28" /> {/* Button */}
          </div>
        </div>

        {/* Name field */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Nickname field */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Email field */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Password section */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
          <Skeleton className="h-9 w-36" /> {/* Button */}
        </div>

        {/* Color section */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" /> {/* Color circle */}
            <Skeleton className="h-9 w-28" /> {/* Button */}
          </div>
        </div>
      </div>
      {/* Update button */}
      <div className="pt-8 flex justify-end">
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  )
}
