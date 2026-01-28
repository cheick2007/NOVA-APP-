import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nova',
  description: 'Explosion of Talents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
