'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Calendar {
  id: number
  name: string
  description: string
}

interface CalendarInvitation {
  id: number
  user_id: number
  status: string | null
  created_at: string
  updated_at: string
  calendar: {
    id: number
    name: string
    description: string
  }
}

export default function Calendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newCalendar, setNewCalendar] = useState({ name: '', description: '' })
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null)
  const [isInviting, setIsInviting] = useState<boolean>(false)
  const [inviteEmail, setInviteEmail] = useState<string>('')
  const [currentCalendar, setCurrentCalendar] = useState<number | null>(null)
  const [pendingInvitations, setPendingInvitations] = useState<
    CalendarInvitation[]
  >([])
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

  const fetchPendingInvitations = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:3001/api/v1/calendar_invitations',
        { headers: getAuthHeaders() },
      )
      setPendingInvitations(response.data)
    } catch (err) {
      setError('Failed to fetch invitations')
    }
  }, [])

  useEffect(() => {
    fetchCalendars()
    fetchPendingInvitations()
  }, [fetchCalendars, fetchPendingInvitations])

  const handleCalendarSelect = (calendarId: number) => {
    localStorage.setItem('calendar-id', calendarId.toString())
    router.push(`/calendars/${calendarId}`)
  }

  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    return {
      'access-token': accessToken,
      client,
      uid,
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://127.0.0.1:3001/api/v1/calendars',
        { calendar: newCalendar },
        { headers: getAuthHeaders() },
      )
      setCalendars([...calendars, response.data])
      setIsCreating(false)
      setNewCalendar({ name: '', description: '' })
    } catch (err) {
      setError('Failed to create calendar')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCalendar) return

    try {
      const response = await axios.put(
        `http://127.0.0.1:3001/api/v1/calendars/${editingCalendar.id}`,
        { calendar: editingCalendar },
        { headers: getAuthHeaders() },
      )
      setCalendars(
        calendars.map((cal) =>
          cal.id === editingCalendar.id ? response.data : cal,
        ),
      )
      setEditingCalendar(null)
    } catch (err) {
      setError('Failed to update calendar')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this calendar?'))
      return

    try {
      await axios.delete(`http://127.0.0.1:3001/api/v1/calendars/${id}`, {
        headers: getAuthHeaders(),
      })
      setCalendars(calendars.filter((cal) => cal.id !== id))
    } catch (err) {
      setError('Failed to delete calendar')
    }
  }

  const handleInvite = async (e: React.FormEvent, calendarId: number) => {
    e.preventDefault()
    try {
      await axios.post(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/invite`,
        { calendar: { email: inviteEmail } },
        { headers: getAuthHeaders() },
      )
      setIsInviting(false)
      setInviteEmail('')
      setCurrentCalendar(null)
    } catch (err) {
      setError('Failed to invite user')
    }
  }

  const handleAcceptInvitation = async (calendarId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/accept_invitation`,
        {},
        { headers: getAuthHeaders() },
      )
      // Refresh invitations and calendars
      fetchPendingInvitations()
      fetchCalendars()
    } catch (err) {
      setError('Failed to accept invitation')
    }
  }

  const handleRejectInvitation = async (calendarId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/reject_invitation`,
        {},
        { headers: getAuthHeaders() },
      )
      // Refresh invitations
      fetchPendingInvitations()
    } catch (err) {
      setError('Failed to reject invitation')
    }
  }

  if (loading) return <div>Loading calendars...</div>
  if (error) return <div>Error: {error}</div>
  if (calendars.length === 0) return <div>No calendars available</div>

  return (
    <div className="calendars-container p-4">
      <h1 className="text-2xl font-bold mb-4">Calendars</h1>

      <button
        onClick={() => setIsCreating(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Calendar
      </button>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Calendar Name"
            value={newCalendar.name}
            onChange={(e) =>
              setNewCalendar({ ...newCalendar, name: e.target.value })
            }
            className="block w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newCalendar.description}
            onChange={(e) =>
              setNewCalendar({ ...newCalendar, description: e.target.value })
            }
            className="block w-full p-2 border rounded"
          />
          <div className="space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isInviting && (
        <form
          onSubmit={(e) => handleInvite(e, currentCalendar!)}
          className="mb-4 space-y-2"
        >
          <input
            type="email"
            placeholder="Enter email to invite"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
          <div className="space-x-2">
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Send Invite
            </button>
            <button
              type="button"
              onClick={() => {
                setIsInviting(false)
                setInviteEmail('')
                setCurrentCalendar(null)
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pending Invitations</h2>
          <ul className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <li key={invitation.id} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {invitation.calendar.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: {invitation.status || 'pending'}
                    </p>
                  </div>
                  {(!invitation.status || invitation.status === 'pending') && (
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleAcceptInvitation(invitation.calendar.id)
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRejectInvitation(invitation.calendar.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="space-y-4">
        {calendars.map((calendar) => (
          <li key={calendar.id} className="border p-4 rounded">
            {editingCalendar?.id === calendar.id ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <input
                  type="text"
                  value={editingCalendar.name}
                  onChange={(e) =>
                    setEditingCalendar({
                      ...editingCalendar,
                      name: e.target.value,
                    })
                  }
                  className="block w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={editingCalendar.description}
                  onChange={(e) =>
                    setEditingCalendar({
                      ...editingCalendar,
                      description: e.target.value,
                    })
                  }
                  className="block w-full p-2 border rounded"
                />
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCalendar(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{calendar.name}</h2>
                  <p className="text-gray-600">{calendar.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleCalendarSelect(calendar.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingCalendar(calendar)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(calendar.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setIsInviting(true)
                      setCurrentCalendar(calendar.id)
                    }}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                  >
                    Invite
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
