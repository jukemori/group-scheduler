'use client'

import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api/users'
import type { User } from '@/lib/api/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'

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
  const [tempColor, setTempColor] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userApi.getCurrentUser()
        setUser(user)
        setTempColor(user.color || '')
        if (user.photo_url) {
          setPhotoPreview(user.photo_url)
        }
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
      const file = e.target.files[0]
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    return () => {
      if (photoPreview && !photoPreview.includes('http')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const handlePasswordChange = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(passwords).forEach(([key, value]) => {
        formData.append(`user[${key}]`, value)
      })

      await userApi.updateUser(formData)
      setSuccess('Password updated successfully')
      setPasswords({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (err) {
      setError('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('user[color]', tempColor)

      await userApi.updateUser(formData)
      setUser({ ...user, color: tempColor })
      setSuccess('Color updated successfully')
    } catch (err) {
      setError('Failed to update color')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

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
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium  mb-2">Photo</label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <Avatar className="w-12 h-12">
                  <AvatarImage src={photoPreview} />
                  <AvatarFallback style={{ backgroundColor: user.color }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    document.getElementById('photo-upload')?.click()
                  }
                >
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium  mb-2">Name</label>
            <Input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-2">Nickname</label>
            <Input
              type="text"
              value={user.nickname}
              onChange={(e) => setUser({ ...user, nickname: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-2">Email</label>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-2">Password</label>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Current Password
                    </label>
                    <Input
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
                    <label className="block text-sm font-medium  mb-2">
                      New Password
                    </label>
                    <Input
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
                    <label className="block text-sm font-medium  mb-2">
                      Confirm New Password
                    </label>
                    <Input
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
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" onClick={handlePasswordChange}>
                      Save Changes
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <label className="block text-sm font-medium  mb-2">Color</label>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4 cursor-pointer">
                  <div
                    className="w-12 h-12 rounded-full border-2"
                    style={{ backgroundColor: user.color || '#000000' }}
                  />
                  <Button variant="secondary" type="button">
                    Change Color
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose Color</DialogTitle>
                  <DialogDescription>
                    Select a color for your profile
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      '#FF0000',
                      '#FFA500',
                      '#00BFFF',
                      '#000080',
                      '#006400',
                      '#00FF00',
                      '#FF69B4',
                      '#800080',
                    ].map((color) => (
                      <button
                        key={color}
                        className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${
                          tempColor === color
                            ? 'border-gray-900'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setTempColor(color)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={handleColorChange}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Color'}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <Button type="submit" className="bg-indigo-600">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
