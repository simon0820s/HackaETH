import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { useAccount, useContractRead } from 'wagmi'

function useLendHistory () {
  const { address } = useAccount()
  const lendHistory = useContractRead({
    address: lendingManagerAddress,
    abi: lendingManagerAbi,
    functionName: 'LendsByUser',
    args: [address]
  })
  return lendHistory
}

export default useLendHistory
