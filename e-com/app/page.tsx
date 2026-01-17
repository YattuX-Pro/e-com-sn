import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import BestSellers from "@/components/BestSellers"
import SparePartsCarousel from "@/components/SparePartsCarousel"
import AboutUs from "@/components/AboutUs"
import TrustedBy from "@/components/TrustedBy"
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"

export default function Home() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <HeroSection />
      <AboutUs />
      <Features />
      <BestSellers />
      <SparePartsCarousel />
      <CTA />
      <TrustedBy />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
