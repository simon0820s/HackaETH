import React from 'react'
import {
  Address,
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { CeloCopAddress, celoCopAbi } from '@/constants'
import { toast } from '@/components/ui/use-toast'

function useErc20 () {
  const CeloCop = useContractWrite({
    address: CeloCopAddress,
    abi: celoCopAbi,
    functionName: 'approve',
    onSuccess (tx: Address) {
      toast({
        title: 'Monto pre-aprobado con exito',
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
  return CeloCop
}

export { useErc20 }
