import { useUserValidated } from '@/hooks'
import { redirect } from 'next/navigation'
import React from 'react'

function Page () {
  const isValidate = useUserValidated()
  if (!isValidate) redirect('/')
  return <div>
    
  </div>
}

export default Page
