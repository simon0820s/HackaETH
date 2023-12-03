import React from 'react'
import { toast } from '@/components/ui/use-toast'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Address } from 'wagmi'
import { parseEther } from 'viem'

function useFund ({ value }: { value?: string }) {
  const { config } = usePrepareContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'deposit',
    onSuccess (tx: any) {
      toast({
        title: 'Fondeo realizado con exito',
        description: `Tx: ${tx.hash}`
      })
    },
    onError (error: Error) {
      toast({
        title: 'Error',
        description: error.message
      })
    },
    args: value ? [parseEther(value)] : undefined
  })
  const fundLend = useContractWrite(config)
  return fundLend
}

export { useFund }
