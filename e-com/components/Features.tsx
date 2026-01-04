"use client"

import { motion } from "framer-motion"

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: "Vision",
    description: "D'ici 2035, Hasilaza Motor vise à devenir le leader dans la vente de motos au Sénégal. À l'horizon 2035, nous aspirons à nous imposer comme la référence incontournable sur le marché africain, en devenant le leader de la vente de motos et de pièces détachées."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: "Mission",
    description: "Notre mission est de fournir à nos clients des motos performantes à des prix abordables, accompagnées d'un service après-vente et d'un savoir-faire technique. Nous offrons des solutions fiables et innovantes pour qu'ils puissent rouler en toute sécurité et sérénité."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Objectifs",
    description: "Proposer une gamme diversifiée de motos neuves et pièces détachées de qualité, adaptée aux besoins de notre clientèle particulière et professionnelle ; Assurer la fiabilité de nos produits ainsi qu'un accompagnement technique d'excellence ; Maintenir un service client exceptionnel avec conseils adaptés, assistance rapide et SAV efficace pour renforcer les relations clients et développer notre communauté."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
    title: "Nos Valeurs",
    description: "Qualité - Proximité - Intégrité - Engagement"
  },
]

export default function Features() {
  return (
    <section className="py-10 md:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-5 dark:opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(217, 91%, 60%)' }}
        />
        <div 
          className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full opacity-5 dark:opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-yellow-500/10 backdrop-blur-sm mb-4 md:mb-6"
          >
            <span className="text-xl md:text-2xl">✨</span>
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Nos avantages</span>
          </motion.div>

          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3 md:mb-6 px-4">
            Pourquoi choisir <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Hasilaza</span> ?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed px-4">
            Plus qu'un simple vendeur, nous sommes votre partenaire de confiance pour une mobilité durable et performante.
          </p>
        </motion.div>

        {/* Tree-like layout */}
        <div className="relative pl-8 md:pl-0">
          {/* Vertical line - Left on mobile, Center on desktop */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-yellow-500 md:transform md:-translate-x-1/2" />
          
          {/* Features in alternating layout */}
          <div className="space-y-4 md:space-y-0">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center md:py-4 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node - Mobile: left side */}
                <div className="absolute left-[-20px] md:hidden flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-[3px] border-white dark:border-slate-900 shadow-md z-10"
                  />
                </div>

                {/* Content Card */}
                <div className={`flex-1 md:w-[44%] ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="group relative bg-white dark:bg-slate-800/50 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className={`flex items-start gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div 
                        className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300"
                      >
                        <div className="text-white scale-75 md:scale-90">
                          {feature.icon}
                        </div>
                      </div>
                      
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Center Node - Desktop only */}
                <div className="hidden md:flex md:w-[12%] justify-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-[3px] border-white dark:border-slate-900 shadow-md z-10"
                  />
                  {/* Horizontal connector line */}
                  <div 
                    className={`absolute top-1/2 h-0.5 w-[calc(50%-8px)] bg-blue-400/60 ${
                      index % 2 === 0 
                        ? 'right-1/2 mr-2' 
                        : 'left-1/2 ml-2'
                    }`}
                  />
                </div>

                {/* Empty space for alternating layout - Desktop only */}
                <div className="hidden md:block md:w-[44%]" />
              </motion.div>
            ))}
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex justify-start md:justify-center mt-4 ml-[-5px] md:ml-0"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-md shadow-yellow-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
