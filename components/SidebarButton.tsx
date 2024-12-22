import React, { useState, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, LogOut } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
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
  onLeave?: () => void
  isCreator?: boolean
}

let currentOpenDropdownId: string | null = null

export function SidebarButton({
  className,
  children,
  onEdit,
  onDelete,
  onLeave,
  isCreator,
  ...props
}: SidebarButtonProps) {
  const [editedName, setEditedName] = useState(children?.toString() || '')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertAction, setAlertAction] = useState<'delete' | 'leave'>('delete')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownId = React.useId()

  useEffect(() => {
    if (isDropdownOpen) {
      if (currentOpenDropdownId && currentOpenDropdownId !== dropdownId) {
        setIsDropdownOpen(false)
      }
      currentOpenDropdownId = dropdownId
    } else if (currentOpenDropdownId === dropdownId) {
      currentOpenDropdownId = null
    }
  }, [isDropdownOpen, dropdownId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onEdit) {
      onEdit(editedName)
    }
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  const handleAlertOpenChange = (open: boolean) => {
    setIsAlertOpen(open)
    if (!open) {
      setTimeout(() => (document.body.style.pointerEvents = ''), 500)
    }
  }

  const handleAlertAction = () => {
    if (alertAction === 'delete' && onDelete) {
      onDelete()
    } else if (alertAction === 'leave' && onLeave) {
      onLeave()
    }
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setTimeout(() => (document.body.style.pointerEvents = ''), 500)
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialog open={isAlertOpen} onOpenChange={handleAlertOpenChange}>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <Button
              variant="ghost"
              className={cn('gap-2 justify-between', className)}
              {...props}
            >
              <span>{children}</span>
              <DropdownMenuTrigger asChild>
                <span className="h-auto p-0 hover:bg-transparent dropdown-trigger">
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
              {!isCreator && onLeave && (
                <AlertDialogTrigger
                  asChild
                  onClick={() => setAlertAction('leave')}
                >
                  <DropdownMenuItem>
                    <LogOut />
                    <span>Leave</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
              {isCreator && (
                <AlertDialogTrigger
                  asChild
                  onClick={() => setAlertAction('delete')}
                >
                  <DropdownMenuItem>
                    <Trash2 />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {alertAction === 'delete'
                  ? 'Delete Calendar'
                  : 'Leave Calendar'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {alertAction === 'delete'
                  ? 'Are you sure you want to delete this calendar? This action cannot be undone.'
                  : "Are you sure you want to leave this calendar? You'll need to be invited again to rejoin."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertAction}>
                {alertAction === 'delete' ? 'Delete' : 'Leave'}
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

export function SidebarButtonSheet({
  className,
  children,
  onClick,
  ...props
}: SidebarButtonProps) {
  const handleMainButtonClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.dropdown-trigger')) {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    }
  }

  return (
    <SidebarButton
      {...props}
      className={className}
      onClick={handleMainButtonClick}
    >
      {children}
    </SidebarButton>
  )
}
