"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Set default theme to light on mount
  useEffect(() => {
    setTheme('light')
  }, [])

  return (
    <nav className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left section - Logo */}
          <div className="w-1/4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/restaurantLogo.png"
                alt="In-N-Out Burger"
                width={128}
                height={128}
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* Center section - Navigation */}
          <div className="w-2/4 flex justify-center">
            <div className="flex space-x-12">
              <Link href="/" className="text-lg font-medium text-red-600 hover:text-red-700">
                Home
              </Link>
              <Link href="/menu" className="text-lg font-medium text-red-600 hover:text-red-700">
                Menu
              </Link>
              <Link href="/order" className="text-lg font-medium text-red-600 hover:text-red-700">
                Order
              </Link>
              <a 
                href="#faq" 
                className="text-lg font-medium text-red-600 hover:text-red-700"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Right section - Theme & Auth Buttons */}
          <div className="w-1/4 flex justify-end items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </span>
            </Button>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden pb-3">
            <div className="px-2 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium text-red-600 hover:bg-accent rounded-md"
              >
                Home
              </Link>
              <Link
                href="/menu"
                className="block px-3 py-2 text-sm font-medium text-red-600 hover:bg-accent rounded-md"
              >
                Menu
              </Link>
              <Link
                href="/order"
                className="block px-3 py-2 text-sm font-medium text-red-600 hover:bg-accent rounded-md"
              >
                Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
