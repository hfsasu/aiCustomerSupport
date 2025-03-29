"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { ChatContainer } from "./ChatContainer"
import { ChatInput } from "./ChatInput"
import { ChatHistory } from "./ChatHistory"
import { useToast } from "../ui/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import { useCurrentUser } from "@/lib/store/auth-store"
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
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { toast } = useToast()
  const cartStore = useCartStore()

  // Load conversations from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem("chat-history")
    if (saved) {
      try {
        const parsedConversations = JSON.parse(saved)
        setConversations(parsedConversations)
        if (parsedConversations.length > 0) {
          setCurrentChatId(parsedConversations[0].id)
        }
      } catch (error) {
        console.error("Error parsing saved conversations:", error)
      }
    }
  }, [])

  // Fetch menu items
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('/api/menu')
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setMenuItems(data as MenuItem[])
      } catch (err) {
        console.error("Error fetching menu items:", err)
        toast({
          title: "Error",
          description: "Failed to load menu items. Please refresh the page.",
          variant: "destructive",
        })
      }
    }
    fetchMenuItems()
  }, [toast])

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(conversations))
    }
  }, [conversations])

  const getCurrentMessages = useCallback(() => {
    if (!currentChatId) return [INITIAL_MESSAGE]
    const conversation = conversations.find((c) => c.id === currentChatId)
    return conversation ? conversation.messages : [INITIAL_MESSAGE]
  }, [conversations, currentChatId])

  const handleCartAction = useCallback((action: { type: string; data?: any }) => {
    console.log('Processing cart action:', action.type, action.data);
    
    switch (action.type) {
      case 'CLEAR_CART': {
        cartStore.clearCart()
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart",
        })
        break
      }
      
      case 'ADD_TO_CART': {
        if (!action.data?.itemName) {
          console.error('Invalid ADD_TO_CART action: missing itemName', action);
          return;
        }
        
        // Case-insensitive menu item search
        const searchName = action.data.itemName.toLowerCase().trim();
        const menuItem = menuItems.find(item => 
          item.name.toLowerCase().trim() === searchName
        );
        
        if (menuItem) {
          const quantity = action.data.quantity || 1;
          const instructions = action.data.specialInstructions || "";
          
          cartStore.addItem(
            menuItem, 
            quantity, 
            instructions
          )
          
          toast({
            title: "Added to cart",
            description: `${quantity} × ${menuItem.name} added to your cart`,
          })
        } else {
          console.error(`Menu item not found: "${action.data.itemName}"`, 
            'Available items:', menuItems.map(i => i.name));
          
          toast({
            title: "Item not found",
            description: `Could not find "${action.data.itemName}" on the menu`,
            variant: "destructive",
          })
        }
        break
      }
      
      case 'REMOVE_FROM_CART': {
        if (!action.data?.itemName) {
          console.error('Invalid REMOVE_FROM_CART action: missing itemName', action);
          return;
        }
        
        const quantity = action.data.quantity || 1;
        cartStore.removeItemByName(
          action.data.itemName,
          quantity
        )
        
        toast({
          title: "Removed from cart",
          description: `${action.data.itemName} removed from your cart`,
        })
        break
      }
      
      case 'SHOW_CART': {
        const summary = cartStore.getCartSummary()
        setConversations(prev =>
          prev.map(conv =>
            conv.id === currentChatId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      role: "assistant",
                      content: `Current Order:\n${summary}`,
                    },
                  ],
                }
              : conv
          )
        )
        break
      }
      
      case 'PLACE_ORDER': {
        const { user, isSignedIn } = useCurrentUser()
        
        if (!isSignedIn || !user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to place your order",
            variant: "destructive",
          })
          break
        }
        
        const items = cartStore.items
        
        if (items.length === 0) {
          toast({
            title: "Empty cart",
            description: "Your cart is empty. Add items before placing an order.",
            variant: "destructive",
          })
          break
        }
        
        // Create an async function and call it immediately
        (async () => {
          try {
            // Add tax calculation (8.25%)
            const total = cartStore.getTotal() * 1.0825
            
            // Create order via API
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cartItems: items,
                total
              }),
            })
            
            if (!response.ok) {
              throw new Error("Failed to create order")
            }
            
            const order = await response.json()
            
            // Clear the cart
            cartStore.clearCart()
            
            // Show success message
            toast({
              title: "Order placed successfully!",
              description: `Your order #${order.id.slice(0, 8)} has been placed.`,
            })
            
            // Add confirmation to the conversation
            setConversations(prev =>
              prev.map(conv =>
                conv.id === currentChatId
                  ? {
                      ...conv,
                      messages: [
                        ...conv.messages,
                        {
                          role: "assistant",
                          content: `Your order has been placed successfully! Order #${order.id.slice(0, 8)} is now being processed. You can view your order details in the Order History section.`,
                        },
                      ],
                    }
                  : conv
              )
            )
          } catch (error: any) {
            console.error("Error placing order:", error)
            toast({
              title: "Error placing order",
              description: error.message || "Something went wrong. Please try again.",
              variant: "destructive",
            })
          }
        })()
        break
      }
      
      default:
        console.error('Unknown cart action type:', action.type);
    }
  }, [cartStore, currentChatId, menuItems, toast])

  const generateChatTitle = (message: string): string => {
    // Remove any special characters and extra spaces
    const cleanMessage = message.trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()

    // Common order-related phrases to look for
    const orderPhrases = [
      'can i order', 'can you order', 'i want to order', 'order me',
      'get me', 'i would like', "i'd like"
    ]

    // Remove common prefixes to get to the core content
    let title = cleanMessage
    orderPhrases.forEach(phrase => {
      if (title.startsWith(phrase)) {
        title = title.slice(phrase.length).trim()
      }
    })

    // Capitalize first letter of each word
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Add appropriate prefix based on content
    if (orderPhrases.some(phrase => cleanMessage.includes(phrase))) {
      title = `Order: ${title}`
    } else if (cleanMessage.includes('remove') || cleanMessage.includes('delete')) {
      title = `Modify: ${title}`
    } else if (cleanMessage.includes('what') || cleanMessage.includes('how') || 
               cleanMessage.includes('tell me about') || cleanMessage.includes('?')) {
      title = `Question: ${title}`
    }

    // Limit length while keeping full words
    const maxLength = 40
    if (title.length > maxLength) {
      const truncated = title.slice(0, maxLength)
      const lastSpace = truncated.lastIndexOf(' ')
      title = truncated.slice(0, lastSpace) + '...'
    }

    return title
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      // Get or create chat session
      let chatId = currentChatId
      let currentMessages = [INITIAL_MESSAGE]

      if (!chatId) {
        chatId = Date.now().toString()
        const newChat = {
          id: chatId,
          title: generateChatTitle(input.trim()),
          timestamp: new Date().toLocaleTimeString(),
          messages: [INITIAL_MESSAGE],
        }
        setCurrentChatId(chatId)
        setConversations(prev => [newChat, ...prev])
      } else {
        const conversation = conversations.find(c => c.id === chatId)
        if (conversation) {
          currentMessages = [...conversation.messages]
        }
      }

      // Add user message
      const userMessage: Message = {
        role: "user",
        content: input.trim(),
      }

      setConversations(prev =>
        prev.map(conv =>
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
        // Prepare current cart state
        const currentCart = cartStore.items.map(item => ({
          name: item.menuItem?.name,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
          price: item.menuItem?.price
        }))

        // Send request to API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...currentMessages, userMessage],
            menuItems,
            currentCart
          }),
        })

        if (!response.ok) throw new Error("Failed to get response")

        // Set up streaming response handling
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        // Add initial empty assistant message
        setConversations(prev =>
          prev.map(conv =>
            conv.id === chatId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    { role: "assistant", content: "" }
                  ],
                }
              : conv
          )
        )

        // Process the stream
        if (reader) {
          let assistantResponse = ""
          let updateTimeout: NodeJS.Timeout | null = null
          let cartActionsQueue: { type: string; data?: any }[] = []
          let processedActions = new Set<string>() // Track processed actions to avoid duplicates

          const updateConversation = (text: string) => {
            if (!text.trim()) return // Don't update with empty text
            
            setConversations(prev =>
              prev.map(conv =>
                conv.id === chatId
                  ? {
                      ...conv,
                      messages: [
                        ...conv.messages.slice(0, -1),
                        {
                          role: "assistant",
                          content: text,
                        },
                      ],
                    }
                  : conv
              )
            )
          }

          const processCartActions = () => {
            // Ensure CLEAR_CART is processed first if it exists
            const clearCartIndex = cartActionsQueue.findIndex(action => action.type === 'CLEAR_CART')
            if (clearCartIndex > -1) {
              const clearAction = cartActionsQueue.splice(clearCartIndex, 1)[0]
              const actionKey = `${clearAction.type}`
              if (!processedActions.has(actionKey)) {
                handleCartAction(clearAction)
                processedActions.add(actionKey)
              }
            }
            
            // Process remaining actions
            for (let i = 0; i < cartActionsQueue.length; i++) {
              const action = cartActionsQueue[i]
              const actionKey = `${action.type}-${action.data?.itemName || ''}-${action.data?.quantity || ''}`
              if (!processedActions.has(actionKey)) {
                handleCartAction(action)
                processedActions.add(actionKey)
              }
            }
            
            cartActionsQueue = [] // Clear the queue after processing
          }

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // Process each chunk
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (!line.trim() || !line.startsWith('data: ')) continue
              
              const data = line.replace('data: ', '').trim()
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)

                if (parsed.text) {
                  assistantResponse = parsed.text
                    // Clean text by removing any cart commands that might have leaked
                    .replace(/\[\[(ADD_TO_CART|REMOVE_FROM_CART|CLEAR_CART|SHOW_CART):.*?\]\]/g, '')
                    .trim()

                  // Throttle updates using setTimeout
                  if (updateTimeout) {
                    clearTimeout(updateTimeout)
                  }

                  updateTimeout = setTimeout(() => {
                    updateConversation(assistantResponse)
                  }, 50) // Update every 50ms at most
                }

                if (parsed.cartAction) {
                  // Queue cart action for later processing
                  cartActionsQueue.push(parsed.cartAction)
                }
              } catch (error) {
                console.error("Error parsing chunk:", error)
              }
            }
          }

          // Process any remaining updates
          if (updateTimeout) {
            clearTimeout(updateTimeout)
          }
          
          // Final update with cleaned text
          const finalText = assistantResponse
            .replace(/\[\[(ADD_TO_CART|REMOVE_FROM_CART|CLEAR_CART|SHOW_CART):.*?\]\]/g, '')
            .trim()
            
          updateConversation(finalText)

          // Process any cart actions after the final response is set
          setTimeout(() => {
            processCartActions()
          }, 100)

          // Update chat title if first message
          if (chatId) {
            const conversation = conversations.find(c => c.id === chatId)
            if (conversation?.messages.length === 1) {
              const title = generateChatTitle(userMessage.content)
              setConversations(prev =>
                prev.map(conv =>
                  conv.id === chatId
                    ? { ...conv, title }
                    : conv
                )
              )
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error)
        toast({
          title: "Error",
          description: "Failed to get response. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, currentChatId, conversations, menuItems, handleCartAction, cartStore.items, toast]
  )

  const handleDeleteChat = useCallback(
    (id: string) => {
      setConversations(prev => prev.filter(conv => conv.id !== id))
      if (currentChatId === id) {
        setCurrentChatId(null)
      }
    },
    [currentChatId]
  )

  const handleRenameChat = useCallback(
    (id: string, newTitle: string) => {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === id
            ? { ...conv, title: newTitle }
            : conv
        )
      )
    },
    []
  )

  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString()
    setConversations(prev => [
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

  return (
    <div className="flex h-[calc(100vh-4rem)] justify-center">
      <div className="flex w-full max-w-5xl">
        <ChatHistory
          conversations={conversations}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
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
