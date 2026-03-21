import { BackgroundImage } from "@/components/BackgroundImage"
import PlayerBar from "@/components/PlayerBar/Player"
import { PlayerContextProvider } from "@/components/PlayerContext"
import QueryProvider from "@/components/QueryProvider"
import { SerwistProvider } from "@/components/SerwistProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={radioFont.className} suppressHydrationWarning>
      <body className="mb-34">
        <SerwistProvider swUrl="/serwist/sw.js">
          <QueryProvider>
            <PlayerContextProvider>
              <ThemeProvider>
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

const radioFont = localFont({
  src: "../public/fonts/znb.otf",
})

// const inter = Inter({ subsets: ["latin"] })
