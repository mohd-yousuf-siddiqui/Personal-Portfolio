// src/components/ParallaxWrapper.jsx
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ParallaxWrapper = ({ 
  children, 
  speed = 0.5, 
  className = "",
  direction = "up" // "up" | "down" | "left" | "right"
}) => {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const getTransform = () => {
    switch (direction) {
      case "up":
        return useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
      case "down":
        return useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
      case "left":
        return useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
      case "right":
        return useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
      default:
        return useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
    }
  }

  const transform = getTransform()
  const isHorizontal = direction === "left" || direction === "right"

  return (
    <motion.div
      ref={ref}
      style={isHorizontal ? { x: transform } : { y: transform }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ParallaxWrapper