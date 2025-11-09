import { ethers } from "ethers"
import AuctionSystemManifest from "@/contracts/AuctionSystem.json"

export const withdrawBid = async (
  auctionId: number,
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

  if (typeof contract.withdrawBid !== "function") {
    console.error("❌ Contract does not implement withdrawBid()")
    return null
  }

  console.log("Calling withdrawBid")

  const tx = await contract.withdrawBid(auctionId)
  return await tx.wait()
}

export default withdrawBid
