export const metadata = {
  title: 'BPM Beast',
  description: 'Metronome using your favorite music',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
