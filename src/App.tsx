import Alert from "@mui/material/Alert"
import Grid from "@mui/material/Grid"
import type { JSX } from "react"
import { Toaster } from "react-hot-toast"
import Auctions from "@/components/Auctions"
import CreateAuctionButton from "@/components/CreateAuctionButton"
import Header from "@/components/Header"
import { useWallet } from "./contexts/wallet"

const App = (): JSX.Element => {
  const { error } = useWallet()

  return (
    <>
      <Toaster />

      <CreateAuctionButton />

      <Header />

      <Grid
        container
        direction="column"
        sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}
        alignItems="center"
      >
        {error && (
          <Alert
            severity="warning"
            sx={{
              mt: 4,
              mx: 2,
              textAlign: "center",
            }}
          >
            Wallet connection error: {error}
          </Alert>
        )}

        <Auctions />
      </Grid>
    </>
  )
}

export default App
