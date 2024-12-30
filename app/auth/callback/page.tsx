'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { calendarApi } from '@/lib/api/calendars'

export default function AuthCallback() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        try {
          const calendars = await calendarApi.getCalendars()
          if (calendars && calendars.length > 0) {
            router.push(`/calendars/${calendars[0].id}`)
          } else {
            router.push('/calendars/new')
          }
        } catch (error) {
          console.error('Error fetching calendars:', error)
          router.push('/calendars/new')
        }
      }
    }

    handleRedirect()
  }, [status, session, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  )
}
