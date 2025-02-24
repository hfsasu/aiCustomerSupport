import { HeroSectionWithBeamsAndGrid } from "@/components/homepage"
import { Chatbot } from "@/components/chat/Chatbot"
import { StickyCards } from "@/components/features"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <HeroSectionWithBeamsAndGrid />
      <StickyCards />
      <FAQ />
      <Footer />
    </>
  )
}
