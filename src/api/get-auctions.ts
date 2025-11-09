import { ethers } from "ethers"
import AuctionSystemManifest from "@/contracts/AuctionSystem.json"
import type { Auction } from "@/types/auction.ts"
import type { Bid } from "@/types/bid.ts"

export const getAuctions = async (signer: ethers.Signer) => {
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

  if (typeof contract.getAllAuctions !== "function") {
    console.error("❌ Contract does not implement getAllAuctions()")
    return null
  }

  console.log("Calling getAllAuctions")

  const [
    ids,
    names,
    deadlines,
    owners,
    highestBids,
    highestBidders,
    allBidders,
    allAmounts,
  ] = await contract.getAllAuctions()

  const auctions: Auction[] = ids.map((id: bigint, i: number) => {
    const bidders = allBidders[i]
    const amounts = allAmounts[i]

    const bids: Bid[] = bidders.map((address: string, j: number) => ({
      address,
      amount: BigInt(amounts[j]),
    }))

    return {
      id: Number(id),
      name: names[i],
      deadline: new Date(Number(deadlines[i]) * 1000),
      owner: owners[i],
      highestBid: highestBids[i],
      highestBidder: highestBidders[i],
      bids,
    }
  })

  return auctions
}

export default getAuctions
