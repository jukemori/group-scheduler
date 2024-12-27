'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
import api from '@/lib/api'
import { useSession } from 'next-auth/react'

export default function MembersPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [members, setMembers] = useState([])
  const [calendarTitle, setCalendarTitle] = useState('')
  const params = useParams()
  const calendarId = params.id as string
  const { data: session } = useSession()

  const fetchMembers = useCallback(async () => {
    if (!session) return
    try {
      const { data } = await api.get(`/api/v1/calendars/${calendarId}/users`)
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }, [calendarId, session])

  const fetchCalendarDetails = useCallback(async () => {
    if (!session) return
    try {
      const { data } = await api.get(`/api/v1/calendars/${calendarId}`)
      setCalendarTitle(data.name)
    } catch (error) {
      console.error('Error fetching calendar details:', error)
    }
  }, [calendarId, session])

  useEffect(() => {
    fetchMembers()
    fetchCalendarDetails()
  }, [fetchMembers, fetchCalendarDetails])

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await api.post(`/api/v1/calendars/${calendarId}/invite`, {
        calendar: { email: inviteEmail },
      })
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
            <Button type="submit" className="bg-indigo-600">
              Send Invitation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
