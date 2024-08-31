'use client'
import {
  Day, Week, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, EventSettingsModel, ResourcesDirective, ResourceDirective, Inject
} from '@syncfusion/ej2-react-schedule';
import { timelineResourceData } from './datasource';
import { registerLicense } from '@syncfusion/ej2-base';


export default function Home() {
  registerLicense(process.env.SYNCFUSION_LICENSE || '');
  const eventSettings: EventSettingsModel = { dataSource: timelineResourceData }

  const ownerData = [
    { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
  ];

  return (
    <>
      <h2>Syncfusion React Schedule Component</h2>
      <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 3, 1)} eventSettings={eventSettings}>
        <ViewsDirective>
          <ViewDirective option='Day' />
          <ViewDirective option='Week' />
          <ViewDirective option='Month' />
          <ViewDirective option='Agenda' />
        </ViewsDirective>
        <ResourcesDirective>
          <ResourceDirective field='OwnerId' title='Owner' name='Owners' allowMultiple={true} dataSource={ownerData} textField='OwnerText' idField='Id' colorField='OwnerColor'>
          </ResourceDirective>
        </ResourcesDirective>
        <Inject services={[Day, Week, Month, Agenda]} />
      </ScheduleComponent>
    </>
  )
}