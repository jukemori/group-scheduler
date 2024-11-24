type NotificationCallback = (notification: any) => void

export class WebSocketService {
  private socket: WebSocket | null = null
  private notificationCallbacks: NotificationCallback[] = []
  private connectionStatusCallbacks: ((status: boolean) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private processedActionIds = new Set<string>()

  connect() {
    if (this.socket) {
      this.disconnect()
    }

    try {
      const accessToken = encodeURIComponent(
        localStorage.getItem('access-token') || '',
      )
      const client = encodeURIComponent(localStorage.getItem('client') || '')
      const uid = encodeURIComponent(localStorage.getItem('uid') || '')

      const wsUrl = `ws://localhost:3001/cable?access-token=${accessToken}&client=${client}&uid=${uid}`
      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        this.reconnectAttempts = 0
        this.notifyConnectionStatus(true)

        setTimeout(() => {
          this.socket?.send(
            JSON.stringify({
              command: 'subscribe',
              identifier: JSON.stringify({
                channel: 'CalendarChannel',
              }),
            }),
          )
        }, 100)
      }

      this.socket.onclose = (event) => {
        this.notifyConnectionStatus(false)
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (
            data.type === 'ping' ||
            data.type === 'welcome' ||
            data.type === 'confirm_subscription'
          ) {
            return
          }

          if (
            data.message?.action_id &&
            this.processedActionIds.has(data.message.action_id)
          ) {
            return
          }

          if (data.message && data.message.notification) {
            this.notificationCallbacks.forEach((callback) => {
              try {
                callback(data.message.notification)
              } catch (error) {
                console.error('Error in notification callback:', error)
              }
            })
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error)
        }
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, 3000)
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.processedActionIds.clear()
  }

  onNotification(callback: NotificationCallback) {
    if (typeof callback !== 'function') {
      console.error('Invalid notification callback provided:', callback)
      return
    }
    this.notificationCallbacks.push(callback)
  }

  removeNotificationCallback(callback: NotificationCallback) {
    this.notificationCallbacks = this.notificationCallbacks.filter(
      (cb) => cb !== callback,
    )
  }

  notifyConnectionStatus(status: boolean) {
    this.connectionStatusCallbacks.forEach((callback) => {
      try {
        callback(status)
      } catch (error) {
        console.error('Error in connection status callback:', error)
      }
    })
  }

  onConnectionStatus(callback: (status: boolean) => void) {
    if (typeof callback !== 'function') {
      console.error('Invalid connection status callback provided:', callback)
      return
    }
    this.connectionStatusCallbacks.push(callback)
  }

  removeConnectionStatusCallback(callback: (status: boolean) => void) {
    this.connectionStatusCallbacks = this.connectionStatusCallbacks.filter(
      (cb) => cb !== callback,
    )
  }
}

export const webSocketService = new WebSocketService()
