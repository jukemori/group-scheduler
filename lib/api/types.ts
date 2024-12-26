declare module 'next-auth' {
  interface Session {
    accessToken?: string
    client?: string
    uid?: string
    user?: {
      id?: number
      name?: string
      email?: string
      image?: string
      nickname?: string
      photo_url?: string
    }
  }
}

export interface User {
  id: number
  name: string
  nickname: string
  email: string
  color?: string
  photo_url?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthHeaders {
  'access-token': string
  client: string
  uid: string
}
