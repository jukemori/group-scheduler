'use client'
import { SidebarDesktop } from './SidebarDesktop'
import { Button } from './ui/button'
import { SidebarItems } from '@/types/sidebar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useMediaQuery } from 'usehooks-ts'
import { SidebarMobile } from './SidebarMobile'
import { useSession } from 'next-auth/react'
import { calendarApi } from '@/lib/api/calendars'
import { Calendar } from '@/lib/api/calendars'

export function Sidebar() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const pathname = usePathname()
  const [newCalendarName, setNewCalendarName] = useState('')
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  })
  const { data: session, status } = useSession()

  const handleCreateCalendar = async (calendarName: string) => {
    try {
      const newCalendar = await calendarApi.createCalendar(calendarName)
      setCalendars((prevCalendars) => [...prevCalendars, newCalendar])
      setNewCalendarName('')
    } catch (error) {
      console.error('Failed to create calendar:', error)
    }
  }

  useEffect(() => {
    const fetchCalendars = async () => {
      if (status !== 'authenticated') return

      try {
        const fetchedCalendars = await calendarApi.getCalendars()
        setCalendars(fetchedCalendars)
      } catch (error) {
        console.error('Failed to fetch calendars:', error)
      }
    }

    fetchCalendars()
  }, [status])

  const sidebarItems: SidebarItems = {
    calendars: calendars.map((calendar) => ({
      id: calendar.id,
      name: calendar.name,
      href: `/calendars/${calendar.id}`,
    })),
    extras: (
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Create New Calendar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Calendar</DialogTitle>
              <DialogDescription>
                Enter the name of the new calendar.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateCalendar(newCalendarName)
              }}
            >
              <Input
                className="mb-4"
                type="text"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                placeholder="Calendar Name"
                required
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Create</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    ),
  }

  return isDesktop ? (
    <SidebarDesktop sidebarItems={sidebarItems} calendars={calendars} />
  ) : (
    <SidebarMobile sidebarItems={sidebarItems} calendars={calendars} />
  )
}
