import api from './index'

export const notificationsApi = {
  getNotifications: () => {
    return api.get('/api/v1//users/notifications')
  },

  acceptInvitation: (calendarId: string) => {
    return api.post(`/api/v1/calendars/${calendarId}/accept_invitation`)
  },

  rejectInvitation: (calendarId: string) => {
    return api.post(`/api/v1/calendars/${calendarId}/reject_invitation`)
  },
}
