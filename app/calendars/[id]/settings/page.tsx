'use client'

import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api/users'
import type { User } from '@/lib/api/types'

export default function EditUserPage() {
  const [user, setUser] = useState<Partial<User>>({
    name: '',
    nickname: '',
    email: '',
    color: '',
  })
  const [passwords, setPasswords] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userApi.getCurrentUser()
        setUser(user)
      } catch (err) {
        setError('Failed to load user data')
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(user).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(`user[${key}]`, value as string)
        }
      })

      if (passwords.current_password) {
        Object.entries(passwords).forEach(([key, value]) => {
          formData.append(`user[${key}]`, value)
        })
      }

      if (photo) {
        formData.append('user[photo]', photo)
      }

      await userApi.updateUser(formData)
      setSuccess('User updated successfully')
      setPasswords({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (err) {
      setError('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Nickname</label>
          <input
            type="text"
            value={user.nickname}
            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Current Password</label>
          <input
            type="password"
            value={passwords.current_password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                current_password: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            value={passwords.password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                password: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            minLength={6}
          />
        </div>

        <div>
          <label className="block mb-2">Confirm New Password</label>
          <input
            type="password"
            value={passwords.password_confirmation}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                password_confirmation: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            minLength={6}
          />
        </div>

        <div>
          <label className="block mb-2">Color</label>
          <input
            type="color"
            value={user.color || '#000000'}
            onChange={(e) => setUser({ ...user, color: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}
