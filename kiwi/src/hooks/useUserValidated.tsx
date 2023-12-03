'use client'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useAccount, useContractRead } from 'wagmi'

function useUserValidated () {
  const { address } = useAccount()

  const userValidated = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'approvedLimit',
    args: [address],
    watch: true
  })
  return { ...userValidated, data: (userValidated.data as bigint) > 0 }
}

export { useUserValidated }
