interface NoteProps {
  note: {
    id: number
    content: string
    user: {
      nickname: string
    }
  }
  editingNoteId: number | null
  editingContent: string
  setEditingNoteId: (id: number | null) => void
  setEditingContent: (content: string) => void
  updateNote: (noteId: number) => Promise<void>
  deleteNote: (noteId: number) => Promise<void>
}

export default function Note({
  note,
  editingNoteId,
  editingContent,
  setEditingNoteId,
  setEditingContent,
  updateNote,
  deleteNote,
}: NoteProps) {
  return (
    <div className="p-4 border rounded">
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
  )
}
