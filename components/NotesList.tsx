import { useState, useEffect, useCallback } from 'react'
import Note from './Note'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import api from '@/lib/api'

interface Note {
  id: number
  content: string
  created_at: string
  updated_at: string
  user: {
    id: number
    nickname: string
    email: string
    photoUrl: string
  }
}

export default function NotesList({ calendarId }: { calendarId: string }) {
  const { data: session } = useSession()
  const [calendarTitle, setCalendarTitle] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const fetchCalendarDetails = useCallback(async () => {
    if (!session) return
    try {
      const { data } = await api.get(`/api/v1/calendars/${calendarId}`)
      setCalendarTitle(data.name)
    } catch (error) {
      console.error('Error fetching calendar details:', error)
    }
  }, [calendarId, session])

  const fetchNotes = useCallback(async () => {
    if (!session) return
    try {
      const { data } = await api.get(`/api/v1/calendars/${calendarId}/notes`)
      const sortedNotes = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
        : []
      setNotes(sortedNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setNotes([])
    }
  }, [calendarId, session])

  const createNote = async () => {
    if (!session) return
    try {
      const response = await api.post(`/api/v1/calendars/${calendarId}/notes`, {
        calendar_note: { content: newNote },
      })
      if (response.status === 201 || response.status === 200) {
        setNewNote('')
        fetchNotes()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (noteId: number) => {
    try {
      await api.delete(`/api/v1/calendars/${calendarId}/notes/${noteId}`)
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const updateNote = async (noteId: number) => {
    try {
      const response = await api.put(
        `/api/v1/calendars/${calendarId}/notes/${noteId}`,
        {
          calendar_note: { content: editingContent },
        },
      )
      if (response.status === 200 || response.status === 204) {
        setEditingNoteId(null)
        setEditingContent('')
        fetchNotes()
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  useEffect(() => {
    fetchNotes()
    fetchCalendarDetails()
  }, [fetchNotes, fetchCalendarDetails])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{calendarTitle} Notes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600">Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Add your note content below. You can include any important
                information or reminders.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Add a new note..."
              rows={4}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={createNote}>Create</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {Array.isArray(notes) &&
          notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              editingNoteId={editingNoteId}
              editingContent={editingContent}
              setEditingNoteId={setEditingNoteId}
              setEditingContent={setEditingContent}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          ))}
      </div>
    </div>
  )
}
