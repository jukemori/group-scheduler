import Notifications from '@/components/Notifications'
import { Toaster } from 'react-hot-toast'

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <Toaster position="top-right" />
      <Notifications />
    </div>
  )
}
