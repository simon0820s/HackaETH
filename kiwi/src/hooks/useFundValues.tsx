import React from 'react'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'

import { useAccount, useContractRead } from 'wagmi'

function useFundValues () {
  const { address } = useAccount()
  const { data: stakedAmount, isLoading: stakedAmountIsLoading } =
    useContractRead({
      address: lendingManagerAddress,
      abi: lendingManagerAbi,
      functionName: 'stakedBalance',
      watch: true
    })

  const { data: interest, isLoading: interestIsLoading } = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'getEarnedInsterests',
    args: [address],
    watch: true
  })

  const { data: totalValue, isLoading: totalValueIsLoading } = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'stakedBalance',
    watch: true
  })

  const { data: initialValue, isLoading: initialValuesIsLoading } =
    useContractRead({
      address: lendingManagerAddress,
      abi: lendingManagerAbi,
      functionName: 'stakedAmountPerUser',
      args: [address],
      watch: true
    })

  return {
    initialValue,
    interest,
    totalValue,
    stakedAmount,
    isLoading:
      interestIsLoading ||
      initialValuesIsLoading ||
      totalValueIsLoading ||
      stakedAmountIsLoading
  }
}

export { useFundValues }
