import { toast } from '@/components/ui/use-toast'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import React from 'react'
import { useContractWrite } from 'wagmi'

function useValidateUser () {
  const validate = useContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'validateUser',
    onSuccess (tx: any) {
      toast({
        title: 'Usuario validado con exito',
        description: `Tx: ${tx.hash}`
      })
    }
  })
  return validate
}

export { useValidateUser }
