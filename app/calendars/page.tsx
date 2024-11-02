'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Calendar {
  id: number
  name: string
  description: string
}

export default function Calendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchCalendars = useCallback(async () => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!(accessToken && client && uid)) {
      router.push('/')
      return
    }

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
    } catch (err) {
      setError('Failed to fetch calendars')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchCalendars()
  }, [fetchCalendars])

  const handleCalendarSelect = (calendarId: number) => {
    router.push(`/calendars/${calendarId}`)
  }

  if (loading) return <div>Loading calendars...</div>
  if (error) return <div>Error: {error}</div>
  if (calendars.length === 0) return <div>No calendars available</div>

  return (
    <div className="calendars-container">
      <h1>Select a Calendar</h1>
      <ul>
        {calendars.map((calendar) => (
          <li key={calendar.id}>
            <button onClick={() => handleCalendarSelect(calendar.id)}>
              {calendar.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
