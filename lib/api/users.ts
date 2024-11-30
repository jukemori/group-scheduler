import api from './index'
import { User, ApiResponse } from './types'

export const userApi = {
  getCurrentUser: async () => {
    const response = await api.get<User>('/api/v1/users/show')
    return response.data
  },

  updateUser: async (userData: FormData) => {
    const response = await api.patch<User>('/api/v1/users/update', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getNotifications: async () => {
    const response = await api.get('/api/v1/users/notifications')
    return response.data
  },

  logout: async () => {
    try {
      await api.get('/api/v1/auth/sign_out')
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
      window.location.href = '/'
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  },
}

// Add a custom hook for getting the current user
export const useCurrentUser = () => {
  const getCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      if (!accessToken || !client || !uid) {
        throw new Error('No authentication tokens found')
      }

      return await userApi.getCurrentUser()
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  return { getCurrentUser }
}
