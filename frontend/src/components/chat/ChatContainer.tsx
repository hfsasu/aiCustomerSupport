"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChatMessage } from "./ChatMessage"
import { Loader2, MessageSquarePlus } from "lucide-react"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface ChatContainerProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pb-32 pt-4 scroll-smooth">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-4 py-20 text-center"
        >
          <MessageSquarePlus className="h-12 w-12 text-[#C8102E]" />
          <h2 className="text-2xl font-bold text-[#C8102E]">Start a New Conversation</h2>
          <p className="text-muted-foreground">Ask about our menu, place an order, or get recommendations.</p>
        </motion.div>
      ) : (
        <div className="mx-auto max-w-3xl">
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message} isLatest={i === messages.length - 1} />
          ))}
        </div>
      )}
      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#C8102E]" />
        </motion.div>
      )}
    </div>
  )
}

