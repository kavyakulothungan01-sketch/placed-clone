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
// FULLY MAPPED PUBLIC EXAM SYLLABUS DATA STRUCTURE
// ----------------------------------------------------
const MODULES = [
  {
    title: 'Quantitative Aptitude',
    desc: 'Comprehensive mathematical fundamentals designed to maximize speed and accuracy.',
    categories: [
      {
        name: 'Number System & Simplification',
        items: ['Divisibility rules, LCM/HCF, Bases', 'Decimal & Fraction operations', 'Rational/Surds', 'BODMAS, approximation, factorization']
      },
      {
        name: 'Percentage, Ratio & Average',
        items: ['Percentage: Calculations and applications', 'Ratio & Proportion: Ages, mixtures', 'Proportion: Direct and inverse', 'Averages: Mean problems and case studies']
      },
      {
        name: 'Profit, Loss & Interest',
        items: ['Profit & Loss: Formulas, Markup/Discount', 'Discount on price evaluations', 'Simple Interest: Formula, time period', 'Compound Interest: Annual, half-yearly']
      },
      {
        name: 'Time, Work & Speed',
        items: ['Time & Work: Work & efficiency problems', 'Pipes & Cistern problems', 'Speed, Distance & Time: Relative speed', 'Boats & Streams', 'Train problems: Length, speed']
      },
      {
        name: 'Algebra, Geometry & Mensuration',
        items: ['Linear & Quadratic Equations: Factoring and variables', 'Geometry: Triangles, Circles, Polygons']
      }
    ]
  },
  {
    title: 'Reasoning Ability',
    desc: 'Logical problem solving, pattern recognition, and analytical thinking.',
    categories: [
      {
        name: 'Series, Analogies & Coding',
        items: ['Series: Numeric progressions, alphabet, alphanumeric', 'Analogies: Verbal and number analogies', 'Coding-Decoding: Letter/number & symbolic coding']
      },
      {
        name: 'Directions & Relations',
        items: ['Direction Test: Distance and logical placement', 'Blood Relations: Family trees', 'Order & Ranking: Placement problems']
      },
      {
        name: 'Syllogism & Puzzles',
        items: ['Syllogism: Statements and Venn diagrams', 'Seating Arrangements: Linear and circular puzzles', 'Puzzles: Floor, Door, and Box puzzles']
      },
      {
        name: 'Miscellaneous Reasoning',
        items: ['Inequalities: Symbolic inequality', 'Clocks and Calendar mechanics', 'Venn Diagrams: Logical Venn and chart puzzles']
      }
    ]
  },
  {
    title: 'English Language',
    desc: 'Mastery of grammar rules, vocabulary, and reading comprehension.',
    categories: [
      {
        name: 'Grammar Fundamentals',
        items: ['Parts of Speech: Noun types, pronoun usage', 'Subject-Verb Agreement rules', 'Tenses & Modals: Present, past, future', 'Preposition usage and articles']
      },
      {
        name: 'Sentence Correction',
        items: ['Voice: Transforming active to passive', 'Speech: Transforming direct to indirect', 'Error Spotting & Identifying grammatical errors', 'Sentence Fill-ups: Grammar-based fill-in blanks']
      },
      {
        name: 'Vocabulary',
        items: ['Introduction to Vocabulary', 'Synonyms & Antonyms', 'One Word Substitutions', 'Idioms & Phrases']
      },
      {
        name: 'Comprehension',
        items: ['Reading strategies', 'Practise', 'Cloze test & Parajumbles', 'Paragraph filing & Rearrangement']
      }
    ]
  },
  {
    title: 'General Awareness',
    desc: 'Comprehensive coverage of history, polity, geography, and economics.',
    categories: [
      {
        name: 'History',
        items: ['Ancient History - IVC, Vedic Age, Mauryan Period', 'Medieval History - Delhi Sultanates and Mughal Empire', 'Modern Indian History - Advent of Europeans, Revolt of 1857, INC Formation, Gandhian Phase and Freedom with Partition']
      },
      {
        name: 'Geography',
        items: ['World Geography - Formation of Earth, Geomorphology, Oceanography & Climatology.', 'Indian Geography - Indian Physiography, Drainage systems and Indian Climate']
      },
      {
        name: 'Polity',
        items: ['Formation of Constitution', 'Fundamental Rights', 'Union & State Executives', 'Judiciary, etc']
      },
      {
        name: 'Economics',
        items: ['Basics of Economy', 'National Income and GDP', 'Budget & Taxes', 'Inflation & Banking']
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
export default function PublicExamPage() {
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
            GOVT. EXAM FOCUS
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Public Exam <span className="text-[#0DABAE]">Foundation</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-3xl text-base md:text-lg leading-relaxed font-medium">
            A significant number of students aim for secure careers through competitive government examinations like <span className="text-[#0DABAE] font-bold">SSC, RRB, and central banking tracks (IBPS/SBI), UPSC(CSAT), PSC and many more</span>. PLACED{"'"}s Public Exam Foundation Program addresses preparation gaps early by combining tech-enabled timed drills, data-oriented concept evaluation, and robust simulated baseline test frameworks.
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
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2">Empower Public Sector Aspirants</h3>
            <p className="font-medium text-[#052742]/80 max-w-xl">Bring structured public exam preparation directly to your institution.</p>
          </div>
          <Link href="/signup" className="bg-[#052742] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#052742] transition-colors shrink-0">
            Schedule a Demo
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}