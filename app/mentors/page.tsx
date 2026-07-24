'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'
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

interface Mentor {
  id: string | number;
  name: string;
  role?: string;
  company?: string;
  image_url?: string;
  initials?: string;
  description?: string;
  biography?: string;
}

export default function MentorsPage() {
  const [mentorsData, setMentorsData] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [dbError, setDbError] = useState<string | null>(null)

  // Pure hardware-accelerated global coordinates tracking
  const mouseX = useMotionValue(-1000) 
  const mouseY = useMotionValue(-1000)

  // Global mouse tracker effect for the background glow
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [mouseX, mouseY])

  // Fetch from Supabase with Strict Error Catching
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
           setDbError("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.")
           setIsLoading(false)
           return
        }

        const { data, error } = await supabase.from('mentors').select('*')
        console.log("🕵️ DATA FROM SUPABASE:", data)
        
        if (error) {
          setDbError(`Supabase Error: ${error.message}`)
        } else if (data && data.length > 0) {
          setMentorsData(data)
        } else {
          setDbError("Connection successful, but the 'mentors' table is currently empty (0 rows found).")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setDbError(`System Exception: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMentors()
  }, [])

  // Sanitize the role/company string to safely remove any trailing "@" symbol
  const getCleanRole = (mentor: Mentor) => {
    const rawRole = mentor.company || mentor.role || ""
    return rawRole.replace(/@\s*$/, '').trim()
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className={`relative overflow-hidden ${inter.className}`}>
      
      {/* 🌟 INTENSIFIED GLOBAL MOUSE GLOW OVERLAY 🌟 */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 opacity-100 mix-blend-screen" 
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.15), transparent 80%)` }} 
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0, y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }} 
            className="fixed inset-0 z-[999] bg-[#052742] flex flex-col items-center justify-center gap-6"
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

      {/* SOLID FIXED NAVIGATION BAR */}
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
          <Link href="/mentors" className="text-[#0DABAE] transition-colors">Mentors</Link>
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

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-[#052742]/30 backdrop-blur-sm z-[90] md:hidden" />
            <motion.div initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }} transition={{ duration: 0.2, ease: "easeOut" }} className="fixed top-20 right-4 w-56 bg-white shadow-2xl rounded-xl p-6 border border-slate-100 flex flex-col gap-5 z-[100] text-left md:hidden origin-top-right">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Home</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">About Us</Link>
              <Link href="/programs" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Programs</Link>
              <Link href="/mentors" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#0DABAE] transition-colors uppercase tracking-widest">Mentors</Link>
              <Link href="/#leadership" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Leadership</Link>
              <Link href="/alumni" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Alumni</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#052742] text-white pt-10 pb-20 px-4 md:px-8 mt-[72px] md:mt-[80px] relative overflow-hidden z-20">
        
        {/* Soft Skills & Aptitude Floating Ambient Symbols */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-10 text-[#0DABAE]/10 text-9xl font-serif font-black pointer-events-none z-0">{"\""}</motion.div>
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-40 right-20 text-[#0DABAE]/10 text-9xl font-black pointer-events-none z-0">?</motion.div>
        <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/4 text-[#0DABAE]/10 text-8xl font-black pointer-events-none z-0">!</motion.div>
        
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 md:mb-16 text-center mt-8 md:mt-12">
            <Link href="/" className="text-[#0DABAE] hover:text-white font-bold text-xs md:text-sm mb-6 inline-block transition-colors uppercase tracking-widest relative z-20">← Back to Home</Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Learn From The <span className="text-[#0DABAE]">Best</span></h1>
            <p className="text-slate-300 max-w-2xl mx-auto font-medium text-sm md:text-base">Industry experts bringing real-world corporate expectations directly to your campus.</p>
          </div>

          {/* ERROR DIAGNOSTICS DISPLAY */}
          {isLoading ? (
            <div className="text-center text-[#0DABAE] font-black animate-pulse py-20 uppercase tracking-widest">Loading Mentors...</div>
          ) : dbError ? (
            <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-md">
              <h3 className="text-2xl font-black text-red-400 mb-4">Database Connection Issue</h3>
              <p className="text-slate-300 font-mono bg-black/40 p-4 rounded-xl border border-red-500/20 mb-6 inline-block text-left break-all">
                {dbError}
              </p>
              <p className="text-sm font-bold text-slate-400">Please fix this issue in your Supabase dashboard or .env.local file.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {mentorsData.map((mentor) => (
                <motion.div 
                  key={mentor.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => setSelectedMentor(mentor)} 
                  className="group cursor-pointer bg-[#031A2D]/40 hover:bg-[#031A2D]/80 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/10 hover:border-[#0DABAE] hover:shadow-[0_0_20px_rgba(13,171,174,0.3)] transition-all flex flex-col justify-between h-full shadow-2xl relative z-20"
                >
                  <div className="flex flex-col items-center justify-center w-full my-auto text-center">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 border border-white/5 bg-slate-900 shrink-0 shadow-md">
                      {mentor.image_url ? (
                         <Image src={mentor.image_url} alt={mentor.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover object-top pointer-events-none" />
                      ) : (
                         <div className="w-full h-full bg-[#0DABAE]/10 text-[#0DABAE] flex items-center justify-center text-3xl font-black">
                           {mentor.initials}
                         </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#052742]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                        <span className="text-white font-bold text-[9px] tracking-widest uppercase">Profile</span>
                      </div>
                    </div>
                    
                    <div className="w-full text-center mt-2">
                      <h3 className="font-black text-white text-sm md:text-lg leading-tight tracking-tight drop-shadow-sm truncate">{mentor.name}</h3>
                      <p className="text-[8px] md:text-[10px] text-[#0DABAE] font-black uppercase tracking-widest leading-tight mt-1.5 opacity-90 truncate">{getCleanRole(mentor)}</p>
                    </div>
                  </div>
                </motion.div>
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

      {/* POPUP MODAL ARCHITECTURE */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#052742]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-xl p-8 md:p-10 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setSelectedMentor(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#052742] transition-colors z-50">✕</button>
              
              <div className="text-center pt-2">
                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border-2 border-[#0DABAE] aspect-square shadow-md bg-[#052742]">
                  {selectedMentor.image_url ? (
                     <Image src={selectedMentor.image_url} alt={selectedMentor.name} fill sizes="(max-width: 768px) 112px, 112px" className="object-cover object-top pointer-events-none" />
                  ) : (
                     <div className="w-full h-full bg-[#0DABAE]/10 text-[#0DABAE] flex items-center justify-center text-4xl font-black">
                       {selectedMentor.initials}
                     </div>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-black mb-1 text-[#052742] leading-tight tracking-tight">{selectedMentor.name}</h3>
                <p className="text-[#0DABAE] font-black uppercase tracking-widest text-[10px] md:text-xs mb-6 truncate">{getCleanRole(selectedMentor)}</p>
                
                <button className="w-full bg-[#052742] text-white py-3 md:py-4 rounded-xl font-bold hover:bg-[#0DABAE] transition-colors text-sm md:text-base shadow-md">Book a Session</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}