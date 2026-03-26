import { BackgroundImage } from "@/components/BackgroundImage"
import { OfflineRedirect } from "@/components/OfflineRedirect"
import PlayerBar from "@/components/PlayerBar/Player"
import { PlayerContextProvider } from "@/components/PlayerContext"
import QueryProvider from "@/components/QueryProvider"
import { SerwistProvider } from "@/components/SerwistProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import type { Metadata, Viewport } from "next"
import { Mynerve } from "next/font/google"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${latinFont.variable} mb-34 min-h-dvh overflow-x-clip`}>
        <SerwistProvider swUrl="/serwist/sw.js">
          <QueryProvider>
            <PlayerContextProvider>
              <ThemeProvider>
                <OfflineRedirect />
                <div className="p-4 sm:px-8">{children}</div>
                <PlayerBar />
                <BackgroundImage />
              </ThemeProvider>
            </PlayerContextProvider>
          </QueryProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}

const APP_NAME = "радио зимы не будет"
const APP_DESCRIPTION = "зе бест рэдио ин зе ворлд."

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "https://r0zpfsgakx.ufs.sh/f/ulX3r7DWQlCoNpBYhL3AWX1093yJ5FIsDH2Ehjv6awMzcZTC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const latinFont = Mynerve({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-latin",
  display: "swap",
})
