import React from 'react'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'

import { useAccount, useContractRead } from 'wagmi'

function useFundValues () {
  const { address } = useAccount()

  const { data: interest, isLoading: interestIsLoading } = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'getEarnedInsterests',
    args: [address]
  })

  const { data: totalValue, isLoading: totalValueIsLoading } = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'stakedBalance'
  })

  const { data: initialValue, isLoading: initialValuesIsLoading } =
    useContractRead({
      address: lendingManagerAddress,
      abi: lendingManagerAbi,
      functionName: 'stakedAmountPerUser',
      args: [address]
    })

  return {
    initialValue,
    interest,
    totalValue,
    isLoading:
      interestIsLoading || initialValuesIsLoading || totalValueIsLoading
  }
}

export { useFundValues }
