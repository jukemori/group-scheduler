'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useState, useRef } from 'react'
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule'
import { ScheduleContext } from '@/contexts/ScheduleContext'

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const calendarId = pathname.split('/')[2]
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const scheduleRef = useRef<ScheduleComponent>(null)

  return (
    <ScheduleContext.Provider value={{ scheduleRef }}>
      <div className="min-h-screen">
        {pathname.startsWith('/calendars/') && (
          <Navbar calendarId={calendarId} />
        )}

        <div className="flex max-w-screen-xl mx-auto w-full relative">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-0 top-4 z-10 p-2 bg-white rounded-r-lg shadow-md hover:bg-gray-100"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>

          <Sidebar calendarId={calendarId} isOpen={isSidebarOpen} />
          <main className="flex-1 p-4">
            <div>{children}</div>
          </main>
        </div>
      </div>
    </ScheduleContext.Provider>
  )
}
