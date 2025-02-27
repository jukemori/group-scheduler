'use client'

import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { userApi } from '@/lib/api/users'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { User } from '@/lib/api/types'
import { SheetClose } from '@/components/ui/sheet'
import { useMediaQuery } from 'usehooks-ts'
import { Skeleton } from '@/components/ui/skeleton'

export function NavUser({ calendarId }: { calendarId: string }) {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<User | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated') {
        try {
          const user = await userApi.getCurrentUser()
          setUserData(user)
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    }

    fetchUser()
  }, [status])

  if (status === 'loading' || !userData) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await userApi.logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userData.photo_url} alt={userData.name} />
            {!userData.photo_url && (
              <AvatarFallback
                className="rounded-lg"
                style={{ backgroundColor: userData.color }}
              >
                {userData.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{userData.nickname}</span>
            <span className="truncate text-xs">{userData.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userData.photo_url} alt={userData.name} />
              {!userData.photo_url && (
                <AvatarFallback
                  className="rounded-lg"
                  style={{ backgroundColor: userData.color }}
                >
                  {userData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {userData.nickname}
              </span>
              <span className="truncate text-xs">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isMobile ? (
            <SheetClose asChild>
              <Link href={`/calendars/${calendarId}/settings`}>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </Link>
            </SheetClose>
          ) : (
            <Link href={`/calendars/${calendarId}/settings`}>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
