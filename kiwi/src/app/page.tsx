'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
export default function Home () {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: i => {
      const delay = 1 + i * 0.5
      return {
        pathLength: 1,
        strokeDasharray: '45 15',
        opacity: 1,
        transition: {
          pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      }
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center '>
      <motion.svg
        className='position absolute top-0 left-0 w-full h-full z-0'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 800 400'
      >
        <motion.path
          d='M6.278027057647705,390.134521484375C34.3497757434845,375.4260025024414,269.86546902656556,265.20179748535156,286.9955139160156,243.04933166503906C304.1255588054657,220.89686584472656,193.5426010131836,165.56053619384767,177.57847595214844,168.60986328125C161.61435089111328,171.65919036865233,114.88789520263671,255.15695190429688,127.35426330566406,273.5426025390625C139.8206314086914,291.9282531738281,275.78475799560545,352.28699645996096,302.2421569824219,352.46636962890625C328.6995559692383,352.64574279785154,379.0134552001953,300.44844207763674,391.9282531738281,275.3363342285156C404.8430511474609,250.22422637939454,418.11659240722656,122.86995582580566,431.39013671875,101.34529113769531C444.66368103027344,79.82062644958496,508.8789428710937,55.156951141357425,524.6636962890625,60.08968734741211C540.4484497070313,65.0224235534668,575.2466430664062,131.7488872528076,589.2376708984375,150.6726531982422C603.2286987304688,169.59641914367677,644.573974609375,226.1883346557617,664.573974609375,249.3273468017578C684.573974609375,272.4663589477539,776.7713012695312,368.7892318725586,789.2376708984375,382.0627746582031'
          fill='none'
          strokeWidth='3'
          stroke='url("#SvgjsLinearGradient1001")'
          strokeLinecap='round'
          strokeDasharray='450 100'
          variants={draw}
          initial='hidden'
          animate='visible'
        ></motion.path>
        <defs>
          <linearGradient id='SvgjsLinearGradient1001'>
            <stop stop-color='hsl(82, 53%, 70%)' offset='0'></stop>
            <stop stop-color='hsl(118, 53%, 33%)' offset='1'></stop>
          </linearGradient>
        </defs>
      </motion.svg>

      <div className='landing__container'>
        <div className='landing__container--title'>
          <h1 className='text-6xl'>
            Haz parte de <span className='kiwi'>Kiwi</span>
          </h1>
          <h2 className='text-6xl'>
            <span className='kiwi'>Contribuye</span> a tu comunidad
          </h2>
          <p className='text-xl font-extralight'>
            <span className='kiwi'>Kiwi</span> es el primer neobanco
            decentralizado de toda america latina
          </p>
        </div>
        <Link href='/user' className='landing__container--button'>
          <Button className='px-10  font-bold text-xl'>Empieza</Button>
        </Link>
      </div>
    </main>
  )
}
