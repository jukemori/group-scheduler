'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calendarApi } from '@/lib/api/calendars'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-center mb-8">
            Create New Calendar
          </h1>
        </div>

        <form onSubmit={handleCreate} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Calendar Name
              </label>
              <Input
                id="name"
                type="text"
                required
                value={newCalendar.name}
                className="bg-card"
                onChange={(e) =>
                  setNewCalendar({ ...newCalendar, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground"
              >
                Description
              </label>
              <Input
                id="description"
                type="text"
                value={newCalendar.description}
                className="bg-card"
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
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
            >
              Create Calendar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/calendars')}
              className="group relative w-full flex justify-center py-2 px-4 border border-muted-foreground text-sm font-medium rounded-md bg-card "
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
