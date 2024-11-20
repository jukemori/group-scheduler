'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface SidebarProps {
  calendarId: string
  isOpen: boolean
}

interface Calendar {
  id: number
  name: string
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchCalendars = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      try {
        const response = await axios.get(
          'http://127.0.0.1:3001/api/v1/calendars',
          {
            headers: {
              'access-token': accessToken,
              client,
              uid,
            },
          },
        )
        setCalendars(response.data)
      } catch (error) {
        console.error('Failed to fetch calendars:', error)
      }
    }

    fetchCalendars()
  }, [])

  const handleCalendarSelect = (calendarId: number) => {
    localStorage.setItem('calendar-id', calendarId.toString())
    router.push(`/calendars/${calendarId}`)
  }

  return (
    <aside
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0'
      } flex-shrink-0 bg-gray-100 min-h-[calc(100vh-64px)] overflow-hidden`}
    >
      <div className="p-4 w-64">
        <h2 className="text-lg font-semibold mb-4">Calendars</h2>
        <nav className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              onClick={() => handleCalendarSelect(calendar.id)}
              className={`block p-2 rounded cursor-pointer hover:bg-gray-200 ${
                pathname === `/calendars/${calendar.id}` ? 'bg-gray-200' : ''
              }`}
            >
              {calendar.name}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
