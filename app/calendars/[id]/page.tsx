'use client'
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data'
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
import { useSchedule } from '@/contexts/ScheduleContext'
export default function Dashboard() {
  const [dataManager, setDataManager] = useState<DataManager>()
  const [ownerData, setOwnerData] = useState([])
  const router = useRouter()
  const params = useParams()
  const { scheduleRef } = useSchedule()

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/v1/calendars/${params.id}/users`,
          {
            headers: {
              'access-token': localStorage.getItem('access-token') || '',
              client: localStorage.getItem('client') || '',
              uid: localStorage.getItem('uid') || '',
            },
          },
        )
        const data = await response.json()
        setOwnerData(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const initializeDataManager = () => {
      setDataManager(
        new DataManager({
          url: 'http://127.0.0.1:3001/api/v1/events',
          crudUrl: 'http://127.0.0.1:3001/api/v1/events',
          adaptor: new UrlAdaptor(),
          crossDomain: true,
          headers: [
            { 'access-token': localStorage.getItem('access-token') || '' },
            { client: localStorage.getItem('client') || '' },
            { uid: localStorage.getItem('uid') || '' },
            { 'calendar-id': localStorage.getItem('calendar-id') || '' },
          ],
        }),
      )
    }

    if (!(accessToken && client && uid)) {
      router.push('/')
    } else {
      fetchUsers()
      setTimeout(() => {
        initializeDataManager()
      }, 100)
    }
  }, [router, params.id])

  const eventSettings: EventSettingsModel = { dataSource: dataManager }

  return (
    <>
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
    </>
  )
}
