"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl' 
          : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <img 
                src="/logo/HasilazaMotor.png" 
                alt="Hasilaza Motor" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Hasilaza
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Sénégal
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Accueil" },
              { href: "/produits", label: "Catalogue" },
              { href: "/pieces", label: "Pièces" },
              { href: "/depannage", label: "Dépannage" },
              { href: "/#contact", label: "Contact" },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="tel:+221 765788887">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +221 765788887
              </button>
            </Link>
            <Link href="/#partenaires">
              <button 
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-900 transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
              >
                Nos partenaires
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-slate-900 dark:text-white"
              >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl"
          >
            <div className="flex flex-col p-4 space-y-1">
              {[
                { href: "/", label: "Accueil" },
                { href: "/produits", label: "Catalogue" },
                { href: "/pieces", label: "Pièces" },
                { href: "/depannage", label: "Dépannage" },
                { href: "/#features", label: "Avantages" },
                { href: "/#contact", label: "Contact" },
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
                <Link href="/#partenaires" onClick={() => setIsMobileMenuOpen(false)}>
                  <button 
                    className="w-full py-3 rounded-full text-sm font-semibold text-slate-900 transition-all"
                    style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
                  >
                    Nos partenaires
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
