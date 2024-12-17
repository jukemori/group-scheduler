'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useRef } from 'react'
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule'
import { ScheduleContext } from '@/contexts/ScheduleContext'

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const scheduleRef = useRef<ScheduleComponent>(null)

  if (pathname === '/calendars/new') {
    return children
  }

  const calendarId = pathname.split('/')[2]

  return (
    <ScheduleContext.Provider value={{ scheduleRef }}>
      <div className="min-h-screen">
        {pathname.startsWith('/calendars/') && (
          <Navbar calendarId={calendarId} />
        )}

        <div className="flex max-w-screen-xl mx-auto w-full relative">
          <Sidebar />
          <main className="flex-1 p-4">
            <div>{children}</div>
          </main>
        </div>
      </div>
    </ScheduleContext.Provider>
  )
}
