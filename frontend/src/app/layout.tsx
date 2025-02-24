// app/layout.tsx
import '@/app/globals.css'
import React from "react"
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="mt-16">
              {children}
              <Toaster />
            </main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
