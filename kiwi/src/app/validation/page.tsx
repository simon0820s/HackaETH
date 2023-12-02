'use client'
import React from 'react'
import { useUserValidated } from '@/hooks'
import { redirect } from 'next/navigation'

function Page () {
  const isValidate = useUserValidated()
  if (!isValidate) redirect('/')
  return (
    <section>
      <h1>Page</h1>
      <p>Page content</p>
    </section>
  )
}

export default Page
