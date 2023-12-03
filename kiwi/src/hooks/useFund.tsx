import React from 'react'
import { toast } from '@/components/ui/use-toast'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Address } from 'wagmi'

function useFund () {
  const { config } = usePrepareContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'feed',
    onSuccess (tx: Address) {
      toast({
        title: 'Fondeo realizado con exito',
        description: `Tx: ${tx.transactionHash}`
      })
    },
    onError (error: Error) {
      toast({
        title: 'Error',
        description: error.message
      })
    }
  })
  const fundLend = useContractWrite(config)
  return fundLend
}

export { useFund }
