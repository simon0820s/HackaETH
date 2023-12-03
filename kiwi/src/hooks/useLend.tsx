import React from 'react'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useContractWrite } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import { Address } from 'wagmi'

function useLend () {
  const lend = useContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'lend',
    onSuccess (tx: any) {
        toast({
          title: 'Prestamo realizado con exito',
          description: `Tx: ${tx.hash}`
        })
      },
      onError (error: Error) {
        toast({
          title: 'Error',
          description: error.message
        })
      }
  })
  return lend
}
export { useLend }
