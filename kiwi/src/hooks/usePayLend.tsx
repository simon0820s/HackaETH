import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import React from 'react'
import { useContractRead, useContractWrite } from 'wagmi'

function usePayLend () {
  const payLend = useContractWrite({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'payLend'
  })
  return payLend
}

export { usePayLend }
