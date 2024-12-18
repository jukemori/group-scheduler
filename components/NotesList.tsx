import { useState, useEffect, useCallback } from 'react'
import Note from './Note'

interface Note {
  id: number
  content: string
  created_at: string
  updated_at: string
  user: {
    id: number
    nickname: string
    email: string
  }
}

export default function NotesList({ calendarId }: { calendarId: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/calendars/${calendarId}/notes`,
        {
          headers: {
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
        },
      )
      const data = await response.json()
      setNotes(Array.isArray(data) ? data : [])
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
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
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
          headers: {
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
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
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
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
  }, [fetchNotes])

  return (
    <div>
      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add a new note..."
          rows={4}
        />
        <button
          onClick={createNote}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Note
        </button>
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
