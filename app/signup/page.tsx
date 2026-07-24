'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter } from 'next/font/google'
import { supabase } from '@/utils/supabase'

const inter = Inter({ subsets: ['latin'] })

const PLAYSTORE_LINK = "https://lynde.page.link/ofUJ"

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // 🚀 New verification state tracking
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [otpToken, setOtpToken] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institutionName: '',
    userType: ''
  })

  // STEP 1: Handled by Supabase Auth (Triggers Resend to pass token)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Using Supabase Auth signUp to handle user generation and trigger Resend
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: crypto.randomUUID(), // Generates a secure random password on the fly
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          institution_name: formData.institutionName,
          user_type: formData.userType,
        }
      }
    })

    setIsSubmitting(false)

    if (error) {
      alert("Verification Error: " + error.message)
      console.error(error)
    } else {
      // Transition smooth entry into OTP input window
      setStep('otp')
    }
  }

  // STEP 2: Verify the 6-digit code and explicitly lock data to the 'leads' database
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    // Verify token against Supabase auth instance
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: otpToken,
      type: 'signup'
    })

    if (verifyError) {
      alert("Invalid or expired OTP token. Please check again.")
      setIsVerifying(false)
      return
    }

    // Now that authentication is solid, write the profile context safely down to your database
    const { error: dbError } = await supabase
      .from('leads')
      .insert([
        { 
          full_name: formData.fullName, 
          email: formData.email, 
          phone: formData.phone, 
          institution_name: formData.institutionName,
          user_type: formData.userType 
        }
      ])

    setIsVerifying(false)

    if (dbError) {
      alert("Verification succeeded, but database tracking failed: " + dbError.message)
      console.error(dbError)
    } else {
      setIsSuccess(true)
    }
  }

  return (
    <div className={`min-h-screen flex bg-slate-50 ${inter.className}`}>
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#052742] text-white flex-col justify-between p-10 xl:p-16 relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-[#0DABAE]/20 blur-[100px] rounded-full pointer-events-none"
        />

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-4 xl:mb-6 hover:opacity-80 transition-opacity">
            <div className="relative w-56 h-16 md:w-72 md:h-20 xl:w-80 xl:h-24">
               <Image src="/placeddownlogo.png" alt="Placed Logo" fill className="object-contain object-left" priority />
            </div>
          </Link>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl xl:text-5xl font-black mb-4 xl:mb-6 leading-tight">
            Empowering Institutions. <br className="hidden xl:block"/><span className="text-[#0DABAE]">Advancing Student Outcomes.</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-slate-300 text-base xl:text-lg mb-8 max-w-md font-medium ">
            PLACED partners with colleges and academic institutions to deliver structured career readiness programs, competitive exam preparation frameworks, and industry-oriented student development initiatives designed for long-term student success.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4 xl:space-y-6">
            {["Corporate Readiness & Employability Training", "Competitive Exam & Aptitude Development", " Industry-Aligned Career Progression Support"].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-[#0DABAE]/20 flex items-center justify-center text-[#0DABAE] shrink-0 font-bold text-xs">✓</div>
                <p className="text-sm font-bold tracking-wide">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
          © 2026 PLACED. Infinite Possibilities.
        </div>
      </div>

      {/* RIGHT SIDE - THE CONDITIONAL FORM ROUTE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 relative">
        <Link href="/" className="absolute top-6 right-6 xl:top-8 xl:right-8 text-sm font-bold text-slate-400 hover:text-[#052742] transition-colors">
          ✕ Close
        </Link>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              step === 'details' ? (
                // VIEW ONE: Collect profile/institution properties
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="mb-6 xl:mb-8 text-center lg:text-left">
                    <h2 className="text-3xl font-black text-[#052742] mb-2 xl:mb-3">Partner With Us</h2>
                    <p className="text-slate-500 text-xs xl:text-sm font-medium">Share your institution details and our partnership team will connect with you to explore collaboration opportunities.</p>
                  </div>

                  <form onSubmit={handleRequestOtp} className="space-y-3 xl:space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-2.5 xl:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all font-medium text-sm" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">OFFICIAL Email Address</label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 xl:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all font-medium text-sm" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">cONTACT Number</label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 xl:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all font-medium text-sm" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">Institution / Organization Name</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.institutionName}
                        onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                        className="w-full px-4 py-2.5 xl:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all font-medium text-sm" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">I am a...</label>
                      <select 
                        required 
                        value={formData.userType}
                        onChange={(e) => setFormData({...formData, userType: e.target.value})}
                        className="w-full px-4 py-2.5 xl:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all font-medium appearance-none text-sm"
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="college rep">College Representative</option>
                        <option value="Training off">Training & Placement Officer</option>
                        <option value="institution admin">Institution Administrator</option>
                        <option value="faculty coordinator">Faculty coordinator</option>
                        <option value="academic partner">Academic Partner</option>
                        <option value="Corporate partner">Corporate Partner</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#052742] text-white py-3 rounded-xl font-black text-sm hover:bg-[#0DABAE] transition-colors shadow-lg mt-2 xl:mt-4 flex justify-center items-center h-12 xl:h-14 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "SEND VERIFICATION CODE"
                      )}
                    </button>
                  </form>

                  <div className="mt-5 xl:mt-6 pt-4 xl:pt-5 border-t border-slate-200 text-center lg:text-left">
                    <p className="text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 xl:mb-3">Or download the app to know more</p>
                    <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-105 transition-transform">
                      <Image src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width={135} height={40} className="h-8 md:h-10 w-auto object-contain" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                // VIEW TWO: OTP Code capture screen
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="mb-6 xl:mb-8 text-center lg:text-left">
                    <h2 className="text-3xl font-black text-[#052742] mb-2 xl:mb-3">Verify Your Email</h2>
                    <p className="text-slate-500 text-xs xl:text-sm font-medium">
                      We have dispatched a 6-digit verification security code to <strong className="text-[#052742]">{formData.email}</strong>. Enter it below to validate your partnership inquiry.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] xl:text-xs font-black text-[#052742] uppercase tracking-widest">Enter 6-Digit OTP</label>
                      <input 
                        required 
                        type="text" 
                        maxLength={6}
                        placeholder="123456"
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))} // Strips everything but integers
                        className="w-full text-center tracking-[1em] font-mono text-xl px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0DABAE] focus:ring-2 focus:ring-[#0DABAE]/20 transition-all" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isVerifying || otpToken.length !== 6}
                      className="w-full bg-[#052742] text-white py-3 rounded-xl font-black text-sm hover:bg-[#0DABAE] transition-colors shadow-lg flex justify-center items-center h-12 xl:h-14 disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "VERIFY & SUBMIT APPLICATION"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="w-full text-xs font-bold text-slate-400 hover:text-[#052742] text-center transition-colors pt-2"
                    >
                      ← Back to edit details
                    </button>
                  </form>
                </motion.div>
              )
            ) : (
              // SUCCESS BANNER STATE
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-[#0DABAE]/10 text-[#0DABAE] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                <h2 className="text-3xl font-black text-[#052742] mb-4">Email Verified!</h2>
                <h3 className="text-xl font-black text-slate-700 mb-2">Request Securely Logged</h3>
                <p className="text-slate-500 font-medium mb-8">Thank you for your interest in PLACED. Your organization details have been authorized. Our executive team will connect within 24 hours.</p>
                <Link href="/" className="inline-block bg-[#052742] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#0DABAE] transition-colors shadow-lg">
                  Return to Home
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}