import api from './index'

export interface Calendar {
  id: number
  name: string
  creator_id: number
}

export const calendarApi = {
  getCalendars: async () => {
    const response = await api.get<Calendar[]>('/api/v1/calendars')
    return response.data
  },

  createCalendar: async (name: string) => {
    const response = await api.post<Calendar>('/api/v1/calendars', { name })
    return response.data
  },

  getCalendar: async (id: string) => {
    const response = await api.get<Calendar>(`/api/v1/calendars/${id}`)
    return response.data
  },
}
