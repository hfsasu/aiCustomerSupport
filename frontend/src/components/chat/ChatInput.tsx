"use client"

import type React from "react"
import { SendHorizontal } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import { motion } from "framer-motion"

interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading
}: ChatInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-black pb-6 pt-10"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl justify-center items-end gap-4 px-4"
      >
        <div className="relative w-full max-w-xl">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Ask about our menu, customize your order, or get recommendations..."
            maxRows={5}
            className="w-full resize-none rounded-lg border border-input bg-background p-4 pr-12 text-sm focus:outline-none focus:border-red-500 focus:border-2 disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute bottom-5 right-3 rounded-md p-1 text-muted-foreground transition-colors hover:text-[#C8102E] disabled:opacity-50"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
