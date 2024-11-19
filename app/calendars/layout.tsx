'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const calendarId = pathname.split('/')[2]

  return (
    <div className="min-h-screen">
      {/* Parent Navbar */}
      {/* <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Calendar App
          </Link>
          <div className="space-x-4">
            <Link
              href="/calendars"
              className={pathname === '/calendars' ? 'text-blue-400' : ''}
            >
              My Calendars
            </Link>
            <Link
              href="/profile"
              className={pathname === '/profile' ? 'text-blue-400' : ''}
            >
              Profile
            </Link>
          </div>
        </div>
      </nav> */}

      {/* Calendar-specific Navbar */}
      {pathname.startsWith('/calendars/') && <Navbar calendarId={calendarId} />}

      {/* Main Content */}
      <main className="max-w-screen-xl flex-center paddings mx-auto w-full flex-col">
        {children}
      </main>
    </div>
  )
}
