import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render } 