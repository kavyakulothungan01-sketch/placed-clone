'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Inter } from 'next/font/google'
import { supabase } from '@/utils/supabase'

// IMPORT YOUR NEW CHATBOT COMPONENT HERE:
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

// ==========================================
// 🛠️ EMBEDDED SETTINGS
// ==========================================
const WHATSAPP_NUMBER = "917907597197" 
const WHATSAPP_MESSAGE = "Hi PLACED team! I would like to know more about the institutional programs."

interface Alumni {
  id: string | number;
  image_path: string;
  name: string;
  company: string;
  testimony?: string;
  short_quote?: string;
}

export default function AlumniPage() {
  const [alumniData, setAlumniData] = useState<Alumni[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Localized mouse tracking strictly for the animated background blobs
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY, currentTarget } = e
    const { width, height, left, top } = currentTarget.getBoundingClientRect()
    mouseX.set((clientX - left) / width - 0.5)
    mouseY.set((clientY - top) / height - 0.5)
  }

  const blob1X = useTransform(mouseX, [-0.5, 0.5], [80, -80])
  const blob1Y = useTransform(mouseY, [-0.5, 0.5], [80, -80])
  const blob2X = useTransform(mouseX, [-0.5, 0.5], [-60, 60])
  const blob2Y = useTransform(mouseY, [-0.5, 0.5], [-60, 60])

  useEffect(() => {
    const fetchAlumni = async () => {
      const { data } = await supabase.from('alumni').select('*')
      if (data) setAlumniData(data)
      setIsLoading(false)
    }
    fetchAlumni()
  }, [])

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className={`relative overflow-hidden ${inter.className}`}>
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0, y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }} 
            className="fixed inset-0 z-[999] bg-[#031A2D] flex flex-col items-center justify-center gap-6"
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

      {/* SOLID FIXED NAVIGATION BAR - NO DIMMING */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: isLoading ? 0.6 : 0 }} 
        className="fixed w-full top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 py-4 bg-white z-[100] border-b border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="relative w-32 md:w-40 h-10 md:h-12 flex items-center justify-start overflow-visible">
            <Image src="/placeduplogo.jpg" alt="Placed Logo" fill sizes="(max-width: 768px) 128px, 160px" className="object-contain object-left md:object-center scale-125 md:scale-150 origin-left" priority />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 font-black text-[11px] lg:text-xs uppercase tracking-widest text-[#052742]">
          <Link href="/" className="hover:text-[#0DABAE] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#0DABAE] transition-colors">About Us</Link>
          <Link href="/programs" className="hover:text-[#0DABAE] transition-colors">Programs</Link>
          <Link href="/mentors" className="hover:text-[#0DABAE] transition-colors">Mentors</Link>
          <Link href="/#leadership" className="hover:text-[#0DABAE] transition-colors">Leadership</Link>
          <Link href="/alumni" className="text-[#0DABAE] transition-colors">Alumni</Link>
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

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-[#052742]/50 backdrop-blur-sm z-[90] md:hidden" />
            <motion.div initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }} transition={{ duration: 0.2, ease: "easeOut" }} className="fixed top-20 right-4 w-56 bg-white shadow-2xl rounded-xl p-6 border border-slate-100 flex flex-col gap-5 z-[100] text-left md:hidden origin-top-right">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Home</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">About Us</Link>
              <Link href="/programs" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Programs</Link>
              <Link href="/mentors" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Mentors</Link>
              <Link href="/#leadership" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Leadership</Link>
              <Link href="/alumni" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#0DABAE] transition-colors uppercase tracking-widest">Alumni</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER */}
      <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#031A2D] text-white pt-10 pb-24 px-4 md:px-8 mt-[72px] md:mt-[80px] relative overflow-hidden z-20">
        
        {/* Dynamic Animated Blobs Background */}
        <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0DABAE]/10 rounded-full blur-[120px] pointer-events-none transition-transform ease-out duration-500 z-0" />
        <motion.div style={{ x: blob2X, y: blob2Y }} className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none transition-transform ease-out duration-500 z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center mt-8 md:mt-12">
            <Link href="/" className="text-[#0DABAE] hover:text-white font-bold text-xs md:text-sm mb-6 inline-block transition-colors uppercase tracking-widest relative z-20">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Alumni <span className="text-[#0DABAE]">Success</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">
              Read the inspiring stories of our scholars who bridged the gap to their dream careers.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-[#0DABAE] font-black animate-pulse py-20 uppercase tracking-widest">
              Loading success stories...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {alumniData.map((alumni) => (
                <div key={alumni.id} className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 backdrop-blur-md hover:border-[#0DABAE]/50 transition-colors flex flex-col group h-full shadow-2xl hover:-translate-y-2 duration-300 relative z-10">
                  
                  {/* TOP PROFILE SECTION - Photo, Name, and Company */}
                  <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5 relative z-10">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0DABAE] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(13,171,174,0.3)]">
                      <Image src={alumni.image_path} alt={alumni.name} fill sizes="(max-width: 768px) 56px, 56px" className="object-cover object-top" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base leading-tight">{alumni.name}</div>
                      <div className="text-[9px] text-[#0DABAE] font-black uppercase tracking-widest leading-tight mt-1">{alumni.company}</div>
                    </div>
                  </div>

                  {/* BOTTOM TESTIMONY SECTION - Block Justified Text */}
                  <div className="flex-1 relative mt-2">
                    <div className="absolute -top-6 -left-2 text-6xl text-[#0DABAE]/20 font-black leading-none pointer-events-none select-none">{"\""}</div>
                    <p className="text-[13px] md:text-sm leading-relaxed text-slate-300 relative z-10 text-justify hyphens-auto mt-2">
                      {alumni.testimony || alumni.short_quote}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] flex flex-col-reverse gap-4">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer" aria-label="Chat with us on WhatsApp">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
          <svg className="w-8 h-8 md:w-10 md:h-10 relative z-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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