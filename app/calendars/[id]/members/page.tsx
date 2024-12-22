'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

export default function MembersPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [members, setMembers] = useState([])
  const [calendarTitle, setCalendarTitle] = useState('')
  const params = useParams()
  const calendarId = params.id as string

  const getAuthHeaders = () => {
    return {
      'access-token': localStorage.getItem('access-token') || '',
      client: localStorage.getItem('client') || '',
      uid: localStorage.getItem('uid') || '',
    }
  }

  const fetchMembers = useCallback(async () => {
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
  }, [calendarId])

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
    fetchMembers()
    fetchCalendarDetails()
  }, [fetchMembers, fetchCalendarDetails])

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
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Current Members</h2>
        <ul className="flex flex-wrap gap-4">
          {members.map((member: any) => (
            <li key={member.Id} className="flex flex-col items-center gap-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.OwnerPhotoUrl} />
                <AvatarFallback style={{ backgroundColor: member.OwnerColor }}>
                  {member.OwnerText.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{member.OwnerText}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card className="max-w-lg shadow-none bg-gray-50">
        <form onSubmit={handleInvite}>
          <CardHeader>
            <CardTitle>Invite Users to {calendarTitle}</CardTitle>
            <CardDescription>Share your calendar with friends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-500 p-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 mb-4 bg-white"
                placeholder="Enter email address"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Send Invitation</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
