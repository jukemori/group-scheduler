'use client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
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
  Schedule,
} from '@syncfusion/ej2-react-schedule'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const scheduleObj = useRef(null)
  const [resourceData, setResourceData] = useState([])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:3001/users/sign_in', {
        user: {
          email,
          password,
        },
      })
      // Handle successful login (e.g., save token, redirect, etc.)
      console.log('Login successful:', response.data)
    } catch (err) {
      setError(err.response.data)
    }
  }

  const dataManager = new DataManager({
    url: 'http://127.0.0.1:3001/api/v1/events',
    crudUrl: 'http://127.0.0.1:3001/api/v1/events',
    adaptor: new UrlAdaptor(),
    crossDomain: true,
  })

  const ownerData = [
    { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
  ]

  const eventSettings = { dataSource: dataManager }
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

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
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
