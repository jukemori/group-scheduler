'use client'
import { Calendar, SidebarItems } from '../types/sidebar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { SidebarButtonSheet as SidebarButton } from './SidebarButton'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/api'
import { NavUser } from '@/components/NavUser'
import { userApi } from '@/lib/api/users'
import { SidebarSkeleton } from '@/components/loading/SidebarSkeleton'

interface SidebarMobileProps {
  sidebarItems: SidebarItems
  calendars: Calendar[]
  isLoading: boolean
}

export function SidebarMobile({
  sidebarItems,
  calendars,
  isLoading,
}: SidebarMobileProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [localCalendars, setLocalCalendars] = useState<Calendar[]>(calendars)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const { data: session } = useSession()
  const [calendarId, setCalendarId] = useState<string>('')

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

  useEffect(() => {
    setCalendarId(localStorage.getItem('calendar-id') || '')
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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="fixed top-3 left-3 z-50">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4 bg-card">
        <SheetHeader className="flex flex-row justify-between items-center space-y-0">
          <span className="text-lg font-semibold text-foreground mx-3">
            Calendars
          </span>
        </SheetHeader>
        <div className="h-full flex flex-col">
          <div className="mt-5 flex flex-col w-full gap-1">
            {isLoading ? (
              [...Array(3)].map((_, index) => <SidebarSkeleton key={index} />)
            ) : (
              <>
                {localCalendars?.map((calendar) => (
                  <SheetClose asChild key={calendar.id}>
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
                  </SheetClose>
                ))}
                {sidebarItems.extras}
              </>
            )}
          </div>
          <div className="mt-auto pb-4">
            <NavUser calendarId={calendarId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
