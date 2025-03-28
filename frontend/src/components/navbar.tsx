"use client"

import { Sun, Moon, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useCartStore } from "@/lib/store/cart-store"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const getItemCount = useCartStore((state) => state.getItemCount)
  
  // Scroll animation
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  )
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(10px)"]
  )
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 4px 20px rgba(0, 0, 0, 0.1)"]
  )
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(10, 10, 10, 0.8)", "rgba(10, 10, 10, 0.95)"]
  )
  const darkBoxShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 4px 20px rgba(0, 0, 0, 0.3)"]
  )

  // Wait for mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.nav 
        className="fixed left-0 right-0 top-0 z-50"
        style={{
          backgroundColor: theme === 'dark' ? darkBackgroundColor : backgroundColor,
          backdropFilter,
          boxShadow: theme === 'dark' ? darkBoxShadow : boxShadow,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Left section - Logo */}
            <div className="w-1/4">
              <Link href="/" className="flex-shrink-0">
                <Image src="/restaurantLogo.png" alt="In-N-Out Burger" width={128} height={128} className="h-12 w-auto" />
              </Link>
            </div>

            {/* Center section - Navigation */}
            <div className="w-2/4 flex justify-center">
              <div className="flex space-x-12">
                <Link
                  href="/"
                  className={`text-lg font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-red-600" 
                      : "text-gray-700 hover:text-red-700 dark:text-gray-200 dark:hover:text-red-400"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className={`text-lg font-medium transition-colors ${
                    pathname === "/menu" 
                      ? "text-red-600" 
                      : "text-gray-700 hover:text-red-700 dark:text-gray-200 dark:hover:text-red-400"
                  }`}
                >
                  Menu
                </Link>
                <Link
                  href="/order"
                  className={`text-lg font-medium transition-colors ${
                    pathname === "/order" 
                      ? "text-red-600" 
                      : "text-gray-700 hover:text-red-700 dark:text-gray-200 dark:hover:text-red-400"
                  }`}
                >
                  Order
                </Link>
                <a 
                  href="#faq" 
                  className="text-lg font-medium text-gray-700 transition-colors hover:text-red-700 dark:text-gray-200 dark:hover:text-red-400"
                >
                  FAQ
                </a>
              </div>
            </div>

            {/* Right section - Theme & Auth Buttons */}
            <div className="w-1/4 flex justify-end items-center space-x-4">
              {/* Cart Button with improved styling */}
              <Link href="/cart" className="relative">
                <Button 
                  variant="outline" 
                  className="relative rounded-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm" 
                  aria-label="View cart"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  {getItemCount() > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Theme Toggle with improved styling */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-700" />
                )}
              </Button>

              {/* Auth Buttons */}
              <SignedOut>
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
                  className={`block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md ${
                    pathname === "/" ? "text-red-600" : "text-gray-600 dark:text-gray-200"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className={`block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md ${
                    pathname === "/menu" ? "text-red-600" : "text-gray-600 dark:text-gray-200"
                  }`}
                >
                  Menu
                </Link>
                <Link
                  href="/order"
                  className={`block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md ${
                    pathname === "/order" ? "text-red-600" : "text-gray-600 dark:text-gray-200"
                  }`}
                >
                  Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Cart Drawer - Separate from the button */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}