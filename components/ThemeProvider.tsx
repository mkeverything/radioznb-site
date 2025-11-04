'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react'

const ThemeTransitionContext = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemesProvider
			attribute='class'
			enableSystem={false}
			defaultTheme='light'
		>
			<ThemeTransitionInner>{children}</ThemeTransitionInner>
		</NextThemesProvider>
	)
}

const ThemeTransitionInner = ({ children }: { children: ReactNode }) => {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const pathname = usePathname()

	useEffect(() => setMounted(true), [])

	const toggleTheme = useCallback(() => {
		const newTheme = theme === 'dark' ? 'light' : 'dark'

		// View Transition API
		if (document.startViewTransition) {
			document.documentElement.classList.add('theme-transition')
			const transition = document.startViewTransition(() => {
				setTheme(newTheme)
			})

			transition.finished.finally(() => {
				document.documentElement.classList.remove('theme-transition')
			})
		} else {
			// fallback
			setTheme(newTheme)
		}
	}, [theme, setTheme])

	useEffect(() => {
		if (pathname.startsWith('/library') && theme !== 'dark') {
			toggleTheme()
		} else if (!pathname.startsWith('/library') && theme !== 'light') {
			toggleTheme()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	if (!mounted) return <>{children}</>

	return (
		<ThemeTransitionContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeTransitionContext.Provider>
	)
}

type ThemeCtx = {
	theme: string | undefined
	toggleTheme: () => void
}
