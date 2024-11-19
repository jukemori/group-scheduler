'use client'
import CalendarNotes from '@/components/CalendarNotes'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotesPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!(accessToken && client && uid)) {
      router.push('/')
    }
  }, [router])

  return (
    <div className="container mx-auto p-4">
      <CalendarNotes calendarId={params.id as string} />
    </div>
  )
}
