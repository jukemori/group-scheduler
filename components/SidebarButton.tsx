import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
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
import { SheetClose } from './ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from './ui/dialog'

interface SidebarButtonProps extends ButtonProps {
  onEdit?: (newName: string) => void
  onDelete?: () => void
}

export function SidebarButton({
  className,
  children,
  onEdit,
  onDelete,
  ...props
}: SidebarButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editedName, setEditedName] = useState(children?.toString() || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onEdit) {
      onEdit(editedName)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <Button
          variant="ghost"
          className={cn('gap-2 justify-between', className)}
          {...props}
        >
          <span>{children}</span>
          <DropdownMenuTrigger asChild>
            <span className="h-auto p-0 hover:bg-transparent">
              <MoreHorizontal />
            </span>
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent side="right" align="start" className="rounded-lg">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Pencil />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>
              Enter a new name for your calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <label className="block text-sm font-medium  mb-2">
                  Calendar Name
                </label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="mt-4" type="submit">
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function SidebarButtonSheet(props: SidebarButtonProps) {
  return (
    <SheetClose asChild>
      <SidebarButton {...props} />
    </SheetClose>
  )
}
