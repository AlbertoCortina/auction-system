import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { type FormEvent, type JSX, useEffect, useId, useState } from "react"

interface Props {
  open: boolean
  title?: string
  submitting?: boolean
  onClose: () => void
  onConfirm: (amount: string) => Promise<void> | void
}

const BidDialog = ({
  open,
  title,
  submitting = false,
  onClose,
  onConfirm,
}: Props): JSX.Element => {
  const [amount, setAmount] = useState("")
  const formId = useId()

  useEffect(() => {
    if (open) {
      setAmount("")
    }
  }, [open])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onConfirm(amount.trim())
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="bid-dialog">
      <DialogTitle id="bid-dialog">Place a bid</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Enter the amount (in tBNB) you want to bid
          {title ? ` for "${title}"` : ""}.
        </DialogContentText>

        <form id={formId} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            name="bid"
            label="Bid amount (tBNB)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          disabled={submitting}
          loading={submitting}
        >
          Place bid
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BidDialog
