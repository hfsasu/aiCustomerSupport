"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquarePlus, Trash2, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define a fallback if the hook isn't available
function useMediaQueryFallback(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = () => setMatches(media.matches)
    
    if (media.addEventListener) {
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } else {
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])
  
  return matches
}

// Try to import the hook, use fallback if it fails
let useMediaQuery: (query: string) => boolean;
try {
  useMediaQuery = require("@/lib/hooks/use-media-query").useMediaQuery;
} catch (e) {
  useMediaQuery = useMediaQueryFallback;
}

interface Conversation {
  id: string
  title: string
  timestamp: string
  messages: Array<{ role: string; content: string }>
}

interface ChatHistoryProps {
  conversations: Conversation[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onRenameChat: (id: string, newTitle: string) => void
}

export function ChatHistory({
  conversations,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: ChatHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  
  // Use a simpler approach to detect desktop
  const [isDesktop, setIsDesktop] = useState(true)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIsDesktop = () => {
        setIsDesktop(window.innerWidth >= 768)
      }
      
      checkIsDesktop()
      window.addEventListener('resize', checkIsDesktop)
      
      return () => window.removeEventListener('resize', checkIsDesktop)
    }
  }, [])

  // Fix for hydration error - use client-side only rendering for animations
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveEdit = (id: string) => {
    onRenameChat(id, editTitle)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  // Only render animations on the client side
  if (!isMounted) {
    return (
      <div className={`${isDesktop ? 'w-64' : 'hidden'} border-r border-border bg-muted/40`}>
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">Recent Conversations</h2>
        </div>
        <div className="p-4">
          <Button onClick={onNewChat} className="w-full justify-start gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="space-y-2 px-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm ${
                currentChatId === conversation.id
                  ? "bg-muted/80 text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => onSelectChat(conversation.id)}
            >
              <div className="flex-1 truncate">
                {conversation.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {!isDesktop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-20 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      )}

      <AnimatePresence>
        {(isDesktop || isOpen) && (
          <motion.div
            initial={isDesktop ? { opacity: 1, x: 0 } : { opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className={`${
              isDesktop ? "relative w-64" : "fixed inset-y-0 left-0 z-40 w-64"
            } border-r border-border bg-muted/40`}
          >
            <div className="flex h-14 items-center border-b px-4">
              <h2 className="text-lg font-semibold">Recent Conversations</h2>
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={toggleSidebar}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="p-4">
              <Button onClick={onNewChat} className="w-full justify-start gap-2">
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
            <div className="space-y-2 px-2">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm ${
                    currentChatId === conversation.id
                      ? "bg-muted/80 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  onClick={() => onSelectChat(conversation.id)}
                >
                  {editingId === conversation.id ? (
                    <div className="flex w-full items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => saveEdit(conversation.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 truncate">
                        {conversation.title}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(conversation.id, conversation.title)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(conversation.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

