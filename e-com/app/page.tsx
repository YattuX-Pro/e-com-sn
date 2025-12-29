import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import BestSellers from "@/components/BestSellers"
import TrustedBy from "@/components/TrustedBy"
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <HeroSection />
      <BestSellers />
      <Features />
      <CTA />
      <TrustedBy />
      <Footer />
    </main>
  )
}
