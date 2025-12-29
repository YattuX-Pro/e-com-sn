"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  { id: 1, name: "Partenaire 1", logo: "/logo/logo_1.png" },
  { id: 2, name: "Partenaire 2", logo: "/logo/logo_2.png" },
  { id: 3, name: "Partenaire 3", logo: "/logo/logo_3.png" },
  { id: 4, name: "Partenaire 4", logo: "/logo/logo_4.png" },
  { id: 5, name: "Partenaire 5", logo: "/logo/logo_5.png" },
  { id: 6, name: "Partenaire 6", logo: "/logo/logo_6.png" },
  { id: 7, name: "Partenaire 7", logo: "/logo/logo_7.png" },
]

export default function TrustedBy() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm mb-4"
          >
            <span className="text-xl">🤝</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nos partenaires</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Ils nous font <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Rejoignez les entreprises et organisations qui nous font confiance pour leurs besoins en transport
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full aspect-[3/2] hover:scale-110 transition-transform duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
