import { LucideIcon, MoreHorizontal } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon
}
export function SidebarButton({
  icon: Icon,
  className,
  children,
  ...props
}: SidebarButtonProps) {
  return (
    <DropdownMenu>
      <Button
        variant="ghost"
        className={cn('gap-2 justify-between', className)}
        {...props}
      >
        {Icon && <Icon size={20} />}
        <span>{children}</span>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="rounded-lg">
          <DropdownMenuItem>
            <span>Edit Project</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Delete Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </Button>
    </DropdownMenu>
  )
}
