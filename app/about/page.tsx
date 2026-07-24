'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, Variants } from 'framer-motion'
import { Inter } from 'next/font/google'

// IMPORT YOUR NEW CHATBOT COMPONENT HERE:
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

// ==========================================
// 🛠️ EMBEDDED SETTINGS
// ==========================================
const WHATSAPP_NUMBER = "917907597197"
const WHATSAPP_MESSAGE = "Hi PLACED team! I would like to know more about the institutional programs."

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function AboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false) }, 500) // Shorter loading for subpages
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className={`relative overflow-hidden ${inter.className}`}>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }}
            className="fixed inset-0 z-[999] bg-[#02111E] flex flex-col items-center justify-center gap-6"
          >
            <div className="w-24 md:w-32 h-auto relative">
              <svg viewBox="0 0 100 50" className="w-full h-auto drop-shadow-[0_0_8px_rgba(13,171,174,0.5)]">
                <path
                  d="M 50 25 C 65 5, 95 5, 95 25 C 95 45, 65 45, 50 25 C 35 5, 5 5, 5 25 C 5 45, 35 45, 50 25 Z"
                  fill="none" stroke="rgba(13,171,174,0.15)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                />
                <motion.path
                  d="M 50 25 C 65 5, 95 5, 95 25 C 95 45, 65 45, 50 25 C 35 5, 5 5, 5 25 C 5 45, 35 45, 50 25 Z"
                  fill="none" stroke="#0DABAE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, pathOffset: 0 }}
                  animate={{ pathLength: [0, 0.5, 0], pathOffset: [0, 0.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOLID FIXED NAVIGATION BAR - ZERO DIMMING / ZERO BLUR */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: isLoading ? 0.6 : 0 }}
        className="fixed w-full top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 py-4 bg-white z-[100] border-b border-slate-200 shadow-md"
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="relative w-32 md:w-40 h-10 md:h-12 flex items-center justify-start overflow-visible">
            <Image src="/placeduplogo.jpg" alt="Placed Logo" fill sizes="(max-width: 768px) 128px, 160px" className="object-contain object-left md:object-center scale-125 md:scale-150 origin-left" priority />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 font-black text-[11px] lg:text-xs uppercase tracking-widest text-[#052742]">
          <Link href="/" className="hover:text-[#0DABAE] transition-colors">Home</Link>
          <Link href="/about" className="text-[#0DABAE] transition-colors">About Us</Link>
          <Link href="/programs" className="hover:text-[#0DABAE] transition-colors">Programs</Link>
          <Link href="/mentors" className="hover:text-[#0DABAE] transition-colors">Mentors</Link>
          <Link href="/#leadership" className="hover:text-[#0DABAE] transition-colors">Leadership</Link>
          <Link href="/alumni" className="hover:text-[#0DABAE] transition-colors">Alumni</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/signup" className="bg-[#052742] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold hover:bg-[#0DABAE] transition-all shadow-xl text-xs md:text-sm">
            <span className="whitespace-nowrap">Book Demo</span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden w-10 h-10 bg-slate-50 rounded-full flex flex-col justify-center items-center gap-1 hover:bg-slate-100 border border-slate-200 transition-colors z-50 relative">
            <motion.span animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-4 h-0.5 bg-[#052742] block transition-transform"></motion.span>
            <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-4 h-0.5 bg-[#052742] block transition-opacity"></motion.span>
            <motion.span animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-4 h-0.5 bg-[#052742] block transition-transform"></motion.span>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DROPDOWN MENU - Solid Background */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-[#052742]/50 backdrop-blur-sm z-[90] md:hidden" />
            <motion.div initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }} transition={{ duration: 0.2, ease: "easeOut" }} className="fixed top-20 right-4 w-56 bg-white shadow-2xl rounded-xl p-6 border border-slate-100 flex flex-col gap-5 z-[100] text-left md:hidden origin-top-right">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Home</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#0DABAE] transition-colors uppercase tracking-widest">About Us</Link>
              <Link href="/programs" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Programs</Link>
              <Link href="/mentors" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Mentors</Link>
              <Link href="/#leadership" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Leadership</Link>
              <Link href="/alumni" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Alumni</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER - mt-[72px] md:mt-[80px] added to clear the solid navbar */}
      <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#02111E] text-white pt-10 pb-24 px-4 md:px-8 mt-[72px] md:mt-[80px] relative overflow-hidden group">

        {/* Interactive Mouse Spotlight Accent */}
        <motion.div
          className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 z-0"
          style={{ background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.12), transparent 70%)` }}
        />

        {/* High-End Matrix Grid Background Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none z-0"></div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto relative z-10">

          {/* Navigation Return Action */}
          <button
            onClick={() => router.back()}
            className="text-[#0DABAE] hover:text-white font-black text-xs md:text-sm mb-16 inline-block transition-colors uppercase tracking-[0.2em] text-left mt-8 md:mt-12"
          >
            ← Go Back
          </button>

          {/* LANDSCAPE HERO HEADER */}
          <div className="mb-14 border-b border-white/10 pb-10">
            <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-tight">
              About <span className="text-[#0DABAE]">PLACED</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-300 text-base md:text-xl leading-relaxed font-medium tracking-wide max-w-4xl text-justify">
              PLACED is built on a simple belief: education should be accessible, relevant, and capable of leading to real outcomes for the people who engage with it. As learning and careers continue to change, it’s clear that education can no longer rely on rigid systems or outdated methods. The way people learn, grow, and prepare for the future has evolved and PLACED exists to grow with that change. We focus on rethinking how learning is delivered and applied, so it remains useful beyond the classroom and meaningful in real-world contexts.
            </motion.p>
          </div>

          {/* RESTRUCTURED MISSION & VISION SECTION WITH SVG GRAPHIC LOGOS */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-4 mb-20">

            {/* OUR VISION COMPONENT */}
            <motion.div variants={fadeUp} className="flex flex-col items-start space-y-4">
              <div className="flex items-center gap-4">
                {/* Vision Vector Geometric Node */}
                <div className="w-12 h-12 rounded-xl bg-[#0DABAE]/10 flex items-center justify-center text-[#0DABAE] shrink-0 border border-[#0DABAE]/20 shadow-[0_0_15px_rgba(13,171,174,0.15)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Our Vision</h3>
              </div>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed text-justify pl-1">
                Our vision is to build an inclusive education platform that allows learners from different backgrounds to explore possibilities through learning that adapts to their needs and the world around them. We believe quality education should not be restricted by location, format, or circumstance. When used with intent, technology has the power to widen access, improve relevance, and create lasting impact.
              </p>
            </motion.div>

            {/* OUR MISSION COMPONENT */}
            <motion.div variants={fadeUp} className="flex flex-col items-start space-y-4">
              <div className="flex items-center gap-4">
                {/* Mission Vector Target Node */}
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#0DABAE] shrink-0 border border-white/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Our Mission</h3>
              </div>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed text-justify pl-1">
                At PLACED, our mission is simple: to design education that leads to tangible outcomes. By combining technology with practical, engaging teaching methods, we aim to help learners build clarity, confidence, and capability. We focus on understanding and application, so learning translates into progress academically, professionally, and personally.
              </p>
            </motion.div>

          </motion.div>

          {/* CLOSING ANCHOR ROW */}
          <motion.div variants={fadeUp} className="border-t border-white/10 pt-10 text-center space-y-6">
            <p className="max-w-3xl mx-auto font-medium text-slate-400 text-sm md:text-base leading-relaxed italic">
              Education will continue to evolve, and PLACED is committed to evolving alongside it. By staying grounded in purpose while adapting to emerging needs, we work toward making outcome-driven education accessible to all, without losing sight of structure, responsibility, or long-term impact.
            </p>
            <div className="font-black uppercase text-[#0DABAE] tracking-[0.25em] text-sm md:text-lg pt-2">
              Infinite Possibilities, Definite Outcome.
            </div>
          </motion.div>

          {/* SOCIAL MEDIA HUB & PHONE BLOCK */}
          <motion.div variants={fadeUp} className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center space-y-6">
            <div className="flex gap-4 items-center justify-center">
              {/* LinkedIn Link */}
              <a href="https://www.linkedin.com/company/placedtech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="LinkedIn Profile">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              {/* Instagram Link */}
              <a href="https://www.instagram.com/placed.official?igsh=MTU5ZzBiOGtyYzRneQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="Instagram Profile">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              {/* Telegram Link */}
              <a href="https://t.me/placed_community" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="Telegram Community">
                <svg className="w-4 h-4 fill-currentColor pl-[1px]" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.204.1.13.136.708z" /></svg>
              </a>
            </div>

            <div className="text-xs md:text-sm font-black uppercase text-slate-400 tracking-widest">
              Official Line: <a href="tel:+917907597197" className="text-[#0DABAE] hover:underline font-bold font-mono tracking-wide transition-colors ml-1">+91 79075 97197</a>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] flex flex-col-reverse gap-4">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer" aria-label="Chat with us on WhatsApp">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
          <svg className="w-8 h-8 md:w-10 md:h-10 relative z-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
        </a>
        <button onClick={() => setIsChatOpen(true)} className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#0DABAE] text-[#052742] rounded-full shadow-[0_0_20px_rgba(13,171,174,0.3)] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20" aria-label="Open Chatbot">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      </div>

      {/* CHATBOT MODAL */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-24 left-6 md:bottom-28 md:left-8 z-[120] w-[350px] h-[500px] max-w-[calc(100vw-3rem)] bg-[#02111E] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
            <button onClick={() => setIsChatOpen(false)} className="absolute top-3 right-3 z-50 bg-[#0DABAE]/20 hover:bg-[#0DABAE]/40 text-[#0DABAE] rounded-full p-1.5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}