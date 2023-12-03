import React from 'react'
import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ReactNode } from 'react'

function AnimatedPrice () {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, 438500)
    return controls.stop
  }, [])
  return (
    <div className='text-2xl flex flex-row gap-1 text-green-500 font-bold'>
      $<motion.div>{rounded}</motion.div>
    </div>
  )
}

export default AnimatedPrice
