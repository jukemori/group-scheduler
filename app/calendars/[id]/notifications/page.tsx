import Notifications from '@/components/Notifications'
import { Toaster } from 'react-hot-toast'

export default function NotificationsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <Toaster position="top-right" />
      <Notifications />
    </div>
  )
}
