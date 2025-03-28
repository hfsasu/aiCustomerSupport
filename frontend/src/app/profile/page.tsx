import { OrderHistory } from "@/components/order/OrderHistory"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in?redirect=/profile")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="mb-12 p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {user.emailAddresses[0]?.emailAddress}
          </p>
          <p>
            <span className="font-medium">Name:</span> {user.firstName} {user.lastName}
          </p>
          <p>
            <span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <OrderHistory />
    </div>
  )
}

