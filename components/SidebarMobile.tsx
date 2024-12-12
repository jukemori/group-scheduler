'use client'
import { Calendar, SidebarItems } from '../types/sidebar'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { SidebarButtonSheet as SidebarButton } from './SidebarButton'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface SidebarMobileProps {
  sidebarItems: SidebarItems
  calendars: Calendar[]
}

export function SidebarMobile({ sidebarItems, calendars }: SidebarMobileProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [localCalendars, setLocalCalendars] = useState<Calendar[]>(calendars)

  useEffect(() => {
    setLocalCalendars(calendars)
  }, [calendars])

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
    if (!window.confirm('Are you sure you want to delete this calendar?'))
      return

    try {
      const headers = {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }

      await axios.delete(`http://127.0.0.1:3001/api/v1/calendars/${id}`, {
        headers,
      })

      setLocalCalendars((prevCalendars) =>
        prevCalendars.filter((cal) => cal.id !== id),
      )
    } catch (err) {
      console.error('Failed to delete calendar')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="fixed top-3 left-3">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4">
        <SheetHeader className="flex flex-row justify-between items-center space-y-0">
          <span className="text-lg font-semibold text-foreground mx-3">
            Calendars
          </span>
        </SheetHeader>
        <div className="h-full">
          <div className="mt-5 flex flex-col w-full gap-1">
            {localCalendars?.map((calendar) => (
              <SidebarButton
                key={calendar.id}
                onClick={() => handleCalendarSelect(calendar.id)}
                onEdit={(newName) => handleEdit(calendar.id, newName)}
                onDelete={() => handleDelete(calendar.id)}
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
          <div className="absolute w-full bottom-4 px-1 left-0"></div>
        </div>
      </SheetContent>
    </Sheet>
  )
}