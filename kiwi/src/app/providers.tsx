'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, celo, celoAlfajores, mainnet } from 'viem/chains'
import { ReactNode, useEffect, useState } from 'react'

const projectId = 'YOUR_PROJECT_ID'

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [celoAlfajores, celo]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export function Providers ({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return <WagmiConfig config={wagmiConfig}>{isMounted && children}</WagmiConfig>
}
