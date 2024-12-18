import Notifications from '@/components/Notifications'
import { Toaster } from 'react-hot-toast'

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <Toaster position="top-right" />
      <Notifications />
    </div>
  )
}
