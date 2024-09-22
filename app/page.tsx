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
import { useRef } from 'react'
import { timelineResourceData } from './datasource'

export default function Home() {
  const ownerData = [
    { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
  ]

  const scheduleObj = useRef(null)
  const eventSettings = { dataSource: timelineResourceData }

  const onClickAdd = () => {
    let Data = [
      {
        Id: 71,
        Subject: 'Meeting',
        StartTime: new Date(2018, 3, 7, 9, 30),
        EndTime: new Date(2018, 3, 7, 10, 30),
        IsAllDay: false,
        OwnerId: 3,
      },
      {
        Id: 72,
        Subject: 'Conference',
        StartTime: new Date(2018, 3, 9, 13, 30),
        EndTime: new Date(2018, 3, 9, 16, 30),
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
        selectedDate={new Date(2018, 3, 1)}
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
