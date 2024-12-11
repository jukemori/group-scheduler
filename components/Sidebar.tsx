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

import { SidebarButton } from './SidebarButton'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'

interface Calendar {
  id: number
  name: string
}

export function Sidebar() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const pathname = usePathname()
  const [newCalendarName, setNewCalendarName] = useState('')

  const handleCreateCalendar = async (calendarName: string) => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    try {
      const response = await axios.post(
        'http://127.0.0.1:3001/api/v1/calendars',
        { name: calendarName },
        {
          headers: {
            'access-token': accessToken,
            client,
            uid,
          },
        },
      )
      setCalendars((prevCalendars) => [...prevCalendars, response.data])
    } catch (error) {
      console.error('Failed to create calendar:', error)
    }
  }

  const sidebarItems: SidebarItems = {
    calendars: [],
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
  }, [pathname])

  return <SidebarDesktop sidebarItems={sidebarItems} calendars={calendars} />
}
