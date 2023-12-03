'use client'
import { CurrentLoans } from '@/components/CurrentLoans'
import { FundLoan } from '@/components/FundLoan'
import { TotalFunds } from '@/components/TotalFunds'

import { useUserValidated } from '@/hooks'
import { redirect } from 'next/navigation'
import React from 'react'

function Page () {
  const isValidate = useUserValidated()
  if(!isValidate) redirect('/validation')

  return (
    <section className='p-10 pt-20 flex flex-col gap-5 justify-center items-center'>
      <div className='w-[80vw] min-h-[80vh]  dashboard justify-stretch gap-10'>
        <FundLoan />
        <CurrentLoans />
        <TotalFunds />
      </div>
    </section>
  )
}

export default Page
