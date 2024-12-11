import { LucideIcon, MoreHorizontal } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
import { useState } from 'react'
import { Input } from './ui/input'

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon
  onEdit?: (newName: string) => void
  onDelete?: () => void
  isEditing?: boolean
}

export function SidebarButton({
  icon: Icon,
  className,
  children,
  onEdit,
  onDelete,
  ...props
}: SidebarButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(children?.toString() || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit(editedName)
    }
    setIsEditing(false)
  }

  return (
    <DropdownMenu>
      <Button
        variant="ghost"
        className={cn('gap-2 justify-between', className)}
        {...props}
      >
        {Icon && <Icon size={20} />}
        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-6 p-0 w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <span>{children}</span>
        )}
        <DropdownMenuTrigger asChild>
          <span className="h-auto p-0 hover:bg-transparent">
            <MoreHorizontal />
          </span>
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent side="right" align="start" className="rounded-lg">
        <DropdownMenuItem onClick={() => setIsEditing(true)}>
          <span>Edit Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <span>Delete Calendar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
