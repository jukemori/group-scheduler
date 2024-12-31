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
    <ScheduleContext.Provider value={{ scheduleRef: scheduleRef as React.RefObject<ScheduleComponent> }}>
      <div>
        {pathname.startsWith('/calendars/') && (
          <Navbar calendarId={calendarId} />
        )}

        <div className="flex max-w-screen-xl mx-auto mt-16 pt-4 w-full relative">
          <Sidebar />
          <main className="ml-0 md:ml-[270px] p-4 flex-1">
            <div>{children}</div>
          </main>
        </div>
      </div>
    </ScheduleContext.Provider>
  )
}
