import React from 'react'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'

import { useContractRead } from 'wagmi'

function useFundValues () {
  const contractRead = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: ''
  })
  return contractRead
}

export { useFundValues }
