import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import ProtectedLayout from "@/components/ProtectedLayout"

export default function CheckoutPage() {
  return (
    <ProtectedLayout>
      <CheckoutForm />
    </ProtectedLayout>
  )
}

