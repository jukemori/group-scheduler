'use client'
import { SidebarButton } from './SidebarButton'
import { SidebarItems, Calendar } from '@/types/sidebar'
import { usePathname, useRouter } from 'next/navigation'
interface SidebarDesktopProps {
  sidebarItems: SidebarItems
  calendars: Calendar[]
}
export function SidebarDesktop({
  sidebarItems,
  calendars,
}: SidebarDesktopProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleCalendarSelect = (calendarId: number) => {
    localStorage.setItem('calendar-id', calendarId.toString())
    router.push(`/calendars/${calendarId}`)
  }

  return (
    <aside className="w-[270px] max-w-xs h-screen z-40 border-r">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-foreground">
          Calendars
        </h3>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {calendars.map((calendar) => (
              <SidebarButton
                key={calendar.id}
                onClick={() => handleCalendarSelect(calendar.id)}
                variant={
                  pathname.startsWith(`/calendars/${calendar.id}`)
                    ? 'secondary'
                    : 'ghost'
                }
                className="w-full"
              >
                {calendar.name}
              </SidebarButton>
            ))}

            {sidebarItems.extras}
          </div>
        </div>
      </div>
    </aside>
  )
}
