import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const Skills = () => {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  const skillsData = [
    {
      category: "Frontend",
      description: "Building user interfaces",
      skills: ["React", "JavaScript", "HTML/CSS", "Tailwind CSS", "Next.js"]
    },
    {
      category: "Backend",
      description: "Server-side development",
      skills: ["Node.js", "Express", "MongoDB"]
    },
    {
      category: "Tools",
      description: "Development workflow",
      skills: ["Git", "GitHub", "VS Code", "Vercel", "Figma", "npm"]
    },
    {
      category: "Learning",
      description: "Currently exploring",
      skills: ["REST APIs", "Typescript"]
    }
  ]

  return (
    <section id="skills" className="py-20 relative" ref={sectionRef}>
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
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Expertise</span>
            <span className="flex-1 h-px bg-zinc-800" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Skills & Technologies
          </h2>
          
          <p className="text-zinc-500 mt-3 max-w-lg text-sm leading-relaxed">
            The tools and technologies I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {skillsData.map((group, index) => (
            <SkillGroup key={group.category} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const SkillGroup = ({ group, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [hoveredSkill, setHoveredSkill] = useState(null)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-white">{group.category}</h3>
          <p className="text-xs text-zinc-600 mt-0.5">{group.description}</p>
        </div>
        <span className="text-xs text-zinc-700">{group.skills.length}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {group.skills.map((skill, idx) => (
          <motion.span
            key={skill}
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
            className={`text-xs px-2.5 py-1.5 rounded-md border transition-all duration-200 cursor-default ${
              hoveredSkill === skill
                ? 'bg-white text-black border-white'
                : 'bg-zinc-800/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default Skills