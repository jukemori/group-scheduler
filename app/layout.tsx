import { registerLicense } from '@syncfusion/ej2-base'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MingleTime',
  description:
    'MingleTime helps you create and share schedules, making it easy to coordinate events and stay organized with friends, family, and teams.',
}

const licenseKey = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE || ''
registerLicense(licenseKey)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
