'use client'
import { useEffect, useState, useRef } from 'react'
import { webSocketService } from '@/utils/websocket'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Notification {
  id: number
  message: string
  created_at: string | Date
  notification_type: string
  calendar_id: string
  user: {
    id: number
    nickname: string
    calendar_id: string
  }
  event?: {
    id: number
    subject: string
  }
}

export default function Notifications() {
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
        setNotifications(Array.isArray(data) ? data : [])
        notificationsRef.current = Array.isArray(data) ? data : []
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
              <Link
                key={`${notification.id}-${notification.created_at}`}
                href={href}
                className="notification-item"
              >
                <p>{notification.message}</p>
                <small>{formatDate(notification.created_at)}</small>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
