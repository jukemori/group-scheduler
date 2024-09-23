'use client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
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
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const scheduleObj = useRef(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resourceData, setResourceData] = useState([])

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/users/6')

        if (!response.ok) {
          throw new Error('Failed to fetch user details')
        }

        const data = await response.json()
        setUser(data) // Set user data to state

        const eventsData = data.calendars.flatMap((calendar) =>
          calendar.events.map((event) => ({
            Id: event.id,
            Subject: event.subject,
            StartTime: new Date(event.start_time),
            EndTime: new Date(event.end_time),
            IsAllDay: event.is_all_day,
            OwnerId: event.owner_id,
          })),
        )
        setResourceData(eventsData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const ownerData = [
    { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
  ]

  const eventSettings = { dataSource: resourceData }
  console.log('eventSettings', eventSettings)

  const onClickAdd = () => {
    let Data = [
      {
        Id: 71,
        Subject: 'Meeting',
        StartTime: new Date(2024, 8, 7, 9, 30),
        EndTime: new Date(2024, 8, 7, 10, 30),
        IsAllDay: false,
        OwnerId: 3,
      },
      {
        Id: 72,
        Subject: 'Conference',
        StartTime: new Date(2024, 8, 9, 13, 30),
        EndTime: new Date(2024, 8, 9, 16, 30),
        IsAllDay: false,
        OwnerId: 2,
      },
    ]
    scheduleObj.current.addEvent(Data)
  }
  const onClickSave = () => {
    let Data = {
      Id: 61,
      Subject: 'Testing-edited',
      StartTime: new Date(2018, 3, 4, 10, 30),
      EndTime: new Date(2018, 3, 4, 11, 30),
      IsAllDay: false,
      OwnerId: 2,
    }
    scheduleObj.current.saveEvent(Data)
  }
  const onClickDelete = () => {
    scheduleObj.current.deleteEvent(62)
  }

  console.log('scheduleObj', scheduleObj)
  return (
    <>
      <div>
        <h1>
          {user.name} (#{user.id})
        </h1>
        <p>Email: {user.email}</p>
        <p>Nickname: {user.nickname}</p>
        <h2>Calendars</h2>
        {user.calendars.map((calendar) => (
          <div key={calendar.id}>
            <h3>{calendar.name}</h3>
            <p>{calendar.description}</p>
            <h4>Events</h4>
            {calendar.events.map((event) => (
              <div key={event.id}>
                <p>
                  {event.subject} - {event.start_time}
                </p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2>Syncfusion React Schedule Component</h2>
      <ButtonComponent id="add" title="Add" onClick={onClickAdd}>
        Add
      </ButtonComponent>
      <ButtonComponent id="edit" title="Edit" onClick={onClickSave}>
        Edit
      </ButtonComponent>
      <ButtonComponent id="delete" title="Delete" onClick={onClickDelete}>
        Delete
      </ButtonComponent>
      <ScheduleComponent
        ref={scheduleObj}
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
    </>
  )
}
