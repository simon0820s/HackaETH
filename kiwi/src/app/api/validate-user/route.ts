import { NextRequest, NextResponse } from 'next/server'
import { ethers, Contract } from 'ethers'
import { lendingManagerAbi, lendingManagerAddress } from '@/constants'
import { parseEther } from 'viem'

export async function POST (req: NextRequest) {
  const { address } = await req.json()
  const privateKey = process.env.PRIVATE_KEY
  const provider = new ethers.JsonRpcProvider(
    'https://alfajores-forno.celo-testnet.org'
  )
  console.debug({ privateKey })
  const wallet = new ethers.Wallet(privateKey as string, provider)
  console.debug({ wallet })
  const contract = new Contract(
    lendingManagerAddress,
    lendingManagerAbi,
    wallet
  )
  if (address) {
    const response = await contract.validateUser(address, parseEther('10000'))
    console.debug(response)
    return NextResponse.rewrite('/user')
  }
  return NextResponse.json({ error: 'No address provided' }, { status: 400 })
}
