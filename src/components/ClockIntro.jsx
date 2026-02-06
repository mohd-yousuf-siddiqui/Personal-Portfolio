import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const ClockIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)
  const [revealedTicks, setRevealedTicks] = useState(new Set())
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 })
  const [isLive, setIsLive] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const [angles, setAngles] = useState({
    minute: 0,
    hour: 0,
    second: 0
  })
  
  const [minuteHandLength, setMinuteHandLength] = useState(0)
  
  const [handsVisible, setHandsVisible] = useState({
    minute: false,
    hour: false,
    second: false
  })
  
  const animationRef = useRef(null)

  // Lock body scroll
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const getTimeAngles = useCallback(() => {
    const now = new Date()
    const h = now.getHours() % 12
    const m = now.getMinutes()
    const s = now.getSeconds()
    const ms = now.getMilliseconds()

    return {
      hour: h * 30 + m * 0.5 + s * (0.5 / 60),
      minute: m * 6 + s * 0.1,
      second: s * 6 + ms * 0.006,
      raw: { h, m, s }
    }
  }, [])

  const getClockwiseAngle = (from, to, minRotation = 0) => {
    from = ((from % 360) + 360) % 360
    to = ((to % 360) + 360) % 360
    
    let clockwiseDist = to - from
    if (clockwiseDist <= 0) {
      clockwiseDist += 360
    }
    
    if (clockwiseDist < minRotation) {
      clockwiseDist += 360
    }
    
    return from + clockwiseDist
  }

  useEffect(() => {
    setTimeout(() => setPhase(1), 400)
  }, [])

  // Phase 1: Minute hand grows
  useEffect(() => {
    if (phase !== 1) return

    setHandsVisible(prev => ({ ...prev, minute: true }))
    setAngles(prev => ({ ...prev, minute: 0 }))
    
    const duration = 400
    const startTime = performance.now()
    const fullLength = 100
    
    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setMinuteHandLength(eased * fullLength)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setMinuteHandLength(fullLength)
        setTimeout(() => setPhase(2), 100)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [phase])

  // Phase 2: Minute hand rotates revealing ticks
  useEffect(() => {
    if (phase !== 2) return

    const duration = 1600
    const startTime = performance.now()

    const tickAngles = {
      0: 0, 1: 30, 2: 60, 3: 90,
      4: 120, 5: 150, 6: 180, 7: 210,
      8: 240, 9: 270, 10: 300, 11: 330
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentAngle = 360 * eased
      setAngles(prev => ({ ...prev, minute: currentAngle }))

      Object.entries(tickAngles).forEach(([idx, angle]) => {
        if (currentAngle >= angle - 10) {
          setRevealedTicks(prev => new Set([...prev, parseInt(idx)]))
        }
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAngles(prev => ({ ...prev, minute: 0 }))
        setTimeout(() => setPhase(3), 200)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [phase])

  // Phase 3: All hands animate to current time
  useEffect(() => {
    if (phase !== 3) return

    setHandsVisible({ minute: true, hour: true, second: true })

    const durations = { hour: 600, minute: 800, second: 600 }
    const maxDuration = Math.max(...Object.values(durations))
    const startDelay = 200
    
    let animationStartTime = null
    let targets = null
    let liveSecondStarted = false

    const animate = (now) => {
      if (animationStartTime === null) animationStartTime = now
      
      const elapsed = now - animationStartTime - startDelay
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      if (targets === null) {
        const targetTime = getTimeAngles()
        const predictedSecondAngle = (targetTime.second + (durations.second / 1000) * 6) % 360
        
        targets = {
          hour: getClockwiseAngle(0, targetTime.hour, 30),
          minute: getClockwiseAngle(0, targetTime.minute, 60),
          second: 360 + predictedSecondAngle
        }
      }

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      
      const hourProgress = easeOutCubic(Math.min(elapsed / durations.hour, 1))
      const minuteProgress = easeOutCubic(Math.min(elapsed / durations.minute, 1))
      const secondProgress = easeOutCubic(Math.min(elapsed / durations.second, 1))

      if (secondProgress >= 1 && !liveSecondStarted) liveSecondStarted = true

      const currentSecondAngle = liveSecondStarted 
        ? getTimeAngles().second 
        : targets.second * secondProgress

      setAngles({
        hour: targets.hour * hourProgress,
        minute: targets.minute * minuteProgress,
        second: currentSecondAngle
      })

      if (elapsed >= maxDuration) {
        setCurrentTime(getTimeAngles().raw)
        setIsLive(true)
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [phase, getTimeAngles])

  // Live clock update
  useEffect(() => {
    if (!isLive) return

    let rafId
    const tick = () => {
      const newAngles = getTimeAngles()
      setAngles({
        hour: newAngles.hour,
        minute: newAngles.minute,
        second: newAngles.second
      })
      setCurrentTime(newAngles.raw)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    
    return () => cancelAnimationFrame(rafId)
  }, [isLive, getTimeAngles])

  useEffect(() => {
    if (isLive && !isReady) {
      const timer = setTimeout(() => setIsReady(true), 600)
      return () => clearTimeout(timer)
    }
  }, [isLive, isReady])

  // Handle dismiss
  useEffect(() => {
    if (!isReady || isComplete) return
    
    const handleDismiss = (e) => {
      if (e.target.closest('button')) return
      setIsComplete(true)
    }
    
    const handleWheel = (e) => {
      e.preventDefault()
      setIsComplete(true)
    }
    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        setIsComplete(true)
      }
    }
    
    window.addEventListener('click', handleDismiss)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleDismiss, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('click', handleDismiss)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleDismiss)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isReady, isComplete])

  useEffect(() => {
    if (isComplete && onComplete) {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [isComplete, onComplete])

  const clockSize = 280
  const center = clockSize / 2
  const tickRadius = 120
  
  const colors = {
    tick: 'rgba(255, 255, 255, 0.9)',
    tickMuted: 'rgba(255, 255, 255, 0.2)',
    hand: 'rgba(255, 255, 255, 0.95)',
    secondHand: '#ffffff',
    pivot: 'rgba(255, 255, 255, 0.5)',
  }

  const isMajorTick = (index) => [0, 3, 6, 9].includes(index)
  
  const renderTick = (index, isRevealed) => {
    const angle = (index * 30 - 90) * (Math.PI / 180)
    const isMajor = isMajorTick(index)
    
    const tickLength = isMajor ? 14 : 6
    const tickWidth = isMajor ? 2 : 1
    const gap = isMajor ? 4 : 0
    
    const outerRadius = tickRadius
    const innerRadius = outerRadius - tickLength
    
    const x1 = center + Math.cos(angle) * outerRadius
    const y1 = center + Math.sin(angle) * outerRadius
    const x2 = center + Math.cos(angle) * innerRadius
    const y2 = center + Math.sin(angle) * innerRadius
    
    if (isMajor) {
      const x1Inner = center + Math.cos(angle) * (innerRadius - gap - tickLength * 0.4)
      const y1Inner = center + Math.sin(angle) * (innerRadius - gap - tickLength * 0.4)
      const x2Inner = center + Math.cos(angle) * (innerRadius - gap)
      const y2Inner = center + Math.sin(angle) * (innerRadius - gap)
      
      return (
        <g key={index} style={{
          opacity: isRevealed ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.tick} strokeWidth={tickWidth} strokeLinecap="round" />
          <line x1={x2Inner} y1={y2Inner} x2={x1Inner} y2={y1Inner} stroke={colors.tick} strokeWidth={tickWidth} strokeLinecap="round" />
        </g>
      )
    }
    
    return (
      <line
        key={index}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={colors.tickMuted}
        strokeWidth={tickWidth}
        strokeLinecap="round"
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      />
    )
  }

  const hands = {
    hour: { length: 55, width: 3, color: colors.hand },
    minute: { length: 80, width: 2, color: colors.hand },
    second: { length: 95, width: 1, tailLength: 24, color: colors.secondHand },
  }

  const formatTime = (h, m, s) => {
    const h12 = h === 0 ? 12 : h
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handStyle = (angle, visible) => ({
    transform: `rotate(${angle}deg)`,
    transformOrigin: `${center}px ${center}px`,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.4s ease-out',
  })

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer select-none"
      style={{ pointerEvents: isComplete ? 'none' : 'auto' }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      {/* Clock container */}
      <div className="relative flex flex-col items-center">
        <svg width={clockSize} height={clockSize} style={{ overflow: 'visible' }}>
          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => renderTick(i, revealedTicks.has(i)))}
          
          {/* Hour hand */}
          <g style={handStyle(angles.hour, handsVisible.hour)}>
            <line
              x1={center} y1={center}
              x2={center} y2={center - hands.hour.length}
              stroke={hands.hour.color}
              strokeWidth={hands.hour.width}
              strokeLinecap="round"
            />
          </g>
          
          {/* Minute hand */}
          <g style={handStyle(angles.minute, handsVisible.minute)}>
            <line
              x1={center} y1={center}
              x2={center} y2={center - (phase === 1 ? minuteHandLength * 0.8 : hands.minute.length)}
              stroke={hands.minute.color}
              strokeWidth={hands.minute.width}
              strokeLinecap="round"
            />
          </g>
          
          {/* Second hand */}
          <g style={handStyle(angles.second, handsVisible.second)}>
            <line
              x1={center} y1={center + hands.second.tailLength}
              x2={center} y2={center - hands.second.length}
              stroke={hands.second.color}
              strokeWidth={hands.second.width}
              strokeLinecap="round"
            />
          </g>
          
          {/* Center pivot */}
          <circle
            cx={center} cy={center} r={3}
            fill="none"
            stroke={colors.pivot}
            strokeWidth={1}
          />
        </svg>

        {/* Digital time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLive ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-zinc-500 text-sm font-mono tracking-widest text-center"
        >
          {formatTime(currentTime.h, currentTime.m, currentTime.s)}
        </motion.div>
      </div>

      {/* Name reveal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isLive ? 1 : 0, y: isLive ? 0 : 15 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 text-center"
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
          <span className="text-white">YOUSUF</span>
          {' '}
          <span className="text-zinc-500">SIDDIQUI</span>
        </h1>
        <p className="text-zinc-600 text-sm mt-2 tracking-widest uppercase">Full Stack Developer</p>
      </motion.div>

      {/* Continue hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-zinc-600 tracking-widest uppercase">
          Click or scroll to continue
        </span>
        
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 && !isReady ? 0.4 : 0 }}
        whileHover={{ opacity: 1 }}
        onClick={() => setIsComplete(true)}
        className="absolute bottom-8 right-8 text-xs text-zinc-600 hover:text-white transition-colors tracking-widest"
        style={{ pointerEvents: phase >= 1 && !isReady ? 'auto' : 'none' }}
      >
        SKIP →
      </motion.button>
    </motion.div>
  )
}

export default ClockIntro