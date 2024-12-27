import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, CirclePlus, Home, NotepadText, Users } from 'lucide-react'
import { useSchedule } from '@/contexts/ScheduleContext'
import { useEffect } from 'react'
import { NavUser } from './NavUser'

interface NavProps {
  calendarId: string
}

export default function Navbar({ calendarId }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { scheduleRef } = useSchedule()
  const isDashboardPage = pathname === `/calendars/${calendarId}`

  const eventButton = () => {
    if (!isDashboardPage) {
      sessionStorage.setItem('openEventEditor', 'true')
      router.push(`/calendars/${calendarId}`)
      return
    }

    let cellData = {
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 30 * 60000),
      subject: 'New Event',
    }
    scheduleRef?.current?.openEditor(cellData, 'Add')
  }

  useEffect(() => {
    if (isDashboardPage && sessionStorage.getItem('openEventEditor')) {
      sessionStorage.removeItem('openEventEditor')
      let cellData = {
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 30 * 60000),
        subject: 'New Event',
      }
      setTimeout(() => {
        scheduleRef?.current?.openEditor(cellData, 'Add')
      }, 100)
    }
  }, [isDashboardPage, scheduleRef])

  const navItems = [
    {
      icon: Home,
      href: `/calendars/${calendarId}`,
      isActive: pathname === `/calendars/${calendarId}`,
    },
    {
      icon: Bell,
      href: `/calendars/${calendarId}/notifications`,
      isActive: pathname === `/calendars/${calendarId}/notifications`,
    },
    {
      icon: CirclePlus,
      href: '#',
      eventCreate: eventButton,
    },
    {
      icon: NotepadText,
      href: `/calendars/${calendarId}/notes`,
      isActive: pathname === `/calendars/${calendarId}/notes`,
    },
    {
      icon: Users,
      href: `/calendars/${calendarId}/members`,
      isActive: pathname === `/calendars/${calendarId}/members`,
    },
  ]

  return (
    <nav className="fixed top-0 w-full bg-gray-800 text-white z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white md:self-auto flex-1 text-center md:text-left md:flex-none">
          MingleTime
        </span>
        <div className="hidden md:flex  md:order-2 items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavUser calendarId={calendarId} />
        </div>
        <div
          className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto w-full bg-gray-800 md:bg-transparent items-center justify-between md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-row justify-around font-medium p-4 md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {navItems.map(({ icon: Icon, href, isActive, eventCreate }) => (
              <li key={`${Icon.name}-${href}`}>
                {eventCreate ? (
                  <button
                    id="btn1"
                    onClick={eventCreate}
                    className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${
                      isActive
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                        : 'text-white'
                    }`}
                  >
                    <Icon />
                  </button>
                ) : (
                  <Link
                    href={href}
                    className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ${
                      isActive
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                        : 'text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
