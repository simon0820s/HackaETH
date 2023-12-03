import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import React from 'react'
import { useAccount, useContractRead } from 'wagmi'

function useLendLimits () {
  const { address } = useAccount()
  const limits = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'approvedLimit',
    args: [address]
  })
  return limits
}

export { useLendLimits }
