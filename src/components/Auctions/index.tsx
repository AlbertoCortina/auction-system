import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { type JSX, useCallback, useEffect, useState } from "react"
import getAuctions from "@/api/get-auctions.ts"
import AuctionCard from "@/components/Auctions/AuctionCard"
import { useWallet } from "@/contexts/wallet"
import type { Auction } from "@/types/auction.ts"
import { generatePlaceholderUrl } from "@/utils/placeholder-api-utils.ts"

const Auctions = (): JSX.Element => {
  const { getSigner } = useWallet()
  const [auctions, setAuctions] = useState<Auction[]>([])

  const refreshAuctions = useCallback(async () => {
    try {
      const signer = await getSigner()

      const auctions = await getAuctions(signer)

      if (auctions) {
        setAuctions(auctions)
      }
    } catch {
      // Handled by toast
    }
  }, [getSigner])

  useEffect(() => {
    refreshAuctions()
  }, [refreshAuctions])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3, gap: 2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {auctions
          .toSorted((a, b) => Number(b.deadline) - Number(a.deadline))
          .map((auction: Auction) => (
            <Box key={auction.id}>
              <AuctionCard
                id={auction.id}
                image={generatePlaceholderUrl(auction.name)}
                title={auction.name}
                owner={auction.owner}
                currentPrice={auction.highestBid}
                deadline={auction.deadline}
                bids={auction.bids}
                refreshAuctions={refreshAuctions}
              />
            </Box>
          ))}
      </Grid>
    </Box>
  )
}

export default Auctions
