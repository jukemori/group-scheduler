import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access-token')
  const client = localStorage.getItem('client')
  const uid = localStorage.getItem('uid')

  if (accessToken && client && uid) {
    config.headers['access-token'] = accessToken
    config.headers['client'] = client
    config.headers['uid'] = uid
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const accessToken = response.headers['access-token']
    const client = response.headers['client']
    const uid = response.headers['uid']

    if (accessToken && client && uid) {
      localStorage.setItem('access-token', accessToken)
      localStorage.setItem('client', client)
      localStorage.setItem('uid', uid)
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
