"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { ChatContainer } from "./ChatContainer"
import { ChatInput } from "./ChatInput"
import { ChatHistory } from "./ChatHistory"
import { useToast } from "../ui/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { MenuItem } from "@/lib/supabase/schema"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface Conversation {
  id: string
  title: string
  timestamp: string
  messages: Message[]
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm your In-N-Out AI assistant. I can help you place orders, customize menu items, and answer any questions about our food and services. What can I help you with today?",
}

export function Chatbot() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat-history")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { toast } = useToast()
  const addItem = useCartStore((state) => state.addItem)

  // Fetch menu items for the chatbot to reference
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('/api/menu')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMenuItems(data as MenuItem[])
      } catch (err: any) {
        console.error("Error fetching menu items for chatbot:", err)
      }
    }

    fetchMenuItems()
  }, [])

  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(conversations))
  }, [conversations])

  const getCurrentMessages = useCallback(() => {
    if (!currentChatId) return [INITIAL_MESSAGE]
    const conversation = conversations.find((c) => c.id === currentChatId)
    return conversation ? conversation.messages : [INITIAL_MESSAGE]
  }, [conversations, currentChatId])

  const createNewChat = useCallback(() => {
    const newId = Date.now().toString()
    setConversations((prev) => [
      {
        id: newId,
        title: "New Conversation",
        timestamp: new Date().toLocaleTimeString(),
        messages: [INITIAL_MESSAGE],
      },
      ...prev,
    ])
    setCurrentChatId(newId)
  }, [])

  const updateChatTitle = useCallback((id: string, messages: Message[]) => {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                title: firstUserMessage.content.slice(0, 30) + "...",
              }
            : conv
        )
      )
    }
  }, [])

  // Process cart actions from AI responses
  const processCartActions = useCallback((responseText: string) => {
    // Check if the response contains cart action markers
    if (responseText.includes("[[ADD_TO_CART:")) {
      try {
        // Extract all cart actions
        const regex = /\[\[ADD_TO_CART:(.*?)\]\]/g;
        let match;
        let processedText = responseText;
        
        while ((match = regex.exec(responseText)) !== null) {
          const cartData = JSON.parse(match[1]);
          
          // Find the menu item
          const menuItem = menuItems.find(item => 
            item.name.toLowerCase() === cartData.itemName.toLowerCase() ||
            item.id === cartData.itemId
          );
          
          if (menuItem) {
            // Clear existing items of this type from cart first
            // This prevents duplicate additions
            const cartItems = useCartStore.getState().items;
            const existingItem = cartItems.find(item => item.menuItem?.id === menuItem.id);
            
            if (existingItem) {
              // Remove the existing item before adding a new one
              useCartStore.getState().removeItem(existingItem.id);
            }
            
            // Add item to cart with explicit quantity of 1
            addItem(
              menuItem, 
              1, // Force quantity to be 1
              cartData.specialInstructions || ""
            );
            
            // Show toast notification
            toast({
              title: "Added to cart",
              description: `${menuItem.name} added to your cart`,
            });
          }
          
          // Remove this cart action from the processed text
          processedText = processedText.replace(match[0], "");
        }
        
        return processedText;
      } catch (error) {
        console.error("Error processing cart action:", error);
        return responseText;
      }
    }
    
    return responseText;
  }, [addItem, menuItems, toast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      let chatId = currentChatId
      if (!currentChatId) {
        const newId = Date.now().toString()
        setConversations((prev) => [
          {
            id: newId,
            title: "New Conversation",
            timestamp: new Date().toLocaleTimeString(),
            messages: [INITIAL_MESSAGE],
          },
          ...prev,
        ])
        chatId = newId
        setCurrentChatId(newId)
      }

      const userMessage: Message = {
        role: "user",
        content: input.trim(),
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === chatId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                timestamp: new Date().toLocaleTimeString(),
              }
            : conv
        )
      )

      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...getCurrentMessages(), userMessage],
            menuItems: menuItems, // Pass menu items to the API
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || "Failed to get response")
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        if (!reader) {
          throw new Error("No response reader available")
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('data: ')
          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsedData = JSON.parse(line.trim())
                if (parsedData.text) {
                  assistantMessage += parsedData.text
                  
                  // Process the message for cart actions
                  const processedMessage = processCartActions(assistantMessage);
                  
                  // Find the current conversation
                  setConversations((prev) =>
                    prev.map((conv) =>
                      conv.id === chatId
                        ? {
                            ...conv,
                            messages: [
                              ...conv.messages.filter(msg => msg.role !== "assistant" || msg !== conv.messages[conv.messages.length - 1]),
                              {
                                role: "assistant",
                                content: processedMessage,
                              },
                            ],
                          }
                        : conv
                    )
                  )
                }
              } catch (e) {
                continue
              }
            }
          }
        }

        if (conversations.find((c) => c.id === chatId)?.messages.length === 1) {
          updateChatTitle(chatId, [...getCurrentMessages(), userMessage])
        }
      } catch (error: any) {
        console.error("Chat Error:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to get response from AI. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      input,
      isLoading,
      currentChatId,
      conversations,
      getCurrentMessages,
      updateChatTitle,
      toast,
      menuItems,
      processCartActions
    ]
  )

  const handleDeleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id))
      if (currentChatId === id) {
        setCurrentChatId(null)
      }
    },
    [currentChatId]
  )

  const handleRenameChat = useCallback(
    (id: string, newTitle: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                title: newTitle,
              }
            : conv
        )
      )
    },
    []
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] justify-center">
      {/* Constrain the width and center the content */}
      <div className="flex w-full max-w-5xl">
        <ChatHistory
          conversations={conversations}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={setCurrentChatId}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
        />
        <div className="flex flex-1 flex-col">
          <ChatContainer messages={getCurrentMessages()} isLoading={isLoading} />
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
