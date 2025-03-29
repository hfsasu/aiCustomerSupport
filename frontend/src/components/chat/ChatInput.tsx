"use client"

import type React from "react"
import { SendHorizontal } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import { motion } from "framer-motion"
import { VoiceInput } from "./VoiceInput"
import { useState } from "react"

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
  const [isListening, setIsListening] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTranscript = (text: string) => {
    setInput(text)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || isLoading || !input.trim() || isListening) return

    setIsSubmitting(true)
    try {
      await handleSubmit(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isSubmitting && !isLoading && input.trim() && !isListening) {
        handleFormSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-black pb-6 pt-10"
    >
      <form
        onSubmit={handleFormSubmit}
        className="mx-auto flex max-w-3xl justify-center items-end gap-4 px-4"
      >
        <div className="relative w-full max-w-xl">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about our menu, customize your order, or get recommendations..."
            maxRows={5}
            className="w-full resize-none rounded-lg border border-input bg-background p-4 pr-24 text-sm focus:outline-none focus:border-red-500 focus:border-2 disabled:opacity-50"
            disabled={isLoading || isListening || isSubmitting}
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <VoiceInput
              onTranscript={handleTranscript}
              isListening={isListening}
              setIsListening={setIsListening}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isListening || isSubmitting}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-[#C8102E] disabled:opacity-50"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
