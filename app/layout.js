import { NextUIProvider } from "@nextui-org/react"
import './globals.css'

export const metadata = {
  title: 'BPM Beast',
  description: 'Metronome using your favorite music',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  )
}
