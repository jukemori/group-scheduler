'use client'
import NotesList from '@/components/NotesList'
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
      router.push('/login')
      return
    }
  }, [router])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <NotesList calendarId={params.id as string} />
    </div>
  )
}
