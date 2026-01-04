"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M1 3h15v13H1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const services = [
  { icon: WrenchIcon, title: "Réparation Complète", desc: "Diagnostic et réparation de tous types de pannes mécaniques et électriques" },
  { icon: GearIcon, title: "Entretien Régulier", desc: "Maintenance préventive pour prolonger la durée de vie de votre véhicule" },
  { icon: TruckIcon, title: "Intervention Rapide", desc: "Nos techniciens se déplacent chez vous ou sur le lieu de la panne" },
  { icon: ShieldIcon, title: "Garantie Qualité", desc: "Pièces d'origine et travail garanti pour votre tranquillité" },
]

const steps = [
  { num: "01", title: "Décrivez votre panne", desc: "Expliquez-nous le problème rencontré" },
  { num: "02", title: "Nous vous contactons", desc: "Un technicien vous rappelle sous 30 min" },
  { num: "03", title: "Intervention", desc: "Réparation rapide et professionnelle" },
]

export default function DepannagePage() {
  return (
    <main className="bg-slate-50 dark:bg-slate-950 min-h-screen overflow-hidden">
      <Navbar />

      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/20 mb-6">
                <div className="w-5 h-5 text-blue-500"><WrenchIcon /></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Service Dépannage Expert</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Votre tricycle en <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">panne</span> ?
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">On s'en charge !</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                Notre équipe de techniciens qualifiés intervient rapidement pour remettre votre véhicule en état. Diagnostic précis, réparation garantie.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/depannage/demande" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1">
                  <span>Demander un dépannage</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="tel:+221765788887" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                  <div className="w-5 h-5 text-blue-500"><PhoneIcon /></div>
                  <span>+221 76 578 88 87</span>
                </a>
              </div>
              
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">500+</p>
                  <p className="text-sm text-slate-500">Interventions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">30min</p>
                  <p className="text-sm text-slate-500">Temps de réponse</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">98%</p>
                  <p className="text-sm text-slate-500">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[3rem] rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[3rem] -rotate-6 opacity-20" />
                <div className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 flex flex-col items-center">
                      <div className="w-16 h-16 text-blue-600 mb-3"><WrenchIcon /></div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Réparation</p>
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-6 flex flex-col items-center">
                      <div className="w-16 h-16 text-orange-500 mb-3"><GearIcon /></div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Entretien</p>
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 flex flex-col items-center">
                      <div className="w-16 h-16 text-green-600 mb-3"><ClockIcon /></div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Rapide</p>
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 flex flex-col items-center">
                      <div className="w-16 h-16 text-purple-600 mb-3"><ShieldIcon /></div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Garanti</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Nos Services de Dépannage</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Une expertise complète pour tous vos besoins en réparation et entretien</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <div className="w-7 h-7 text-blue-600 group-hover:text-white"><service.icon /></div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Comment ça marche ?</h2>
            <p className="text-slate-600 dark:text-slate-400">Un processus simple en 3 étapes</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                  <span className="text-6xl font-black bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 bg-clip-text text-transparent">{step.num}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                <div className="w-8 h-8 text-white"><WrenchIcon /></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Besoin d'un dépannage ?</h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto">Ne restez pas bloqué ! Faites votre demande maintenant et notre équipe vous contactera dans les plus brefs délais.</p>
              <Link href="/depannage/demande" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all hover:shadow-xl hover:-translate-y-1">
                <span>Faire une demande</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
