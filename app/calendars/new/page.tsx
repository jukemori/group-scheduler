'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calendarApi } from '@/lib/api/calendars'

export default function NewCalendar() {
  const [newCalendar, setNewCalendar] = useState({ name: '', description: '' })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await calendarApi.createCalendar(newCalendar.name)
      localStorage.setItem('calendar-id', response.id.toString())
      router.push(`/calendars/${response.id}`)
    } catch (err) {
      setError('Failed to create calendar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-center mb-8">
            Create New Calendar
          </h1>
        </div>

        <form onSubmit={handleCreate} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Calendar Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Calendar Name"
                value={newCalendar.name}
                onChange={(e) =>
                  setNewCalendar({ ...newCalendar, name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <input
                id="description"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                value={newCalendar.description}
                onChange={(e) =>
                  setNewCalendar({
                    ...newCalendar,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Calendar
            </button>
            <button
              type="button"
              onClick={() => router.push('/calendars')}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
