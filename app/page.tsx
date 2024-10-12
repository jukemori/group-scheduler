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
import axios from 'axios'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://127.0.0.1:3001/auth/sign_in',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )

      localStorage.setItem('access-token', response.headers['access-token'])
      localStorage.setItem('client', response.headers['client'])
      localStorage.setItem('uid', response.headers['uid']) // Handle successful login (e.g., save token, redirect, etc.)
    } catch (err) {
      setError((err as any).response?.data || 'An error occurred')
    }
  }

  const [dataManager, setDataManager] = useState<DataManager | null>(null)

  useEffect(() => {
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
        ],
      }),
    )
  }, [])

  const ownerData = [
    { OwnerText: 'Nancy', Id: 5, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 6, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 7, OwnerColor: '#7499e1' },
  ]

  const eventSettings = { dataSource: dataManager }

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
    </>
  )
}
