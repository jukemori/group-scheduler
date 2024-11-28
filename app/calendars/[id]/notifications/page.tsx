'use client'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Notifications from '@/components/Notifications'
import { Toaster } from 'react-hot-toast'

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

export default function NotificationsPage() {
  const [pendingInvitations, setPendingInvitations] = useState<
    CalendarInvitation[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  const fetchPendingInvitations = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:3001/api/v1/calendar_invitations',
        { headers: getAuthHeaders() },
      )
      setPendingInvitations(response.data)
    } catch (err) {
      setError('Failed to fetch invitations')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAcceptInvitation = async (calendarId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/accept_invitation`,
        {},
        { headers: getAuthHeaders() },
      )
      fetchPendingInvitations()
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
      fetchPendingInvitations()
    } catch (err) {
      setError('Failed to reject invitation')
    }
  }

  useEffect(() => {
    fetchPendingInvitations()
  }, [fetchPendingInvitations])

  if (loading) return <div>Loading notifications...</div>
  if (error) return <div>Error: {error}</div>
  // if (pendingInvitations.length === 0) return <div>No pending invitations</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <Toaster position="top-right" />
      <Notifications />
      <ul className="space-y-4">
        {pendingInvitations.map((invitation) => (
          <li key={invitation.id} className="border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{invitation.calendar.name}</h3>
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
  )
}
