import { createContext, useContext } from 'react'
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule'

interface ScheduleContextType {
  scheduleRef: React.RefObject<ScheduleComponent> | null
}

export const ScheduleContext = createContext<ScheduleContextType>({
  scheduleRef: null,
})

export const useSchedule = () => useContext(ScheduleContext)
