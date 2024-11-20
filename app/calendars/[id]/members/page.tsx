'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

export default function InvitationsPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [members, setMembers] = useState([])
  const params = useParams()
  const calendarId = params.id as string

  useEffect(() => {
    fetchMembers()
  }, [calendarId])

  const getAuthHeaders = () => {
    return {
      'access-token': localStorage.getItem('access-token') || '',
      client: localStorage.getItem('client') || '',
      uid: localStorage.getItem('uid') || '',
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/users`,
        {
          headers: getAuthHeaders(),
        },
      )
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await axios.post(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/invite`,
        { calendar: { email: inviteEmail } },
        { headers: getAuthHeaders() },
      )
      setSuccess('Invitation sent successfully')
      setInviteEmail('')
    } catch (error) {
      setError('Failed to send invitation')
    }
  }
  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Members</h2>
        <ul className="space-y-2">
          {members.map((member: any) => (
            <li key={member.Id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: member.OwnerColor }}
              ></div>
              <span>{member.OwnerText}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-4">Invite Users</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter email address"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Invitation
        </button>
      </form>
    </div>
  )
}
