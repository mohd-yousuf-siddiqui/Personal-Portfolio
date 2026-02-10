import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ClockIntro from './components/ClockIntro'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'

const App = () => {
  const [showIntro, setShowIntro] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const progressRef = useRef(null)

  const handleIntroComplete = () => {
    setShowIntro(false)
    setTimeout(() => setContentReady(true), 100)
  }

  useEffect(() => {
    if (!contentReady) return
    
    let ticking = false

    const updateProgress = () => {
      if (progressRef.current) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = (window.scrollY / totalHeight) * 100
        progressRef.current.style.width = `${progress}%`
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [contentReady])

  return (
    <div className="bg-black text-white min-h-screen antialiased selection:bg-white/10">
      {/* Clock Intro */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <ClockIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentReady ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[60]">
          <div 
            ref={progressRef}
            className="h-full bg-white/90 will-change-[width] transition-none"
            style={{ width: '0%' }}
          />
        </div>

        {/* Subtle Grain Texture */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <main className="relative">
          <Hero />
          
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionDivider />
            <AnimatedSection><Projects /></AnimatedSection>
            <SectionDivider />
            <AnimatedSection><Skills /></AnimatedSection>
            <SectionDivider />
            <AnimatedSection><Education /></AnimatedSection>
            <SectionDivider />
            <AnimatedSection><Contact /></AnimatedSection>
          </div>
          
          <Footer />
          <BackToTop />
        </main>
      </motion.div>
    </div>
  )
}

// Animated Section Wrapper
const AnimatedSection = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// Section Divider
const SectionDivider = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div ref={ref} className="py-8 flex items-center justify-center">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 64 } : { width: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
      />
    </div>
  )
}

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-zinc-900/50 mt-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex items-center gap-3 group w-fit"
            >
              {/* Logo Image */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800">
                <img 
                  src="/logo.png"
                  alt="Yousuf Siddiqui"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-medium text-white text-sm group-hover:text-zinc-300 transition-colors">Yousuf Siddiqui</p>
                <p className="text-xs text-zinc-600">Frontend Developer</p>
              </div>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Building digital experiences with clean code and modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {['Projects', 'Skills', 'Education', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 w-fit"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-2">
              {[
                { href: "https://github.com/mohd-yousuf-siddiqui", label: "GitHub", icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/> },
                { href: "https://linkedin.com/in/mohd-yousuf-siddiqui-1b94ab391", label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                { href: "mailto:yousuf21120060@gmail.com", label: "Email", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill={idx === 2 ? "none" : "currentColor"} stroke={idx === 2 ? "currentColor" : "none"} viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {currentYear} Yousuf Siddiqui. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  )
}

// Back to Top Button
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 400)
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-200 z-40"
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default App