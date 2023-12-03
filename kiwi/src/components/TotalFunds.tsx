'use client'

import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import AnimatedPrice from './AnimatedPrice'
import { useFundValues } from '@/hooks'
import { Skeleton } from './ui/skeleton'
import { formatEther } from 'viem'
import useWithdraw from '@/hooks/useWithdraw'

function TotalFunds () {
  const { interest, initialValue, totalValue, stakedAmount, isLoading } =
    useFundValues()
  const { writeAsync: withdraw } = useWithdraw()

  const handleOnWithdraw = async () => {
    await withdraw()
  }

  return (
    <>
      {isLoading ? (
        <Card>
          <CardHeader className='chart flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Ganancias totales
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Skeleton className='h-[15px] w-1/2'></Skeleton>

            <p className='text-xs text-muted-foreground'>+20.1% en total</p>
          </CardContent>
          <CardFooter>
            <Button>Retirar fondos</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader className='chart flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Ganancias totales
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            <AnimatedPrice
              price={Number(
                ((initialValue as bigint) + (interest as bigint)) / BigInt(1e18)
              )}
            />
            <p className='text-xs text-muted-foreground'>
              +
              {BigInt(totalValue as bigint) == BigInt(0) ||
              BigInt(interest as bigint) == BigInt(0)
                ? 0
                : formatEther(initialValue / totalValue) * 10 ** 17 * 100}
              % en total
            </p>
            <p className='text-xs text-accent'>
              En total hay ${formatEther(stakedAmount as bigint)} en fondeo
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleOnWithdraw}>Retirar fondos</Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

export { TotalFunds }
