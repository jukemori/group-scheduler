'use client'
import { useEffect, useState, useRef } from 'react'
import { webSocketService } from '@/utils/websocket'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Notification {
  id: number
  message: string
  created_at: string | Date
  notification_type: string
  calendar_id: string
  action?: string
  calendar_invitation?: {
    status: string
  }
  user: {
    id: number
    nickname: string
    calendar_id: string
    photo_url: string
  }
  event?: {
    id: number
    subject: string
  }
}

export default function Notifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const notificationsRef = useRef<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/users/notifications`,
          {
            headers: {
              'access-token': localStorage.getItem('access-token') || '',
              client: localStorage.getItem('client') || '',
              uid: localStorage.getItem('uid') || '',
            },
          },
        )
        const data = await response.json()
        const filteredNotifications = Array(data)
          ? data.filter(
              (notification: Notification) =>
                notification.action !== 'sent' ||
                notification.calendar_invitation?.status !== 'accepted',
            )
          : []
        setNotifications(filteredNotifications)
        notificationsRef.current = filteredNotifications
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
        notificationsRef.current = []
      }
    }

    const handleConnectionStatus = (status: boolean) => {
      setIsConnected(status)
    }

    const handleNotification = (notification: Notification) => {
      const processedNotification = {
        ...notification,
        created_at: notification.created_at || new Date().toISOString(),
      }

      setNotifications((prevNotifications) => {
        if (!prevNotifications.some((n) => n.id === processedNotification.id)) {
          const updatedNotifications = [
            processedNotification,
            ...prevNotifications,
          ]
          notificationsRef.current = updatedNotifications
          return updatedNotifications
        }
        return prevNotifications
      })

      toast.success(notification.message)
    }

    webSocketService.onConnectionStatus(handleConnectionStatus)
    webSocketService.onNotification(handleNotification)

    fetchNotifications()
    webSocketService.connect()

    return () => {
      webSocketService.removeNotificationCallback(handleNotification)
      webSocketService.removeConnectionStatusCallback(handleConnectionStatus)
      webSocketService.disconnect()
    }
  }, [])

  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === 'string' ? new Date(dateString) : dateString

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString)
        return 'Invalid date'
      }

      const now = new Date()
      const diffInMilliseconds = now.getTime() - date.getTime()
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
      const diffInWeeks = Math.floor(diffInDays / 7)

      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
      } else {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
      }
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const handleAcceptInvitation = async (calendarId: string) => {
    try {
      await fetch(
        `http://localhost:3001/api/v1/calendars/${calendarId}/accept_invitation`,
        {
          method: 'POST',
          headers: {
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
        },
      )

      setNotifications((prev) =>
        prev.filter((n) => n.calendar_id !== calendarId),
      )
      router.refresh()
      router.push(`/calendars/${calendarId}`)
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast.error('Failed to accept invitation')
    }
  }

  const handleRejectInvitation = async (calendarId: string) => {
    try {
      await fetch(
        `http://localhost:3001/api/v1/calendars/${calendarId}/reject_invitation`,
        {
          method: 'POST',
          headers: {
            'access-token': localStorage.getItem('access-token') || '',
            client: localStorage.getItem('client') || '',
            uid: localStorage.getItem('uid') || '',
          },
        },
      )

      setNotifications((prev) =>
        prev.filter((n) => n.calendar_id !== calendarId),
      )
    } catch (error) {
      console.error('Error rejecting invitation:', error)
      toast.error('Failed to reject invitation')
    }
  }

  return (
    <div className="notifications-container">
      <div
        className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
      >
        WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const calendarId = notification.calendar_id
            let href = ''

            switch (notification.notification_type) {
              case 'event':
                href = `/calendars/${calendarId}`
                break
              case 'note':
                href = `/calendars/${calendarId}/notes`
                break
              case 'invitation_accepted':
                href = `/calendars/${calendarId}/members`
                break
            }

            return (
              <div
                key={`${notification.id}-${notification.created_at}`}
                className="notification-item p-4 mb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.user.photo_url} />
                    <AvatarFallback>
                      {notification.user.nickname.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    {notification.notification_type === 'invitation_sent' ? (
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          {notification.message}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAcceptInvitation(calendarId)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectInvitation(calendarId)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Link href={href} className="block">
                        <p className="text-sm text-gray-800 font-medium">
                          {notification.message}
                        </p>
                      </Link>
                    )}
                    <small className="text-xs text-gray-500 mt-1 block">
                      {formatDate(notification.created_at)}
                    </small>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
