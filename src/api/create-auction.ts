import { ethers } from "ethers"
import AuctionSystemManifest from "@/contracts/AuctionSystem.json"

export const createAuction = async (
  name: string,
  minutes: number,
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

  if (typeof contract.createAuction !== "function") {
    console.error("❌ Contract does not implement createAuction()")
    return null
  }

  console.log("Calling createAuction")

  const tx = await contract.createAuction(name, minutes)
  return await tx.wait()
}

export default createAuction
