'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'
import { Inter } from 'next/font/google'
import { supabase } from '@/utils/supabase'

// IMPORT YOUR NEW CHATBOT COMPONENT HERE:
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

// ==========================================
// 🛠️ EMBEDDED SETTINGS & GLOBAL HELPERS
// ==========================================
const WHATSAPP_NUMBER = "917907597197" 
const WHATSAPP_MESSAGE = "Hi PLACED team! I would like to know more about the institutional programs."
const PLAYSTORE_LINK = "https://lynde.page.link/ofUJ"

// Global helper to safely clean roles/companies of trailing '@' symbols
const getCleanRole = (mentor: any) => {
  const rawRole = mentor?.company || mentor?.role || ""
  return rawRole.replace(/@\s*$/, '').trim()
}

// --- THE 7-PHASE METHODOLOGY ---
const PHASES = [
  { id: '01', title: 'Diagnostic Analysis', desc: 'Tech-enabled baseline assessments to evaluate learning gaps.' },
  { id: '02', title: 'Skill Benchmarking', desc: 'Establishing starting points for aptitude and communication.' },
  { id: '03', title: 'Structured Training', desc: 'Progressive learning designed to build real-world readiness.' },
  { id: '04', title: 'Continuous Monitoring', desc: 'Real-time performance tracking for accuracy and consistency.' },
  { id: '05', title: 'Mock Simulations', desc: 'End-to-end processes replicating real selection pressure.' },
  { id: '06', title: 'Outcome Measurement', desc: 'Data-driven evaluation of student performance vs baseline.' },
  { id: '07', title: 'Continuity Planning', desc: 'Focused refinement of weak areas with structured feedback.' }
]

// --- THE PLACED ECOSYSTEM ---
const ECOSYSTEM_PILLARS = [
  { id: 'corporate-readiness', title: 'Corporate Readiness', duration: 'Placement Focus', imagePath: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'public-exam', title: 'Public Exam Foundation', duration: 'Govt. Exam Focus',  imagePath: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 'academic-navigator', title: 'Academic Navigator', duration: 'Higher Studies', imagePath: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
]

// TEAM DATA
const COFOUNDERS = [
  { id: 'abhishek', name: 'A S ABHISHEK', role: 'Co-Founder & CEO', imagePath: '/leadership/abhishek.png', bio: 'A S Abhishek leads PLACED, an EdTech platform focused on bridging the gap between students and professional career opportunities across corporate placements, competitive government exams, and higher education pathways. He has trained 10,000+ students across 40+ colleges in South India in aptitude, communication, and career readiness. As CEO, he drives the company’s strategy, institutional partnerships, and program development.', linkedin: 'https://www.linkedin.com/in/a-s-abhishek-472327230/' },
  { id: 'vishnu', name: 'VISHNU MOHAN R', role: 'Co-Founder & COO', imagePath: '/leadership/vishnu.jpeg', bio:'Vishnu Mohan R brings 12+ years of experience in the EdTech and training industry. He has mentored students across mechanical design, competitive government examinations, and career readiness programs for corporate placements and higher education pathways. At PLACED, he leads operations, academic delivery, and program implementation.', linkedin: 'https://www.linkedin.com/in/vishnu-mohan-r-798118357/' },
  { id: 'vigneswaran', name: 'VIGNESWARAN A R', role: 'Co-Founder & CAO', imagePath: '/leadership/vigneswaran.jpeg', bio: 'Vigneswaran A R brings 7+ years of experience in EdTech and placement training, having trained 50,000+ students across 50+ colleges. He specializes in Quantitative Aptitude and Logical Reasoning, with a strong focus on building problem-solving and analytical skills. At PLACED, he leads academic design, curriculum development, and training methodology, creating structured outcome-driven learning programs.', linkedin: 'https://www.linkedin.com/in/vigneswaran-ar-9b83ba395/' },
]

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

// ==========================================
// 🧊 INTERACTIVE HERO CUBE
// ==========================================
const InteractiveCube = () => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [60, -60])
  const rotateY = useTransform(x, [-100, 100], [-60, 60])

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center [perspective:1200px] cursor-grab active:cursor-grabbing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#0DABAE]/20 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170%] h-[170%] border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-transparent border-t-[#0DABAE]/40 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0DABAE] rounded-full blur-[10px] animate-pulse" />

      <motion.div
        drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.6}
        style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ rotateX: [-15, 15, -15], rotateY: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        whileDrag={{ scale: 1.1, transition: { duration: 0.2 } }}
        className="relative w-40 h-40 md:w-48 md:h-48 z-10"
      >
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-[#052742]/90 flex items-center justify-center font-black text-white text-xl md:text-2xl backdrop-blur-md shadow-[0_0_30px_rgba(13,171,174,0.3)]" style={{ transform: "translateZ(96px)" }}>EXPLORE</div>
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-[#031A2D]/90 flex items-center justify-center font-black text-[#0DABAE] text-xl md:text-2xl backdrop-blur-md" style={{ transform: "rotateY(180deg) translateZ(96px)" }}>BUILD</div>
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-[#0DABAE]/90 flex items-center justify-center font-black text-[#052742] text-xl md:text-2xl backdrop-blur-md" style={{ transform: "rotateY(90deg) translateZ(96px)" }}>PREPARE</div>
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-[#0DABAE]/90 flex items-center justify-center font-black text-[#052742] text-xl md:text-2xl backdrop-blur-md" style={{ transform: "rotateY(-90deg) translateZ(96px)" }}>ADVANCE</div>
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-white/95 flex items-center justify-center font-black text-[#052742] text-xl md:text-2xl backdrop-blur-md" style={{ transform: "rotateX(90deg) translateZ(96px)" }}>PERFORM</div>
        <div className="absolute inset-0 border-4 border-[#0DABAE] bg-white/95 flex items-center justify-center font-black text-[#052742] text-xl md:text-2xl backdrop-blur-md" style={{ transform: "rotateX(-90deg) translateZ(96px)" }}>ACHIEVE</div>
      </motion.div>
    </div>
  )
}

// ==========================================
// 🖱️ WORKFLOW SECTION
// ==========================================
const WorkflowSection = () => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section id="workflow" onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }} className="py-20 md:py-28 px-4 md:px-8 bg-slate-50 relative overflow-hidden group">
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.12), transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#052742_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none z-0"></div>
      
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-7xl mx-auto relative z-10">
        <motion.h2 variants={fadeUp} className="text-center text-4xl md:text-5xl font-black mb-12 md:mb-16 uppercase tracking-tighter text-[#052742]">
          The Placed <span className="text-[#0DABAE]">Journey</span>
        </motion.h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative">
          {[ 
            { step: '', title: 'Apply', desc: 'Submit profile and pass the diagnostic assessment.' },
            { step: '', title: 'Upskill', desc: 'Progressive learning mapped to real corporate needs.' },
            { step: '', title: 'Simulate', desc: 'Experience end-to-end mock recruitment pressure.' },
            { step: '', title: 'Outcome', desc: 'Achieve success in placements or higher education.' }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeUp} className="bg-white/80 backdrop-blur-xl p-4 md:p-8 rounded-xl border border-slate-200 shadow-xl hover:border-[#0DABAE] transition-all hover:-translate-y-2 relative overflow-hidden">
              <span className="text-4xl md:text-6xl font-black text-[#0DABAE]/30 transition-colors block mb-1 md:mb-4">{item.step}</span>
              <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-[#052742] leading-tight">{item.title}</h3>
              <p className="text-slate-600 text-[9px] md:text-sm font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

const getActiveTransformClass = (idx: number) => {
  switch (idx) {
    case 0: // Phase 1 (left: 10%)
      return '-translate-x-[15%] -translate-y-1/2 md:-translate-x-1/2';
    case 1: // Phase 2 (left: 25%)
    case 6: // Phase 7 (left: 25%)
      return '-translate-x-[30%] -translate-y-1/2 md:-translate-x-1/2';
    case 3: // Phase 4 (left: 75%)
    case 5: // Phase 6 (left: 75%)
      return '-translate-x-[70%] -translate-y-1/2 md:-translate-x-1/2';
    case 4: // Phase 5 (left: 90%)
      return '-translate-x-[85%] -translate-y-1/2 md:-translate-x-1/2';
    default:
      return '-translate-x-1/2 -translate-y-1/2';
  }
};

// ==========================================
// ♾️ FAST INTERACTIVE INFINITY LOOP
// ==========================================
const InteractiveInfinity = () => {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => { setActivePhase((prev) => (prev + 1) % PHASES.length) }, 2500);
    return () => clearInterval(timer);
  }, []);

  const nodePositions = [
    { top: '50%', left: '10%' },
    { top: '22.5%', left: '25%' },
    { top: '50%', left: '45%' },
    { top: '77.5%', left: '75%' },
    { top: '50%', left: '90%' },
    { top: '22.5%', left: '75%' },
    { top: '77.5%', left: '25%' },
  ];

  return (
    <div className="w-full relative h-[350px] md:h-[400px]">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <motion.path
          d="M 100 200 C 100 50, 400 50, 500 200 C 600 350, 900 350, 900 200 C 900 50, 600 50, 500 200 C 400 350, 100 350, 100 200 Z"
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"
        />
        <motion.path
          d="M 100 200 C 100 50, 400 50, 500 200 C 600 350, 900 350, 900 200 C 900 50, 600 50, 500 200 C 400 350, 100 350, 100 200 Z"
          fill="none" stroke="#0DABAE" strokeWidth="4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
          style={{ filter: 'drop-shadow(0 0 8px #0DABAE)' }}
        />
      </svg>

      {PHASES.map((phase, idx) => {
        const isActive = activePhase === idx;
        return (
          <div
            key={phase.id}
            className={`absolute z-20 flex items-center justify-center transition-all duration-300 ease-out ${
              isActive ? getActiveTransformClass(idx) : '-translate-x-1/2 -translate-y-1/2'
            }`}
            style={{ top: nodePositions[idx].top, left: nodePositions[idx].left }}
          >
            {/* Switched to a standard div with CSS transition-all to prevent text clipping */}
            <div
              onClick={() => setActivePhase(idx)}
              className={`cursor-pointer overflow-hidden flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ease-out ${
                isActive 
                  ? 'bg-[#052742] border-[#0DABAE] p-4 w-[200px] md:w-[240px] min-h-[120px] shadow-[0_0_25px_rgba(13,171,174,0.4)]' 
                  : 'bg-[#031A2D] border-[rgba(255,255,255,0.2)] w-8 h-8 md:w-10 md:h-10 hover:border-[#0DABAE]'
              }`}
            >
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div 
                    key={`content-${phase.id}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center w-full"
                  >
                    <span className="text-[#0DABAE] font-black text-xs block mb-1">{phase.id}</span>
                    <h4 className="text-white font-bold text-[10px] md:text-sm leading-tight mb-2">{phase.title}</h4>
                    <p className="text-slate-300 text-[9px] md:text-[10px] leading-relaxed hidden sm:block">{phase.desc}</p>
                  </motion.div>
                ) : (
                  <motion.span 
                    key={`number-${phase.id}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white font-black text-[10px] md:text-xs flex items-center justify-center w-full h-full"
                  >
                    {phase.id}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==========================================
// 👥 MEET THE LEADERSHIP (Appears BEFORE Faculty Pool)
// ==========================================
const TeamSection = ({ setSelectedFounder }: { setSelectedFounder: (founder: any) => void }) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section id="leadership" onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }} className="py-20 md:py-28 px-4 md:px-8 bg-slate-50 relative overflow-hidden group border-t border-slate-200">
      
      {/* Targeted Mouse Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.12), transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#052742_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none z-0"></div>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2 variants={fadeUp} className="text-center text-4xl md:text-5xl font-black mb-10 md:mb-16 uppercase tracking-tighter text-[#052742]">
          Meet the <span className="text-[#0DABAE]">Leadership</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {COFOUNDERS.map((founder) => (
            <motion.div key={founder.id} variants={fadeUp} className="group cursor-pointer bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 border border-slate-100 hover:border-[#0DABAE] max-w-[300px] mx-auto w-full" onClick={() => setSelectedFounder(founder)}>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 md:mb-6 border border-slate-100 bg-slate-100">
                <Image src={founder.imagePath} alt={founder.name} fill sizes="(max-width: 768px) 300px, 300px" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#052742]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <span className="text-white font-bold text-[10px] md:text-sm tracking-widest uppercase">Profile</span>
                </div>
              </div>
              <h3 className="text-base md:text-xl font-black text-[#052742] group-hover:text-[#0DABAE] transition-colors px-1 leading-tight">{founder.name}</h3>
              <p className="text-[10px] md:text-sm font-bold text-slate-500 mt-1 px-1">{founder.role.split(',')[0]}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ==========================================
// 🎓 FACULTY POOL SECTION (Appears AFTER Leadership)
// ==========================================
const MentorsSection = ({ mentorsData, setSelectedMentor }: { mentorsData: any[], setSelectedMentor: (mentor: any) => void }) => {
  const [facultyOffset, setFacultyOffset] = useState(0);

  useEffect(() => {
    if (mentorsData.length === 0) return;
    const interval = setInterval(() => {
      setFacultyOffset((prev) => (prev + 1) % mentorsData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mentorsData]);

  const filteredMentors = mentorsData.length > 0 ? [
    mentorsData[facultyOffset % mentorsData.length],
    mentorsData[(facultyOffset + 1) % mentorsData.length],
    mentorsData[(facultyOffset + 2) % mentorsData.length],
    mentorsData[(facultyOffset + 3) % mentorsData.length],
  ] : [];

  return (
    <section id="mentors" className="py-20 md:py-28 bg-[#052742] relative overflow-hidden text-white group border-t border-white/5">
      {/* Aptitude & Soft Skills Background Elements Updated */}
      <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-10 text-[#0DABAE]/10 text-9xl font-serif font-black pointer-events-none z-0">"</motion.div>
      <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-20 text-[#0DABAE]/10 text-9xl font-black pointer-events-none z-0">?</motion.div>
      <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/4 text-[#0DABAE]/10 text-8xl font-black pointer-events-none z-0">!</motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6 w-full text-center md:text-left">
           <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter w-full md:w-auto">
             LEARN FROM THE <span className="text-[#0DABAE]">BEST.</span>
           </h2>
           <Link href="/mentors" className="bg-[#0DABAE] hover:bg-white hover:text-[#052742] text-white px-6 md:px-8 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-[10px] md:text-xs shrink-0 shadow-lg shadow-[#0DABAE]/20 hover:scale-105">
             Show More →
           </Link>
         </div>
         
         <div className="w-full relative min-h-[290px] md:min-h-[350px]">
           <AnimatePresence mode="wait">
             <motion.div 
               key={facultyOffset} 
               initial={{ opacity: 0, x: 20 }} 
               animate={{ opacity: 1, x: 0 }} 
               exit={{ opacity: 0, x: -20 }} 
               transition={{ duration: 0.5 }} 
               className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 items-stretch auto-rows-fr w-full"
             >
               {filteredMentors.map((mentor: any, index: number) => (
                  mentor && (
                    <div 
                      key={`${mentor.id}-${index}`} 
                      onClick={() => setSelectedMentor(mentor)}
                      className="bg-[#031A2D]/80 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/10 hover:border-[#0DABAE] hover:shadow-[0_0_20px_rgba(13,171,174,0.3)] transition-colors flex flex-col justify-between group h-full shadow-2xl cursor-pointer"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 border border-white/5 bg-slate-900 shrink-0 shadow-md">
                        {mentor.image_url ? (
                          <img src={mentor.image_url} alt={mentor.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 pointer-events-none" />
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
                        <div className="font-black text-white text-sm md:text-lg leading-tight tracking-tight drop-shadow-sm truncate">{mentor.name}</div>
                        <div className="text-[8px] md:text-[10px] text-[#0DABAE] font-black uppercase tracking-widest leading-tight mt-1.5 opacity-90 truncate">
                          {getCleanRole(mentor)}
                        </div>
                      </div>
                    </div>
                  )
               ))}
             </motion.div>
           </AnimatePresence>
         </div>
      </div>
    </section>
  )
}

// ==========================================
// 🎓 ALUMNI SECTION 
// ==========================================
const AlumniSection = ({ alumniData, alumniIndex, displayedAlumni }: any) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  // Animated Background Blobs
  const blob1X = useTransform(mouseX, [-0.5, 0.5], [80, -80]);
  const blob1Y = useTransform(mouseY, [-0.5, 0.5], [80, -80]);
  const blob2X = useTransform(mouseX, [-0.5, 0.5], [-60, 60]);
  const blob2Y = useTransform(mouseY, [-0.5, 0.5], [-60, 60]);

  return (
    <section id="alumni" onMouseMove={handleMouseMove} className="py-20 md:py-28 bg-[#031A2D] relative overflow-hidden text-white group border-t border-white/5">
      
      {/* Dynamic Animated Blobs Background Restored */}
      <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#0DABAE]/10 rounded-full blur-[100px] pointer-events-none transition-transform ease-out duration-500 z-0" />
      <motion.div style={{ x: blob2X, y: blob2Y }} className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none transition-transform ease-out duration-500 z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6">
           <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center md:text-left text-white">
             Alumni <span className="text-[#0DABAE]">Success</span>
           </h2>
           <Link href="/alumni" className="bg-[#0DABAE] hover:bg-white hover:text-[#052742] text-white px-6 md:px-8 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-[10px] md:text-xs shrink-0 shadow-lg shadow-[#0DABAE]/20 hover:scale-105">
             Read All Stories →
           </Link>
         </div>
         
         {alumniData.length > 0 ? (
           <AnimatePresence mode="wait">
             <motion.div key={alumniIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
               {displayedAlumni.map((alumni: any, index: number) => (
                  alumni && (
                    <div key={`${alumni.id}-${index}`} className="bg-white/5 p-4 md:p-8 rounded-xl border border-white/10 backdrop-blur-sm hover:border-[#0DABAE]/50 transition-colors flex flex-col justify-between group h-full shadow-2xl relative z-10">
                      <div>
                        <div className="text-2xl md:text-4xl text-[#0DABAE] mb-1 md:mb-4 font-serif group-hover:-translate-y-1 transition-transform">"</div>
                        <p className="italic text-[9px] md:text-sm leading-relaxed text-slate-300 mb-4 md:mb-6">{alumni.short_quote}</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4 border-t border-white/10 pt-3 md:pt-4 mt-auto">
                        <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#0DABAE] shrink-0 group-hover:scale-105 transition-transform">
                          <Image src={alumni.image_path} alt={alumni.name} fill sizes="(max-width: 768px) 32px, 48px" className="object-cover object-top" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-[10px] md:text-sm leading-tight">{alumni.name}</div>
                          <div className="text-[8px] md:text-[10px] text-[#0DABAE] font-black uppercase tracking-widest leading-tight">{alumni.company}</div>
                        </div>
                      </div>
                    </div>
                  )
               ))}
             </motion.div>
           </AnimatePresence>
         ) : (
           <div className="text-center text-slate-400 py-10 animate-pulse">Loading alumni stories...</div>
         )}
      </div>
    </section>
  )
}

// ==========================================
// 🚀 MAIN RUNTIME CONTROLLER
// ==========================================
export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [selectedFounder, setSelectedFounder] = useState<any>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false) 

  const hasTriggeredPopup = useRef(false) 
  
  const [alumniData, setAlumniData] = useState<any[]>([])
  const [mentorsData, setMentorsData] = useState<any[]>([])
  const [alumniIndex, setAlumniIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false) }, 1000)
    
    const handleScroll = () => { 
      if (window.scrollY > 600 && !hasTriggeredPopup.current) {
        setShowPopup(true)
        hasTriggeredPopup.current = true; 
        window.removeEventListener('scroll', handleScroll) 
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => { 
      clearTimeout(timer); 
      window.removeEventListener('scroll', handleScroll) 
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const [alumniRes, mentorsRes] = await Promise.all([
        supabase.from('alumni').select('*'),
        supabase.from('mentors').select('*')
      ])
      
      if (alumniRes.data) setAlumniData(alumniRes.data)
      if (mentorsRes.data) setMentorsData(mentorsRes.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (alumniData.length === 0) return
    const carouselTimer = setInterval(() => {
      setAlumniIndex((prev) => (prev + 1) % alumniData.length)
    }, 3000)
    return () => clearInterval(carouselTimer)
  }, [alumniData])

  const displayedAlumni = alumniData.length > 0 ? [
    alumniData[alumniIndex % alumniData.length],
    alumniData[(alumniIndex + 1) % alumniData.length],
    alumniData[(alumniIndex + 2) % alumniData.length],
    alumniData[(alumniIndex + 3) % alumniData.length],
  ] : []

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className={`relative overflow-hidden ${inter.className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0, y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }} 
            className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center gap-6"
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
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-32 md:w-40 h-8 md:h-10 mt-2"
            >
               <Image src="/placeduplogo.jpg" alt="Placed Logo" fill sizes="(max-width: 768px) 128px, 160px" className="object-contain object-center" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white text-[#052742] scroll-smooth overflow-x-hidden relative z-20">
        
        {/* SOLID FIXED NAVIGATION BAR: Remains perfectly opaque and pinned at top */}
        <motion.nav 
          initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: isLoading ? 1.1 : 0 }} 
          className="fixed w-full top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 py-4 bg-white z-[100] border-b border-slate-100 shadow-sm"
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
            <a href="#leadership" className="hover:text-[#0DABAE] transition-colors">Leadership</a>
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
              <motion.div initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }} transition={{ duration: 0.2, ease: "easeOut" }} className="fixed top-20 right-4 w-56 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl p-6 border border-slate-100 flex flex-col gap-5 z-[100] text-left md:hidden origin-top-right">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Home</Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">About Us</Link>
                <Link href="/programs" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Programs</Link>
                <Link href="/mentors" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Mentors</Link>
                <a href="#leadership" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Leadership</a>
                <Link href="/alumni" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#052742] hover:text-[#0DABAE] transition-colors uppercase tracking-widest">Alumni</Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* HERO SECTION - Margin adjusted so content isn't hidden under the fixed nav */}
        <section className="bg-[#052742] mt-[72px] md:mt-[80px] pt-16 pb-16 md:pt-20 md:pb-24 px-4 md:px-8 relative overflow-hidden bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
            <div className="text-center md:text-left">
              <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: isLoading ? 1.3 : 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 md:mb-8 uppercase tracking-tighter">
                INFINITE <span className="text-[#0DABAE]">POSSIBILITIES.</span><br/>DEFINITE <span className="text-[#0DABAE]">OUTCOME.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: isLoading ? 1.5 : 0.4 }} className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xl mx-auto md:mx-0 mb-8 md:mb-12 font-medium">
                Combining technology with practical teaching methods to help learners build clarity, confidence, and capability. Real education for real-world contexts.
              </motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: isLoading ? 1.7 : 0.6 }}>
                <Link href="/programs" className="bg-[#0DABAE] text-white px-8 py-4 md:px-10 md:py-5 rounded-xl font-black text-base md:text-lg hover:scale-105 transition-transform inline-block shadow-2xl shadow-[#0DABAE]/30">
                  EXPLORE PROGRAMS
                </Link>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: isLoading ? 1.5 : 0.4 }} className="flex justify-center relative mt-10 md:mt-0">
              <InteractiveCube />
              <p className="absolute -bottom-6 md:-bottom-8 text-[#0DABAE] text-[10px] md:text-xs font-bold uppercase tracking-widest pointer-events-none z-20 bg-[#052742]/80 px-3 py-1 rounded-full border border-[#0DABAE]/30">Drag me around</p>
            </motion.div>
          </div>
        </section>

        {/* WORKFLOW */}
        <WorkflowSection />

        {/* 7-PHASE ARCHITECTURE */}
        <section id="methodology" className="py-20 md:py-28 px-4 md:px-8 bg-[#052742] relative overflow-hidden text-white group border-t border-white/5">
          <motion.div animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #0DABAE 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                Our 7-Phase <span className="text-[#0DABAE]">Architecture</span>
              </h2>
              <p className="text-slate-300 font-medium text-base md:text-lg max-w-lg mx-auto lg:mx-0">
                We don't just teach. We utilize a highly structured, interactive learning framework designed to build problem-solving ability and real-world readiness from day one.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex justify-center w-full">
              <InteractiveInfinity />
            </motion.div>
          </div>
        </section>

        {/* THE ECOSYSTEM */}
        <section id="ecosystem" className="py-20 md:py-28 px-4 md:px-8 bg-[#031A2D] relative overflow-hidden group border-t border-white/5">
          <motion.div animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0DABAE 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-7xl mx-auto relative z-10">
            <motion.div variants={fadeUp} className="flex flex-col items-center md:items-start mb-10 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-center md:text-left">The Placed <span className="text-[#0DABAE]">Ecosystem</span></h2>
              <p className="mt-4 text-slate-400 font-medium max-w-2xl text-center md:text-left text-sm md:text-base">One connected framework supporting students across multiple career options. Move forward based on your goals and progress without fragmented training efforts.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {ECOSYSTEM_PILLARS.map((course) => (
                <motion.div key={course.id} variants={fadeUp}>
                  <Link href={`/programs/${course.id}`} className="block group bg-[#052742] rounded-xl text-white hover:-translate-y-2 shadow-xl hover:shadow-[#0DABAE]/20 relative overflow-hidden h-[280px] md:h-[320px] flex flex-col justify-end p-6 md:p-8 border border-white/5">
                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                      <Image src={course.imagePath} alt={course.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#031A2D] via-[#052742]/80 to-transparent z-10"></div>
                    <div className="relative z-20">
                      <span className="text-[10px] md:text-xs font-bold text-[#0DABAE] group-hover:text-white uppercase tracking-widest block mb-2 transition-colors"></span>
                      <h3 className="text-2xl md:text-3xl font-black mb-2 leading-tight">{course.title}</h3>
                      <div className="flex justify-between items-center text-slate-300 group-hover:text-white font-medium text-xs md:text-sm mt-4 pt-4 border-t border-white/20">
                        <span>{course.duration}</span>
                        <span className="text-lg md:text-2xl transition-transform group-hover:translate-x-2 text-[#0DABAE]">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TEAM (LEADERSHIP) SECTION MOVED BEFORE MENTORS (FACULTY POOL) */}
        <TeamSection setSelectedFounder={setSelectedFounder} />

        <MentorsSection mentorsData={mentorsData} setSelectedMentor={setSelectedMentor} />
        
        <AlumniSection alumniData={alumniData} alumniIndex={alumniIndex} displayedAlumni={displayedAlumni} />

        {/* FOOTER */}
        <footer className="py-16 md:py-24 px-3.5 md:px-8 relative overflow-hidden text-slate-400 border-t border-white/5" style={{ background: 'linear-gradient(to right, #11112c, #062641)' }}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto] md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-8 relative z-10">
            <div className="flex flex-col md:items-start md:text-left">
              <div className="relative w-40 md:w-56 h-12 md:h-16 mb-6 md:mb-8 overflow-visible flex items-center justify-start">
                 <Image src="/placeddownlogo.png" alt="Placed Logo" fill sizes="(max-width: 768px) 160px, 224px" className="object-contain object-left scale-125 md:scale-150 origin-left" />
              </div>
              <p className="text-slate-400 font-medium leading-relaxed tracking-wide text-[10px] md:text-sm mb-4 max-w-[200px]">
                The premier EdTech platform for ambitious students. One system supporting every student's next step.
              </p>
              <span className="text-[#0DABAE] font-bold block text-[10px] md:text-xs uppercase tracking-widest">Infinite Possibilities.<br/>Definite Outcome.</span>
            </div>
            
            <div className="flex flex-col md:items-start md:text-left pl-0 md:pl-4 lg:pl-0">
              <h4 className="font-black mb-4 uppercase text-[10px] md:text-xs tracking-widest text-white">Explore</h4>
              <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm font-medium">
                <li><Link href="/" className="hover:text-[#0DABAE] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#0DABAE] transition-colors">About Us</Link></li>
                <li><Link href="/programs" className="hover:text-[#0DABAE] transition-colors">Programs</Link></li>
                <li><Link href="/mentors" className="hover:text-[#0DABAE] transition-colors">Mentors</Link></li>
                <li><Link href="/alumni" className="hover:text-[#0DABAE] transition-colors">Alumni Success</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col md:items-start md:text-left">
              <h4 className="font-black mb-4 uppercase text-[10px] md:text-xs tracking-widest text-white">Support & Contact</h4>
              <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm font-medium mb-4">
                <li><a href="#" className="hover:text-[#0DABAE] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#0DABAE] transition-colors">Help Center & FAQ</a></li>
                <li><a href="#" className="hover:text-[#0DABAE] transition-colors">Privacy Policy</a></li>
              </ul>
              <div className="text-[10px] md:text-xs font-black uppercase text-white tracking-widest pt-2">
                Call: <a href="tel:+917907597197" className="text-[#0DABAE] hover:underline font-bold font-mono tracking-wide">+91 79075 97197</a>
              </div>
            </div>
            
            <div className="flex flex-col md:items-start md:text-left w-full pl-0 md:pl-4 lg:pl-0">
              <h4 className="font-black mb-6 uppercase text-[10px] md:text-xs tracking-widest text-white">Connect With Us</h4>
              
              <div className="flex gap-2 md:gap-4 items-center">
                <a href="https://www.linkedin.com/company/placedtech/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="LinkedIn Profile">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://www.instagram.com/placed.official?igsh=MTU5ZzBiOGtyYzRneQ==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="Instagram Profile">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98-.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.youtube.com/@placed.official" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="Visit our YouTube Channel">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://t.me/placed_community" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0DABAE] hover:text-[#02111E] border border-white/10 transition-all shrink-0 shadow-sm" aria-label="Join our Telegram Community">
                  <svg className="w-4 h-4 pl-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.204.1.13.136.708z"/></svg>
                </a>
              </div>
              
              {/* Play Store App Download Button */}
              <div className="mt-8">
                <p className="font-black mb-3 uppercase text-[10px] md:text-xs tracking-widest text-white">Get Our App</p>
                <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-105 transition-transform">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-10 md:h-12 w-auto object-contain" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
            <p>© 2026 PLACED. All rights reserved.</p>
            <p>Designed for the future by NOVA.</p>
          </div>
        </footer>

        {/* FLOATING ACTION BUTTONS */}
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] flex flex-col-reverse gap-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer" aria-label="Chat with us on WhatsApp">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
            <svg className="w-8 h-8 md:w-10 md:h-10 relative z-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          <button onClick={() => setIsChatOpen(true)} className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#0DABAE] text-[#052742] rounded-full shadow-[0_0_20px_rgba(13,171,174,0.3)] hover:scale-110 transition-transform cursor-pointer border-2 border-[#0DABAE]/50" aria-label="Open Chatbot">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </button>
        </div>

        {/* MODALS */}
        <AnimatePresence>
          {selectedMentor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#052742]/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-xl p-8 md:p-10 max-w-md w-full shadow-2xl relative">
                <button onClick={() => setSelectedMentor(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#052742] transition-colors z-50">✕</button>
                
                <div className="text-center pt-2">
                  <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border-2 border-[#0DABAE] aspect-square shadow-md bg-[#052742]">
                    {selectedMentor.image_url ? (
                       <img src={selectedMentor.image_url} alt={selectedMentor.name} className="w-full h-full object-cover object-top pointer-events-none" />
                    ) : (
                       <div className="w-full h-full bg-[#0DABAE]/10 text-[#0DABAE] flex items-center justify-center text-4xl font-black">
                         {selectedMentor.initials}
                       </div>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black mb-1 text-[#052742] leading-tight tracking-tight">{selectedMentor.name}</h3>
                  <p className="text-[#0DABAE] font-black uppercase tracking-widest text-[10px] md:text-xs mb-6 truncate">{getCleanRole(selectedMentor)}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFounder && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#052742]/90 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-y-auto max-h-[85vh]">
                <button onClick={() => setSelectedFounder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-[#052742] w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 z-50 transition-colors">✕</button>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start pt-2">
                  <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-100">
                     <Image src={selectedFounder.imagePath} alt={selectedFounder.name} fill sizes="(max-width: 768px) 128px, 192px" className="object-cover object-top" priority />
                  </div>
                  <div className="w-full text-center md:text-left">
                     <h3 className="text-xl md:text-3xl font-black text-[#052742] leading-tight">{selectedFounder.name}</h3>
                     <p className="text-[10px] md:text-xs font-extrabold text-[#0DABAE] mt-1 md:mt-2 uppercase tracking-widest mb-3 md:mb-4">{selectedFounder.role}</p>
                     <div className="w-10 h-1 bg-[#0DABAE] mb-3 md:mb-4 rounded-full mx-auto md:mx-0"></div>
                     <p className="text-slate-600 leading-relaxed text-xs md:text-sm font-medium whitespace-pre-line">{selectedFounder.bio}</p>
                     <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-100">
                        {selectedFounder.linkedin ? (
                          <a href={selectedFounder.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs font-black text-[#0DABAE] hover:text-[#052742] uppercase tracking-widest transition-colors inline-block">LinkedIn Profile ↗</a>
                        ) : (
                          <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest cursor-not-allowed">LinkedIn Not Available</span>
                        )}
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-24 left-6 md:bottom-28 md:left-8 z-[120] w-[350px] h-[500px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <button onClick={() => setIsChatOpen(false)} className="absolute top-3 right-3 z-50 bg-[#0DABAE]/20 hover:bg-[#0DABAE]/40 text-[#052742] rounded-full p-1.5 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <Chatbot /> 
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM SCROLL POP-UP CARD - Expanded context messaging added! */}
        <AnimatePresence>
          {showPopup && (
             <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[110]">
                <div className="bg-white text-[#052742] p-5 rounded-xl shadow-2xl w-[280px] md:w-[320px] border border-slate-100 flex flex-col gap-3">
                   <div className="flex justify-between items-start w-full">
                      <div className="flex flex-col pr-4">
                        <p className="font-black text-sm md:text-base leading-tight pt-1">Ready to accelerate your career?</p>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 leading-relaxed">Download the PLACED app to access mock tests, expert mentorship, and premium placement resources.</p>
                      </div>
                      <button onClick={() => setShowPopup(false)} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-1.5 rounded-full shrink-0 transition-colors" aria-label="Close popup">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                   </div>
                   <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer" onClick={() => setShowPopup(false)} className="bg-[#052742] text-white py-2.5 rounded-lg font-bold text-xs md:text-sm hover:bg-[#0DABAE] transition-colors text-center w-full shadow-md mt-1">
                     Download Now
                   </a>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}