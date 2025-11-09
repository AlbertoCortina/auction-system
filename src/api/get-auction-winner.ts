import { ethers } from "ethers"
import AuctionSystemManifest from "@/contracts/AuctionSystem.json"

export const getAuctionWinner = async (
  auctionId: number,
  signer: ethers.Signer,
): Promise<string | null> => {
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

  if (typeof contract.getAuctionWinner !== "function") {
    console.error("❌ Contract does not implement getAuctionWinner()")
    return null
  }

  console.log("Calling getAuctionWinner")

  const winner: string = await contract.getAuctionWinner(auctionId)
  return winner
}

export default getAuctionWinner
