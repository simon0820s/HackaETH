import React from 'react'
import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ReactNode } from 'react'

function AnimatedPrice ({ price }: { price: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))


  useEffect(() => {
    const controls = animate(count, price)
    return controls.stop
  }, [price])
  return (
    <div className='text-2xl flex flex-row gap-1 text-green-500 font-bold'>
      $<motion.div>{rounded}</motion.div>
    </div>
  )
}

export default AnimatedPrice
