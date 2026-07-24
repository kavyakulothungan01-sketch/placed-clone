'use client'

import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useMotionTemplate, Variants } from 'framer-motion'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function AcademicNavigatorPage() {
  const router = useRouter()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div onMouseMove={handleMouseMove} className={`min-h-screen bg-[#02111E] text-white pt-24 pb-24 px-4 md:px-8 relative overflow-hidden group ${inter.className}`}>
      {/* Mouse Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.12), transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none z-0"></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl mx-auto relative z-10">
        
        {/* Go Back Link */}
        <button 
          onClick={() => router.back()} 
          className="text-[#0DABAE] hover:text-white font-bold text-xs md:text-sm mb-12 inline-block transition-colors uppercase tracking-widest text-left"
        >
          ← Go Back
        </button>
        
        {/* HERO HEADER SECTION */}
        <div className="mb-12 md:mb-16">
          <motion.span variants={fadeUp} className="text-[#0DABAE] font-black tracking-widest uppercase text-xs md:text-sm block mb-4 border border-[#0DABAE]/30 bg-[#0DABAE]/10 w-max px-4 py-1.5 rounded-full">
            Higher Studies Guidance
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-tight">
            Academic <span className="text-[#0DABAE]">Navigator</span>
          </motion.h1>
        </div>

        {/* BROCHURE CONTENT SUMMARY - SINGLE PARAGRAPH STRUCTURE */}
        <motion.div variants={staggerContainer} className="mb-20 max-w-3xl">
          <motion.p 
            variants={fadeUp}
            className="text-slate-300 text-base md:text-lg leading-relaxed font-medium text-justify"
          >
            Many graduating students face intense confusion when navigating the transition between entering the workforce, preparing for competitive exams, or pursuing higher studies. To resolve this, PLACED provides clear guidance through a structured framework that aligns postgraduate selections, professional pathways, and learning tracks directly with each student{"'"}s personal interests and long-term career goals. This initiative is heavily supported by a strategic collaboration with Indian Edu Hub, which grants students structured administrative support and open access to diverse higher education opportunities. Crucially, the system integrates these pathways, allowing students to concurrently pursue postgraduate studies while actively preparing for placements or government exams, offering continuous skill development as a value-added ecosystem support with absolutely no hidden costs.
          </motion.p>
        </motion.div>

        {/* PROFILE ACTION ROW - LINKED TO DASHBOARD */}
        <motion.div variants={fadeUp} className="bg-[#0DABAE] rounded-2xl p-8 md:p-12 text-[#052742] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(13,171,174,0.3)] relative z-10">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Academic Profiling Dashboard</h3>
            <p className="font-bold text-[#052742]/80 text-sm max-w-xl">Access your personal mapping parameters to discover your optimal higher education or professional path.</p>
          </div>
          <a 
            href="https://suggest.indianeduhub.in/?id=IEHPPLAC-00880" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#052742] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#052742] transition-colors shrink-0 text-center shadow-xl"
          >
            Go To Dashboard →
          </a>
        </motion.div>
        
      </motion.div>
    </div>
  )
}