'use client'
import NotesList from '@/components/NotesList'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function NotesPage() {
  const router = useRouter()
  const params = useParams()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4">
      <NotesList calendarId={params.id as string} />
    </div>
  )
}
