'use client'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useAccount, useContractRead } from 'wagmi'

function useUserValidated () {
  const { address } = useAccount()
  console.debug({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'isUserValidated',
    args: [address]
  })
  const userValidated = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'isUserValidated',
    args: [address]
  })
  return userValidated
}

export { useUserValidated }
