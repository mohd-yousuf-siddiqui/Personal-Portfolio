// src/hooks/useParallax.js
import { useScroll, useTransform } from 'framer-motion'

export const useParallax = (ref, speed = 0.5) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return { y, opacity, scrollYProgress }
}