import { ReactNode } from 'react'
export interface SidebarItems {
  calendars: Array<{
    id: number
    name: string
  }>
  extras?: ReactNode
}

export interface Calendar {
  id: number
  name: string
  creator_id: number
}
