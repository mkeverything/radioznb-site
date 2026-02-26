import { BackgroundImage } from '@/components/BackgroundImage'
import PlayerBar from '@/components/PlayerBar/Player'
import { PlayerContextProvider } from '@/components/PlayerContext'
import QueryProvider from '@/components/QueryProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className={radioFont.className} suppressHydrationWarning>
			<body className='mb-34'>
				<QueryProvider>
					<PlayerContextProvider>
						<ThemeProvider>
							<div className='sm:px-8 p-4'>{children}</div>
							<PlayerBar />
							<BackgroundImage />
						</ThemeProvider>
					</PlayerContextProvider>
				</QueryProvider>
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: 'радио зимы не будет',
	description: 'зе бест рэдио ин зе ворлд.',
	openGraph: {
		title: 'радио зимы не будет',
		images: [
			{
				url: 'https://r0zpfsgakx.ufs.sh/f/ulX3r7DWQlCoNpBYhL3AWX1093yJ5FIsDH2Ehjv6awMzcZTC',
			},
		],
	},
	robots: {
		index: true,
		follow: true,
	},
}

const radioFont = localFont({
	src: '../public/fonts/znb.otf',
})
