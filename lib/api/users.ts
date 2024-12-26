import api from './index'
import { User, ApiResponse } from './types'
import { signOut, getSession } from 'next-auth/react'

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
      await signOut({ redirect: true, callbackUrl: '/login' })
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  },
}

export const useCurrentUser = () => {
  const getCurrentUser = async () => {
    try {
      const session = await getSession()

      if (!session?.accessToken || !session?.client || !session?.uid) {
        throw new Error('No authentication session found')
      }

      return await userApi.getCurrentUser()
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  return { getCurrentUser }
}
