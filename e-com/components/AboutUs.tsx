"use client"

import { motion } from "framer-motion"

export default function AboutUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(217, 91%, 60%)' }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-yellow-500/10 backdrop-blur-sm mb-6"
          >
            <span className="text-xl md:text-2xl">🏢</span>
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Notre histoire</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Qui <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Sommes-Nous</span> ?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full" />
            
            <div className="relative z-10 space-y-6">
              <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed text-center">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Hasilaza</span>
                {" "}est une entreprise commerciale spécialisée dans l'usinage de tricycles et la grande distribution.
              </p>
              
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed text-center max-w-4xl mx-auto">
                Excellant dans les prestations de service depuis quelques années, elle a attiré de nombreuses structures 
                désireuses d'acquérir ses produits. La société et ses cadres dirigeants disposent d'une expérience solide 
                et d'une grande compréhension des affaires.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">+5</div>
                  <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Années d'expérience</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">100%</div>
                  <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Satisfaction client</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">N°1</div>
                  <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">En tricycles</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
