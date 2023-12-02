'use client'
import { CurrentLoans } from '@/components/CurrentLoans'
import { FundLoan } from '@/components/FundLoan'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useUserValidated } from '@/hooks'
import { redirect } from 'next/navigation'
import React from 'react'


function Page () {

  const isValidate = useUserValidated()
  if (!isValidate) redirect('/')
  return (
    <section className='p-10 flex flex-col gap-10 justify-center items-center'>
      <div className='w-[80vw] flex flex-row justify-stretch gap-10'>
        <FundLoan/>
        <CurrentLoans/>f
      </div>
    </section>
  )
}

export default Page
