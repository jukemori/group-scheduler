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
  Week,
} from '@syncfusion/ej2-react-schedule'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function Dashboard() {
  const [dataManager, setDataManager] = useState<DataManager | null>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!(accessToken && client && uid)) {
      router.push('/')
    } else {
      initializeDataManager()
    }
  }, [router, params.id])

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

  const ownerData = [
    { OwnerText: 'Nancy', Id: 5, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 6, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 7, OwnerColor: '#7499e1' },
  ]

  const eventSettings = { dataSource: dataManager }

  return (
    <ScheduleComponent
      width="100%"
      height="550px"
      selectedDate={new Date(2024, 8, 1)}
      eventSettings={eventSettings}
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
