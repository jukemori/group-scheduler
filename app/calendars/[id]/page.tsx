'use client'
import {
  Agenda,
  Day,
  Inject,
  Month,
  ResourceDirective,
  ResourcesDirective,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  EventSettingsModel,
  Week,
} from '@syncfusion/ej2-react-schedule'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSchedule } from '@/contexts/ScheduleContext'
import api from '@/lib/api'
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data'
import { ScheduleSkeleton } from '@/components/loading/ScheduleSkeleton'

export default function Dashboard() {
  const [dataManager, setDataManager] = useState<DataManager>()
  const [ownerData, setOwnerData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { scheduleRef } = useSchedule()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })

  useEffect(() => {
    if (status === 'loading') return

    const fetchUsers = async () => {
      try {
        const { data } = await api.get(`/api/v1/calendars/${params.id}/users`)
        setOwnerData(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const initializeDataManager = () => {
      if (!localStorage.getItem('calendar-id')) {
        localStorage.setItem('calendar-id', params.id as string)
      }

      setDataManager(
        new DataManager({
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
          crudUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
          adaptor: new UrlAdaptor(),
          crossDomain: true,
          headers: [
            { 'access-token': session?.accessToken || '' },
            { client: session?.client || '' },
            { uid: session?.uid || '' },
            { 'calendar-id': params.id as string },
          ],
        }),
      )
      setIsLoading(false)
    }

    fetchUsers()
    initializeDataManager()
  }, [params.id, session, status])

  if (isLoading || !dataManager || ownerData.length === 0) {
    return <ScheduleSkeleton />
  }

  const eventSettings: EventSettingsModel = { dataSource: dataManager }

  return (
    <ScheduleComponent
      ref={scheduleRef}
      width="100%"
      height="550px"
      selectedDate={new Date()}
      eventSettings={eventSettings}
      currentView="Month"
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
        <ViewDirective option="Agenda" />
      </ViewsDirective>
      <ResourcesDirective>
        <ResourceDirective
          field="OwnerId"
          title="Owner"
          name="Owners"
          allowMultiple={true}
          dataSource={ownerData}
          textField="OwnerText"
          idField="Id"
          colorField="OwnerColor"
        ></ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, Month, Agenda]} />
    </ScheduleComponent>
  )
}
