'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import SessionProvider from './SessionProvider'

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}
