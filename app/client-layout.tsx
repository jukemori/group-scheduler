'use client'
import { SessionProvider } from 'next-auth/react'
import { registerLicense } from '@syncfusion/ej2-base'

const licenseKey = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE || ''
registerLicense(licenseKey)

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
