'use client'
import CalendarNotes from '@/components/CalendarNotes'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function NotesPage() {
  const router = useRouter()
  const params = useParams()
  const [calendarTitle, setCalendarTitle] = useState('')
  const [calendarId, setCalendarId] = useState('')

  const getAuthHeaders = () => {
    return {
      'access-token': localStorage.getItem('access-token') || '',
      client: localStorage.getItem('client') || '',
      uid: localStorage.getItem('uid') || '',
    }
  }

  const fetchCalendarDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}`,
        {
          headers: getAuthHeaders(),
        },
      )
      const data = await response.json()
      setCalendarTitle(data.name)
    } catch (error) {
      console.error('Error fetching calendar details:', error)
    }
  }, [calendarId])

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!(accessToken && client && uid)) {
      router.push('/login')
      return
    }

    setCalendarId(params.id as string)
  }, [router, params.id])

  useEffect(() => {
    if (calendarId) {
      fetchCalendarDetails()
    }
  }, [calendarId, fetchCalendarDetails])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">{calendarTitle} Notes</h2>
      <CalendarNotes calendarId={params.id as string} />
    </div>
  )
}
