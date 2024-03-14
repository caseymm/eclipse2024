import { Inter } from 'next/font/google'
import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eclipse 2024',
  description: 'What will the eclipse look like where you live?',
  image: 'eclipse_cover.gif',
  icon: 'favicon.png'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add custom scripts */}
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
        <meta property="og:image" content="/eclipse_cover.gif" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-HDXFDE0FLK`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'YOUR_TRACKING_ID');
            `
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
