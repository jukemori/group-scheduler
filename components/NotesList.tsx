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
  const [calendarTitle, setCalendarTitle] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const getAuthHeaders = () => {
    return {
      'access-token': localStorage.getItem('access-token') || '',
      client: localStorage.getItem('client') || '',
      uid: localStorage.getItem('uid') || '',
    }
  }
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

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/notes`,
        {
          headers: getAuthHeaders(),
        },
      )
      const data = await response.json()
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
  }, [calendarId])

  const createNote = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/notes`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ calendar_note: { content: newNote } }),
        },
      )
      if (response.ok) {
        setNewNote('')
        fetchNotes()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (noteId: number) => {
    try {
      await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/notes/${noteId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        },
      )
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const updateNote = async (noteId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/notes/${noteId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ calendar_note: { content: editingContent } }),
        },
      )
      if (response.ok) {
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
            <Button>Create</Button>
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
