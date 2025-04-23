"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      setIsChecking(false)
    }
  }, [isLoaded])

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Please Sign In to Order</h2>
          <p className="text-gray-600 dark:text-gray-300">You need to be signed in to access the ordering system.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SignInButton mode="modal">
              <Button 
                variant="ghost" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
              >
                Sign In
              </Button>
            </SignInButton>
            
            <SignUpButton mode="modal">
              <Button 
                className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
