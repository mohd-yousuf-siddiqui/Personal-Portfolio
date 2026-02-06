import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Get all sections
      const sections = ['projects', 'skills', 'education', 'contact']
      
      // If at the very top of the page, no section is active
      if (window.scrollY < 300) {
        setActiveSection('')
        return
      }
      
      // Find the current section
      let currentSection = ''
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const offset = 150 // Adjust this value as needed
          
          // Check if the section is in view
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section
            break
          }
        }
      }
      
      // If no section is in the middle, find the closest one above
      if (!currentSection) {
        for (const section of [...sections].reverse()) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top < 150) {
              currentSection = section
              break
            }
          }
        }
      }
      
      setActiveSection(currentSection)
    }
    
    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const navItems = [
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Background */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled 
              ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' 
              : 'bg-transparent'
          }`}
        />
        
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActiveSection('')
              }}
              className="flex items-center gap-3 group"
            >
              {/* Image Logo */}
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-800">
                <img 
                  src="/logo.png"
                  alt="Yousuf Logo"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              </div>
              
              <div className="hidden sm:block">
                <span className="font-medium text-white text-sm">Yousuf</span>
                <span className="text-zinc-600 text-sm">.</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-900/50 border border-zinc-800/50">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1)
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`relative px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute inset-0 bg-zinc-800 rounded-full"
                          transition={{ 
                            type: "spring", 
                            stiffness: 380, 
                            damping: 30 
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection('#contact')}
                className="group relative px-5 py-2 text-sm font-medium overflow-hidden rounded-full"
              >
                <div className="absolute inset-0 bg-white rounded-full" />
                <div className="absolute inset-0 bg-zinc-900 rounded-full translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 text-black group-hover:text-white transition-colors duration-300">
                  Let's Talk
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="w-4 h-4 flex flex-col items-center justify-center gap-1">
                <motion.span
                  animate={{ 
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 2 : 0
                  }}
                  className="w-4 h-0.5 bg-white block origin-center"
                />
                <motion.span
                  animate={{ 
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? -2 : 0
                  }}
                  className="w-4 h-0.5 bg-white block origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 z-50 md:hidden"
            >
              <nav className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1)
                  
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-colors ${
                        isActive 
                          ? 'text-white bg-zinc-800' 
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </motion.button>
                  )
                })}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => scrollToSection('#contact')}
                  className="w-full py-3 bg-white text-black font-medium rounded-xl text-center"
                >
                  Let's Talk
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar