import { MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface NoteProps {
  note: {
    id: number
    content: string
    created_at: string
    user: {
      id: number
      nickname: string
      email: string
      photoUrl: string
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
    <div>
      {editingNoteId === note.id ? (
        <Card className="relative">
          <CardHeader>
            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                  setEditingNoteId(null)
                  setEditingContent('')
                }}
              >
                <X size={16} color="gray" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none"
              rows={4}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => updateNote(note.id)}>Save</Button>
          </CardFooter>
        </Card>
      ) : (
        <DropdownMenu>
          <Card className="relative">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={note.user.photoUrl} />
                  <AvatarFallback>
                    {note.user?.nickname?.substring(0, 2) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{note.user.nickname}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{note.content}</p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-gray-500">
                {format(new Date(note.created_at), 'MMMM d, yyyy')}
              </span>
            </CardFooter>
            <DropdownMenuTrigger asChild>
              <span className="h-auto p-0 hover:bg-transparent absolute top-2 right-3 hover:cursor-pointer">
                <MoreHorizontal />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setEditingNoteId(note.id)
                  setEditingContent(note.content)
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteNote(note.id)}>
                <Trash2 />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </Card>
        </DropdownMenu>
      )}
    </div>
  )
}
