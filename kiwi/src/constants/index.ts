const lendingManagerAddress = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`
const CeloCopAddress = process.env.NEXT_PUBLIC_ERC20 as `0x${string}`
import lendingManagerAbi from './lendingManager.json'
import celoCopAbi from './celoCop.json'
export { lendingManagerAddress, CeloCopAddress, lendingManagerAbi, celoCopAbi }
