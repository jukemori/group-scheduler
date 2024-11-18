import { useState, useEffect, useCallback } from 'react'

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

export default function CalendarNotes({ calendarId }: { calendarId: string }) {
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendar Notes</h2>
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
            <div key={note.id} className="p-4 border rounded">
              {editingNoteId === note.id ? (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                  <div className="mt-2">
                    <button
                      onClick={() => updateNote(note.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingNoteId(null)
                        setEditingContent('')
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>By {note.user.nickname}</span>
                    <button
                      onClick={() => {
                        setEditingNoteId(note.id)
                        setEditingContent(note.content)
                      }}
                      className="ml-4 text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="ml-4 text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
