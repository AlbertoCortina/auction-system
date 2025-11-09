import { ethers } from "ethers"
import AuctionSystemManifest from "@/contracts/AuctionSystem.json"

export const placeBid = async (
  auctionId: number,
  bidAmount: string,
  signer: ethers.Signer,
): Promise<ethers.ContractTransactionReceipt | null> => {
  const address = process.env.BUN_PUBLIC_CONTRACT_ADDRESS
  if (!address) {
    console.error("❌ Missing BUN_PUBLIC_CONTRACT_ADDRESS environment variable")
    return null
  }

  const contract = new ethers.Contract(
    process.env.BUN_PUBLIC_CONTRACT_ADDRESS,
    AuctionSystemManifest.abi,
    signer,
  )

  if (typeof contract.bid !== "function") {
    console.error("❌ Contract does not implement bid()")
    return null
  }

  console.log("Calling bid")

  const tx = await contract.bid(auctionId, {
    value: ethers.parseEther(bidAmount),
  })
  return await tx.wait()
}

export default placeBid
