'use client'
import { CurrentLoans } from '@/components/CurrentLoans'
import { FundLoan } from '@/components/FundLoan'
import { TotalFunds } from '@/components/TotalFunds'

import { useUserValidated } from '@/hooks'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

function Page () {
  const isValidate = useUserValidated()
  useEffect(() => {
    isValidate.refetch()
  }, [])
  if (isValidate.isLoading) return null
  console.debug(isValidate.data, isValidate.isFetched)
  if (!isValidate.data && isValidate.isFetched) redirect('/validation')

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
