"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  { id: 1, name: "ANCS", logo: "/logo/ANCS.png" },
  { id: 2, name: "ENABEL", logo: "/logo/Enabel.png" },
  { id: 3, name: "HUMAN APPEAL", logo: "/logo/HUMAN APPEAL.png" },
  { id: 5, name: "QATAR CHARITY", logo: "/logo/QATAR CHARITY.png" },
  { id: 6, name: "SOCODEVI", logo: "/logo/SOCODEVI.png" },
  { id: 7, name: "SOMAPHY", logo: "/logo/LOGOS.png" },
]

export default function TrustedBy() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(217, 91%, 60%), transparent)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6"
          >
            <span className="text-xl">🤝</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Nos partenaires</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            Ils nous font <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Rejoignez les entreprises et organisations qui nous font confiance
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl bg-white shadow-md group-hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 border border-slate-100">
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-300"
                      sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                    />
                  </div>
                </div>
                <p className="text-center mt-3 text-xs font-medium text-slate-600 dark:text-slate-400">{partner.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
