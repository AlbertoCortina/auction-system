import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Fab from "@mui/material/Fab"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import useMediaQuery from "@mui/material/useMediaQuery"
import { type FormEvent, type JSX, useId, useState } from "react"
import toast from "react-hot-toast"
import createAuction from "@/api/create-auction.ts"
import { useWallet } from "@/contexts/wallet"

const CreateAuctionButton = (): JSX.Element => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"))
  const { getSigner } = useWallet()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [deadline, setDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const formId: string = useId()

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    if (submitting) {
      return
    }
    setOpen(false)
    setName("")
    setDeadline("")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true)

      event.preventDefault()

      const minutes = Number(deadline)

      const signer = await getSigner()
      const promise = createAuction(name.trim(), minutes, signer)

      toast.promise(promise, {
        loading: "Creating auction...",
        success: "Auction created successfully!",
        error: (err) => err?.reason || err?.message || "Error creating auction",
      })

      await promise

      handleClose()
    } catch {
      // Handled by toast
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Fab
        color="primary"
        variant={isSmall ? "circular" : "extended"}
        size="small"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpen}
      >
        <AddIcon sx={{ mr: isSmall ? 0 : 1 }} />
        {!isSmall && "New Auction"}
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="create-auction-dialog"
      >
        <DialogTitle>Create Auction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the details for the new auction.
          </DialogContentText>
          <form onSubmit={handleSubmit} id={formId}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="name"
              label="Auction name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              required
              margin="dense"
              name="deadline"
              label="Duration (in minutes)"
              type="number"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={submitting}
            autoFocus
            loading={submitting}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateAuctionButton
