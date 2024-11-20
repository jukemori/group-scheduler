'use client'
import { useEffect, useState } from 'react'
import { webSocketService } from '@/utils/websocket'
import toast from 'react-hot-toast'

interface Notification {
  id: number
  message: string
  created_at: string | Date
  user: {
    id: number
    nickname: string
  }
  event?: {
    id: number
    subject: string
  }
}

export default function Notifications({ calendarId }: { calendarId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/calendars/${calendarId}/notifications`,
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
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      }
    }

    fetchNotifications()

    // Connect to WebSocket
    webSocketService.connect(calendarId)

    // Handle connection status
    const handleConnectionStatus = (status: boolean) => {
      console.log('WebSocket connection status:', status)
      setIsConnected(status)
    }

    // Handle new notifications
    const handleNotification = (notification: Notification) => {
      console.log('New notification received:', notification)

      // Ensure the notification has a created_at field
      const processedNotification = {
        ...notification,
        created_at: notification.created_at || new Date().toISOString(),
      }

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === processedNotification.id)
        if (exists) return prev
        return [processedNotification, ...prev]
      })

      toast.success(notification.message)
    }

    webSocketService.onConnectionStatus(handleConnectionStatus)
    webSocketService.onNotification(handleNotification)

    return () => {
      webSocketService.disconnect()
      webSocketService.removeNotificationCallback(handleNotification)
      webSocketService.removeConnectionStatusCallback(handleConnectionStatus)
    }
  }, [calendarId])

  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === 'string' ? new Date(dateString) : dateString

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString)
        return 'Invalid date'
      }

      return date.toLocaleString()
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
          {notifications.map((notification) => (
            <div
              key={`${notification.id}-${notification.created_at}`}
              className="notification-item"
            >
              <p>{notification.message}</p>
              <small>{formatDate(notification.created_at)}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
