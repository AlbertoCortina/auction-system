import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import type { AddressLike, ethers } from "ethers"
import { ZeroAddress } from "ethers/constants"
import type { JSX } from "react"
import { useState } from "react"
import toast from "react-hot-toast"
import getAuctionWinnerApi from "@/api/get-auction-winner.ts"
import placeBidApi from "@/api/place-bid"
import withdrawBidApi from "@/api/withdraw-bid.ts"
import BidDialog from "@/components/Auctions/AuctionCard/BidDialog"
import { useWallet } from "@/contexts/wallet"
import type { Bid } from "@/types/bid.ts"
import { formatBalance, shortenAddress } from "@/utils/wallet-utils.ts"

interface Props {
  id: number
  image: string
  title: string
  owner: AddressLike
  currentPrice: ethers.BigNumberish
  deadline: Date
  bids: Bid[]
  refreshAuctions: () => Promise<void>
}

const formatDate = (deadline: Date) => {
  const d = deadline
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${day}-${month}-${year} ${hours}:${minutes}`
}

const AuctionCard = ({
  id,
  image,
  title,
  owner,
  currentPrice,
  deadline,
  bids,
  refreshAuctions,
}: Props): JSX.Element => {
  const { getSigner } = useWallet()
  const isExpired = deadline.getTime() < Date.now()

  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [submittingBid, setSubmittingBid] = useState(false)

  const handleOpenBidDialog = () => {
    setBidDialogOpen(true)
  }

  const handleCloseBidDialog = () => {
    if (submittingBid) {
      return
    }
    setBidDialogOpen(false)
  }

  const handleConfirmBid = async (amount: string) => {
    try {
      setSubmittingBid(true)

      const signer = await getSigner()
      const promise = placeBidApi(id, amount.trim(), signer)

      toast.promise(promise, {
        loading: "Placing bid...",
        success: "Bid placed successfully!",
        error: (err: any) =>
          err?.reason || err?.message || "Failed to place bid",
      })

      await promise
      await refreshAuctions()
      setBidDialogOpen(false)
    } catch {
      // Handled by toast / smart contract will validate and revert if needed
    } finally {
      setSubmittingBid(false)
    }
  }

  const handleWithdrawBid = async () => {
    try {
      const signer = await getSigner()

      const promise = withdrawBidApi(id, signer)

      toast.promise(promise, {
        loading: "Withdrawing bid...",
        success: "Bid withdrawn successfully!",
        error: (err) => err?.reason || err?.message || "Failed to withdraw bid",
      })
    } catch {
      // Handled by toast
    }
  }

  const handleCheckAuctionWinner = async () => {
    try {
      const signer = await getSigner()

      const promise = getAuctionWinnerApi(id, signer)

      toast.promise(promise, {
        loading: "Checking winner...",
        success: (winner) =>
          winner && winner !== ZeroAddress
            ? `Winner: ${shortenAddress(winner)}`
            : "No winner yet.",
        error: (err) => err?.reason || err?.message || "Failed to check winner",
      })
    } catch {
      // Handled by toast
    }
  }

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 2,
            mb: 1.5,
          }}
        />
        <Typography variant="h6">{title}</Typography>

        <Typography variant="body2" color="text.secondary">
          Owner: {shortenAddress(owner)}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Current Price:</strong> {formatBalance(currentPrice)} tBNB
        </Typography>

        <Typography sx={{ color: isExpired ? "error.main" : "text.primary" }}>
          <strong>Ends in:</strong> {formatDate(deadline)}
        </Typography>

        <Box sx={{ mt: 2, p: 1, bgcolor: "grey.100", borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Bids:
          </Typography>

          {bids.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No bids yet
            </Typography>
          ) : (
            bids
              .slice(-3)
              .reverse()
              .map((b) => (
                <Box
                  key={shortenAddress(b.address)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">
                    {shortenAddress(b.address)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatBalance(b.amount)} tBNB
                  </Typography>
                </Box>
              ))
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={handleOpenBidDialog}
        >
          Place a bid
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="warning"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={handleWithdrawBid}
        >
          Withdraw my bid
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={handleCheckAuctionWinner}
        >
          Check auction winner
        </Button>
      </Card>

      <BidDialog
        open={bidDialogOpen}
        title={title}
        submitting={submittingBid}
        onClose={handleCloseBidDialog}
        onConfirm={handleConfirmBid}
      />
    </>
  )
}

export default AuctionCard
