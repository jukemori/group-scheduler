import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, CirclePlus, Home, NotepadText, Users } from 'lucide-react'
import { useSchedule } from '@/contexts/ScheduleContext'
import { useEffect } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { NavUser } from './NavUser'

interface NavProps {
  calendarId: string
}

export default function Navbar({ calendarId }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { scheduleRef } = useSchedule()
  const isDashboardPage = pathname === `/calendars/${calendarId}`
  const { user, loading } = useCurrentUser()

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
    <nav className="bg-gray-800 text-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          {/* <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          /> */}
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            MingleTime
          </span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavUser calendarId={calendarId} />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
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
