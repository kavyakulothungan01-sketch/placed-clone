'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, Variants } from 'framer-motion'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface Category {
  name: string;
  items: string[];
}

interface Module {
  title: string;
  desc: string;
  categories: Category[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

// ----------------------------------------------------
// FULLY REBUILT DATA STRUCTURE FOR NESTED ACCORDIONS
// ----------------------------------------------------
const MODULES = [
  {
    title: 'Aptitude & Analytical Skills',
    desc: 'Focus on skills most frequently assessed during recruitment screening.',
    categories: [
      {
        name: 'Quantitative Aptitude',
        items: ['Number Systems', 'Ratio and Proportions', 'Percentages', 'Averages', 'Profit and Loss', 'Simple and Compound Interest', 'Time and Work', 'Time, Speed and Distance', 'Data Interpretation (DI)', 'Secondary: Permutation & Combination, Probability']
      },
      {
        name: 'Logical Reasoning',
        items: ['Syllogisms', 'Blood Relations', 'Direction Sense', 'Coding and Decoding', 'Cause and Effect', 'Assumptions', 'Puzzles', 'Seating Arrangements', 'Clocks and Calendars', 'Image-based reasoning', 'Secondary: Critical Reasoning']
      },
      {
        name: 'Verbal Ability: Grammar and Sentence Structure',
        items: ['Error Detection / Error Spotting', 'Sentence Correction / Improvement', 'Phrase Replacement', 'Fill in the Blanks (Grammar-based)', 'Subject-Verb Agreement', 'Tenses and Sequence of Tenses', 'Active and Passive Voice', 'Direct and Indirect Speech (Reported Speech)', 'Modifiers and Parallelism']
      },
      {
        name: 'Vocabulary and Word Usage',
        items: ['Idioms and Phrases', 'Synonyms and Antonyms', 'One-Word Substitutions', 'Spellings', 'Contextual Vocabulary / Word Usage', 'Word Analogies', 'Homophones and Confusing Words', 'Reading and Comprehension']
      },
      {
        name: 'Reading Comprehension (RC)',
        items: ['Cloze Test', 'Theme Detection', 'Deriving Conclusions']
      },
      {
        name: 'Verbal Reasoning and Coherence',
        items: ['Para Jumbles (Sentence Rearrangement)', 'Sentence Completion', 'Paragraph Completion', 'Critical Reasoning', 'Statement and Assumption / Argument', 'Logical Deduction / Syllogisms']
      }
    ]
  },
  {
    title: 'Communication & Soft Skills',
    desc: 'Developing clarity, confidence, and professionalism for academic and professional environments.',
    categories: [
      {
        name: 'Communication Foundations',
        items: ['Clear verbal expression', 'Listening and understanding', 'Organising thoughts', 'Building confidence']
      },
      {
        name: 'Voice & Delivery',
        items: ['Voice modulation and pace', 'Pronunciation clarity', 'Speaking naturally under evaluation']
      },
      {
        name: 'Professional Communication',
        items: ['Formal etiquette', 'Email basics', 'Meeting behavior']
      },
      {
        name: 'Behavioural Intelligence',
        items: ['Building rapport', 'Active listening', 'Managing emotions']
      },
      {
        name: 'Teamwork & Collaboration',
        items: ['Working effectively in teams', 'Handling disagreements', 'Giving and receiving feedback']
      }
    ]
  },
  {
    title: 'Personal Development & Profile Building',
    desc: 'Building the right mindset, self-management skills, and presenting yourself professionally.',
    categories: [
      {
        name: 'Attitude & Growth Mindset',
        items: ['Learning-oriented behaviour', 'Ownership and accountability', 'Adaptability and resilience']
      },
      {
        name: 'Goal Setting',
        items: ['Realistic academic/career goals', 'Identifying strengths', 'Personal growth pathways']
      },
      {
        name: 'Professional Presence',
        items: ['Body language', 'First impressions', 'Professional etiquette', 'Personal branding']
      },
      {
        name: 'Resume Development',
        items: ['Structuring effective resumes', 'Highlighting achievements', 'Avoiding common mistakes', 'Tailoring for roles']
      },
      {
        name: 'LinkedIn Profile Building',
        items: ['Writing strong headlines', 'Building visibility', 'Networking etiquette']
      }
    ]
  },
  {
    title: 'Recruitment Readiness & Digital Literacy',
    desc: 'Preparing for the final stages GDs, Interviews, Mock Drives, and workplace literacy.',
    categories: [
      {
        name: 'Group Discussion Training',
        items: ['Evaluation criteria', 'Entering discussions', 'Structuring ideas', 'Leadership without dominating']
      },
      {
        name: 'Interview Preparation',
        items: ['Self-introduction', 'Behavioural questions', 'Answer structuring', 'Mock interviews']
      },
      {
        name: 'Mock Recruitment Experience',
        items: ['Aptitude simulation', 'GD simulation', 'Interview simulation', 'Performance review']
      },
      {
        name: 'Professional Etiquette & Workplace Readiness',
        items: ['Corporate workplace etiquette', 'Email & calendar professionalism', 'Meeting and presentation etiquette', 'Business communication norms', 'Office hierarchy and reporting structures', 'Workplace conflict handling']
      },
      {
        name: 'Digital & AI Workplace Literacy',
        items: ['Professional use of AI tools', 'Prompting for productivity', 'MS Office / Google Workspace essentials', 'Digital collaboration platforms', 'Data handling basics', 'Workplace cybersecurity awareness']
      },
      {
        name: 'Career Strategy & Industry Orientation',
        items: ['Understanding job roles & career ladders', 'Industry expectation mapping', 'Corporate culture adaptation', 'Domain-specific hiring insights', 'Career growth frameworks', 'Transitioning from campus to corporate']
      }
    ]
  }
]

// ----------------------------------------------------
// CUSTOM COMPONENT: NESTED ACCORDION CARD
// ----------------------------------------------------
const ModuleCard = ({ mod, isOpen, onToggle }: { mod: Module, isOpen: boolean, onToggle: () => void }) => {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);

  // Track prevIsOpen to reset openCategoryIndex when transition happens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setOpenCategoryIndex(null);
    }
  }

  const toggleCategory = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking a sub-header from closing the main card
    setOpenCategoryIndex(openCategoryIndex === idx ? null : idx);
  };

  return (
    <motion.div 
      layout
      variants={fadeUp} 
      className={`border rounded-2xl backdrop-blur-sm transition-all duration-500 relative z-10 group overflow-hidden flex flex-col ${
        isOpen 
          ? 'bg-[#031A2D] border-[#0DABAE]/50 shadow-[0_0_40px_rgba(13,171,174,0.15)]' 
          : 'bg-white/5 border-white/10 hover:border-[#0DABAE]/50 hover:-translate-y-1 cursor-pointer'
      }`}
    >
      {/* MAIN HEADER (Clickable to open/close whole card) */}
      <div onClick={onToggle} className={`p-8 ${isOpen ? 'cursor-pointer pb-6' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-xl md:text-2xl font-black transition-colors ${isOpen ? 'text-[#0DABAE]' : 'text-white'}`}>
            {mod.title}
          </h3>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
            className={`p-1 rounded-full shrink-0 ml-4 transition-colors ${isOpen ? 'bg-[#0DABAE] text-[#02111E]' : 'text-[#0DABAE]'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </motion.div>
        </div>
        
        {/* Only show description if the card is CLOSED */}
        <AnimatePresence>
          {!isOpen && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-slate-400 text-sm md:text-base leading-relaxed"
            >
              {mod.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* INNER CONTENT (Categories and lists) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 px-8 pb-8"
          >
            <div className="border-t border-white/10 pt-2 flex flex-col">
              {mod.categories.map((cat: Category, cIdx: number) => {
                const isCatOpen = openCategoryIndex === cIdx;
                
                return (
                  <div key={cIdx} className="border-b border-white/5 last:border-b-0">
                    
                    {/* CATEGORY SUB-HEADER */}
                    <button 
                      onClick={(e) => toggleCategory(cIdx, e)}
                      className="w-full flex items-center justify-between py-4 text-left group/sub"
                    >
                      <span className={`font-bold transition-colors text-sm md:text-base ${isCatOpen ? 'text-white' : 'text-slate-300 group-hover/sub:text-white'}`}>
                        {cat.name}
                      </span>
                      <span className="text-[#0DABAE] text-lg font-bold ml-4 w-6 h-6 flex items-center justify-center rounded bg-white/5">
                        {isCatOpen ? '-' : '+'}
                      </span>
                    </button>

                    {/* CATEGORY LIST ITEMS */}
                    <AnimatePresence>
                      {isCatOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="pl-4 pb-4 space-y-2 mt-1">
                            {cat.items.map((item: string, iIdx: number) => (
                              <li key={iIdx} className="flex gap-3 text-slate-400 text-sm leading-relaxed items-start">
                                <span className="text-[#0DABAE] font-black shrink-0 mt-0.5">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ----------------------------------------------------
// MAIN PAGE EXPORT
// ----------------------------------------------------
export default function CorporateReadinessPage() {
  const router = useRouter()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Track which main module is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const handleToggleMainCard = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  }

  return (
    <div onMouseMove={handleMouseMove} className={`min-h-screen bg-[#02111E] text-white pt-24 pb-24 px-4 md:px-8 relative overflow-hidden group ${inter.className}`}>
      {/* Mouse Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(13, 171, 174, 0.15), transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none z-0"></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-6xl mx-auto relative z-10">
        
        <button 
          onClick={() => router.back()} 
          className="text-[#0DABAE] hover:text-white font-bold text-xs md:text-sm mb-8 inline-block transition-colors uppercase tracking-widest"
        >
          ← Go Back
        </button>
        
        <div className="mb-16 md:mb-24">
          <motion.span variants={fadeUp} className="text-[#0DABAE] font-black tracking-widest uppercase text-xs md:text-sm block mb-4 border border-[#0DABAE]/30 bg-[#0DABAE]/10 w-max px-4 py-1.5 rounded-full">
            PLACEMENT & CAREER FOCUS
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Corporate <span className="text-[#0DABAE]">Readiness</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-3xl text-base md:text-lg leading-relaxed font-medium">
            Bridging the gap between institutional learning and professional excellence. Our framework covers the entire spectrum of employability—from raw analytical power to high-level corporate emotional intelligence.
          </motion.p>
        </div>

        {/* NESTED MODULES RENDER */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 items-start">
          {MODULES.map((mod, idx) => (
            <ModuleCard 
              key={idx} 
              mod={mod} 
              isOpen={expandedIndex === idx} 
              onToggle={() => handleToggleMainCard(idx)} 
            />
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div variants={fadeUp} className="bg-[#0DABAE] rounded-2xl p-8 md:p-12 text-[#052742] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(13,171,174,0.3)] relative z-10 mt-8">
          <div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2">Ready to transform your campus?</h3>
            <p className="font-medium text-[#052742]/80 max-w-xl">Implement this detailed curriculum at your institution to guarantee placement success.</p>
          </div>
          <Link href="/signup" className="bg-[#052742] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#052742] transition-colors shrink-0">
            Partner With Us
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}