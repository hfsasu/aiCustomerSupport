"use client"

import { motion } from "framer-motion"
import { MessageSquare, Plus, Trash2, Pencil } from "lucide-react"
import { useTheme } from "next-themes"

interface ChatHistoryProps {
  conversations: {
    id: string
    title: string
  }[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onRenameChat: (id: string, newTitle: string) => void
}

export function ChatHistory({ conversations, currentChatId, onNewChat, onSelectChat, onDeleteChat, onRenameChat }: ChatHistoryProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={`hidden w-64 flex-shrink-0 flex-col border-r p-4 md:flex ${
        isDark ? "bg-black border-white/10" : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#C8102E] bg-transparent px-4 py-2 text-sm font-medium text-[#C8102E] transition-colors hover:bg-[#C8102E]/5"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      <div className="mt-6 flex flex-col gap-2">
        <h2 className={`px-2 text-sm font-medium ${isDark ? "text-white/60" : "text-gray-500"}`}>
          Recent Conversations
        </h2>
        <div className="space-y-2">
          {conversations.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm transition-colors ${
                currentChatId === chat.id
                  ? isDark
                    ? "bg-[#C8102E]/10 text-white"
                    : "bg-[#C8102E]/5 text-black"
                  : isDark
                    ? "text-white/80 hover:bg-white/5"
                    : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="line-clamp-1 flex-1">{chat.title}</span>

              <div className="absolute right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newTitle = prompt("Enter new title:", chat.title)
                    if (newTitle && newTitle.trim() !== "") {
                      onRenameChat(chat.id, newTitle.trim())
                    }
                  }}
                  className={`${
                    isDark ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                  className={`${
                    isDark ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

