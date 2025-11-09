import type { ethers } from "ethers"
import { createContext, useContext } from "react"

type WalletContextType = {
  provider?: ethers.BrowserProvider
  getSigner: () => Promise<ethers.Signer>
  address?: ethers.AddressLike
  chainId?: bigint
  balance?: bigint
  symbol?: string
  error?: string
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined,
)

export const useWallet = () => {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }

  return context
}
