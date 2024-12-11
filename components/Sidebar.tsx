'use client'
import { MoreHorizontal } from 'lucide-react'
import { SidebarDesktop } from './SidebarDesktop'
import { SidebarItems } from '@/types/sidebar'
import { SidebarButton } from './SidebarButton'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Calendar {
  id: number
  name: string
}

const sidebarItems: SidebarItems = {
  calendars: [],
  // extras: (
  //   <div className="flex flex-col gap-2">
  //     <SidebarButton icon={MoreHorizontal} className="w-full">
  //       More
  //     </SidebarButton>
  //     <SidebarButton
  //       className="w-full justify-center text-white"
  //       variant="default"
  //     >
  //       Tweet
  //     </SidebarButton>
  //   </div>
  // ),
}

export function Sidebar() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const fetchCalendars = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      try {
        const response = await axios.get(
          'http://127.0.0.1:3001/api/v1/calendars',
          {
            headers: {
              'access-token': accessToken,
              client,
              uid,
            },
          },
        )
        setCalendars(response.data)
      } catch (error) {
        console.error('Failed to fetch calendars:', error)
      }
    }

    fetchCalendars()
  }, [pathname])

  return <SidebarDesktop sidebarItems={sidebarItems} calendars={calendars} />
}
