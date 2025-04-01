import { Chatbot } from "@/components/chat/Chatbot"
import ProtectedLayout from "@/components/ProtectedLayout"

export default function OrderPage() {
  return (
    <ProtectedLayout>
      <div className="flex flex-col min-h-screen bg-background pt-16">
        <Chatbot />
      </div>
    </ProtectedLayout>
  )
}
