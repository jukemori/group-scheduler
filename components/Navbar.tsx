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
    <nav className="fixed top-0 w-full z-50 border-b border-background bg-card shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary md:self-auto flex-1 text-center md:text-left md:flex-none">
          MingleTime
        </span>
        <div className="hidden md:flex  md:order-2 items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavUser calendarId={calendarId} />
        </div>
        <div
          className="fixed border-t border-background md:border-none md:relative bottom-0 left-0 right-0 md:bottom-auto w-full items-center justify-between md:flex md:w-auto md:order-1 bg-card shadow md:shadow-none"
          id="navbar-user"
        >
          <ul className="flex flex-row justify-around font-medium p-4 md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {navItems.map(({ icon: Icon, href, isActive, eventCreate }) => (
              <li key={`${Icon.name}-${href}`}>
                {eventCreate ? (
                  <button
                    id="btn1"
                    onClick={eventCreate}
                    className={`block py-2 px-3 rounded hover:bg-background md:hover:bg-transparent md:hover:primary md:p-0 ${
                      isActive ? ' text-primary font-bold' : ''
                    }`}
                  >
                    <Icon strokeWidth={isActive ? 2.5 : 2} />
                  </button>
                ) : (
                  <Link
                    href={href}
                    className={`block py-2 px-3 rounded hover:bg-background md:hover:bg-transparent md:hover:primary md:p-0  ${
                      isActive ? ' text-primary font-bold' : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon strokeWidth={isActive ? 2.5 : 2} />
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
