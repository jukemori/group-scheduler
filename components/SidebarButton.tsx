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
  DialogTrigger,
} from './ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

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
  const [editedName, setEditedName] = useState(children?.toString() || '')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onEdit) {
      onEdit(editedName)
    }
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setTimeout(() => (document.body.style.pointerEvents = ''), 500)
    }
  }

  const handleAlertOpenChange = (open: boolean) => {
    setIsAlertOpen(open)
    if (!open) {
      setTimeout(() => (document.body.style.pointerEvents = ''), 500)
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialog open={isAlertOpen} onOpenChange={handleAlertOpenChange}>
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
            <DropdownMenuContent
              side="right"
              align="start"
              className="rounded-lg"
            >
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash2 />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Calendar</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this calendar? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
