import { useState, useEffect } from 'react'

interface User {
  id: number
  nickname: string
  email: string
  photo_url: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:3001/api/v1/users/show', {
      headers: {
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching user:', err)
        setLoading(false)
      })
  }, [])

  return { user, loading }
}
