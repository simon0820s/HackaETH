import { toast } from '@/components/ui/use-toast'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import React from 'react'
import { useContractWrite } from 'wagmi'

function useWithdraw () {
  const withdraw = useContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'withdraw',
    onSuccess (tx: any) {
      toast({
        title: 'Dinero retirado con exito',
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
  return withdraw
}

export default useWithdraw
