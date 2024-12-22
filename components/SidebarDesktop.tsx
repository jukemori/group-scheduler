'use client'
import { SidebarButton } from './SidebarButton'
import { SidebarItems, Calendar } from '@/types/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api/users'

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
  const [localCalendars, setLocalCalendars] = useState<Calendar[]>(calendars)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    setLocalCalendars(calendars)
  }, [calendars])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await userApi.getCurrentUser()
        setCurrentUserId(user.id)
      } catch (err) {
        console.error('Failed to fetch current user')
      }
    }

    fetchCurrentUser()
  }, [])

  const handleCalendarSelect = (calendarId: number) => {
    localStorage.setItem('calendar-id', calendarId.toString())
    router.push(`/calendars/${calendarId}`)
  }

  const handleEdit = async (id: number, newName: string) => {
    try {
      const headers = {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }

      await axios.put(
        `http://127.0.0.1:3001/api/v1/calendars/${id}`,
        { calendar: { name: newName } },
        { headers },
      )

      setLocalCalendars((prevCalendars) =>
        prevCalendars.map((cal) =>
          cal.id === id ? { ...cal, name: newName } : cal,
        ),
      )
    } catch (err) {
      console.error('Failed to update calendar')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const headers = {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }

      await axios.delete(`http://127.0.0.1:3001/api/v1/calendars/${id}`, {
        headers,
      })

      setLocalCalendars((prevCalendars) => {
        const updatedCalendars = prevCalendars.filter((cal) => cal.id !== id)
        if (updatedCalendars.length > 0) {
          const firstCalendarId = updatedCalendars[0].id
          localStorage.setItem('calendar-id', firstCalendarId.toString())
          router.push(`/calendars/${firstCalendarId}`)
        } else {
          router.push('/calendars/new')
        }
        return updatedCalendars
      })
    } catch (err) {
      console.error('Failed to delete calendar')
    }
  }

  const handleLeave = async (id: number) => {
    try {
      const headers = {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }

      await axios.delete(`http://127.0.0.1:3001/api/v1/calendars/${id}/leave`, {
        headers,
      })

      setLocalCalendars((prevCalendars) => {
        const updatedCalendars = prevCalendars.filter((cal) => cal.id !== id)
        if (updatedCalendars.length > 0) {
          const firstCalendarId = updatedCalendars[0].id
          localStorage.setItem('calendar-id', firstCalendarId.toString())
          router.push(`/calendars/${firstCalendarId}`)
        } else {
          router.push('/calendars/new')
        }
        return updatedCalendars
      })
    } catch (err) {
      console.error('Failed to leave calendar')
    }
  }

  return (
    <aside className="w-[270px] max-w-xs h-screen z-40 border-r">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-foreground">
          Calendars
        </h3>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {localCalendars?.map(
              (calendar) => (
                console.log(calendar.creator_id),
                (
                  <SidebarButton
                    key={calendar.id}
                    onClick={() => handleCalendarSelect(calendar.id)}
                    onEdit={(newName) => handleEdit(calendar.id, newName)}
                    onDelete={() => handleDelete(calendar.id)}
                    onLeave={() => handleLeave(calendar.id)}
                    isCreator={calendar.creator_id === currentUserId}
                    variant={
                      pathname.startsWith(`/calendars/${calendar.id}`)
                        ? 'secondary'
                        : 'ghost'
                    }
                    className="w-full"
                  >
                    {calendar.name}
                  </SidebarButton>
                )
              ),
            )}
            {sidebarItems.extras}
          </div>
        </div>
      </div>
    </aside>
  )
}
