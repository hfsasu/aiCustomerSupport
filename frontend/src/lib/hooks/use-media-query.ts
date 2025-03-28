"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // Default to true on server to avoid layout shift
    if (typeof window === "undefined") {
      return
    }
    
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)
    
    // Setup listener for changes
    const listener = () => setMatches(media.matches)
    
    // Use the appropriate event listener method based on browser support
    if (media.addEventListener) {
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } else {
      // For older browsers
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])
  
  return matches
} 