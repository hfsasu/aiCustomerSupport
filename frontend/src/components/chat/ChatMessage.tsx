"use client"

import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: {
    role: "assistant" | "user"
    content: string
  }
  isLatest: boolean
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex w-full items-start gap-4 p-6 ${
        message.role === "assistant" ? "bg-black/5 dark:bg-white/5" : "bg-transparent"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {message.role === "assistant" ? <Bot className="h-5 w-5 text-[#C8102E]" /> : <User className="h-5 w-5" />}
      </div>
      <div className="flex min-h-[2rem] flex-1 flex-col items-start gap-2">
        <div className="text-sm font-medium">{message.role === "assistant" ? "AI Assistant" : "You"}</div>
        <div className="text-sm text-muted-foreground">{message.content}</div>
      </div>
    </motion.div>
  )
}

