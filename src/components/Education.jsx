import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const Education = () => {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  const education = [
    {
      id: 1,
      degree: "B.Tech in Computer Science & Engineering",
      institution: "United College of Engineering & Research",
      location: "Allahabad, India",
      duration: "2021 – 2025",
      status: "completed",
      highlights: ["Web Development", "Data Structures", "Machine Learning Basics"]
    },
    {
      id: 2,
      degree: "Senior Secondary (Class XII)",
      institution: "Jamuna Christian Inter College",
      location: "Allahabad, India",
      duration: "2019 – 2021",
      status: "completed"
    },
    {
      id: 3,
      degree: "Secondary (Class X)",
      institution: "Boys' High School and College",
      location: "Allahabad, India",
      duration: "2017 – 2019",
      status: "completed"
    }
  ]

  return (
    <section id="education" className="py-20 relative" ref={sectionRef}>
      <div className="relative z-10">
        {/* Section Header */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Background</span>
            <span className="flex-1 h-px bg-zinc-800" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Education
          </h2>
          
          <p className="text-zinc-500 mt-3 max-w-lg text-sm leading-relaxed">
            My academic journey and qualifications.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-zinc-800" />

          <div className="space-y-8">
            {education.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const TimelineItem = ({ item, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 group"
    >
      {/* Dot */}
      <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-black ${
        item.status === 'current' ? 'bg-white' : 'bg-zinc-700'
      }`}>
        {item.status === 'current' && (
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{item.duration}</span>
            {item.status === 'current' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-medium">
                Current
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-medium text-white mb-1">
          {item.degree}
        </h3>

        <p className="text-sm text-zinc-500 mb-1">{item.institution}</p>
        
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{item.location}</span>
        </div>

        {item.highlights && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-800/50">
            {item.highlights.map((highlight, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded-md bg-zinc-800/50 text-zinc-500">
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Education