'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Calendar {
  id: number
  name: string
  description: string
}

interface User {
  id: number
  email: string
  name: string
  calendars: Calendar[]
}

export default function Calendars() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!(accessToken && client && uid)) {
      router.push('/')
      return
    }

    try {
      const response = await axios.get('http://127.0.0.1:3001/api/v1/user', {
        headers: {
          'access-token': accessToken,
          client,
          uid,
        },
      })
      setUser(response.data)
    } catch (err) {
      setError('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleCalendarSelect = (calendarId: number) => {
    router.push(`/calendars/${calendarId}`)
  }

  if (loading) return <div>Loading user data...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user data available</div>

  return (
    <div className="calendars-container">
      <h1>Select a Calendar</h1>
      <ul>
        {user.calendars.map((calendar) => (
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
