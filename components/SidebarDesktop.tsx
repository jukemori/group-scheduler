'use client'
import { SidebarButton } from './SidebarButton'
import { SidebarItems, Calendar } from '@/types/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api/users'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'

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
  const { data: session } = useSession()
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
      await api.put(`/api/v1/calendars/${id}`, {
        calendar: { name: newName },
      })

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
      await api.delete(`/api/v1/calendars/${id}`)

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
      await api.delete(`/api/v1/calendars/${id}/leave`)

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
    <aside className="w-[270px] max-w-xs h-screen z-40 border-r fixed top-16 pt-4">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-foreground">
          Calendars
        </h3>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {localCalendars?.map((calendar) => (
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
            ))}
            {sidebarItems.extras}
          </div>
        </div>
      </div>
    </aside>
  )
}
