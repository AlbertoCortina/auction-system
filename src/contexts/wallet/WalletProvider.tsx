import { ethers } from "ethers"
import type { ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { WalletContext } from "./wallet-context"

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [address, setAddress] = useState<ethers.AddressLike>()
  const [chainId, setChainId] = useState<bigint>()
  const [balance, setBalance] = useState<bigint>()
  const [error, setError] = useState<string>()

  const symbol = "tBNB"

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed")
      return
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const _provider = new ethers.BrowserProvider(window.ethereum)
      const _signer = await _provider.getSigner()
      const _address = await _signer.getAddress()
      const _network = await _provider.getNetwork()
      const _balance = await _provider.getBalance(_address)

      setProvider(_provider)
      setAddress(_address)
      setChainId(_network.chainId)
      setBalance(_balance)
      setError(undefined)

      console.log(`✅ Connected: ${_address} (chain ${_network.chainId})`)
    } catch (err) {
      console.error("❌ Failed to connect to MetaMask:", err)
      setError("Failed to connect to MetaMask")
    }
  }, [])

  useEffect(() => {
    connect()
  }, [connect])

  const getSigner = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not ready")
    }

    return await provider.getSigner()
  }, [provider])

  return (
    <WalletContext.Provider
      value={{
        provider,
        getSigner,
        address,
        chainId,
        balance,
        symbol,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
