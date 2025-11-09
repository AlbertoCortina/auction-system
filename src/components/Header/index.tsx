import AppBar from "@mui/material/AppBar"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { JSX } from "react"
import { useWallet } from "@/contexts/wallet"
import { formatBalance, shortenAddress } from "@/utils/wallet-utils.ts"

const Header = (): JSX.Element => {
  const { address, chainId, balance, symbol } = useWallet()
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"))

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Auction System
        </Typography>

        {!isSmall && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Contract:{" "}
              <Link
                href={`https://testnet.bscscan.com/address/${process.env.BUN_PUBLIC_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                {process.env.BUN_PUBLIC_CONTRACT_ADDRESS}
              </Link>
            </Typography>

            <Stack>
              <Typography variant="caption">
                Network ID: {chainId ?? "—"}
              </Typography>
              <Typography variant="caption">
                Address: {address ? shortenAddress(address) : "-"}
              </Typography>
              <Typography variant="caption">
                Amount: {balance ? formatBalance(balance, 4, symbol) : "-"}
              </Typography>
            </Stack>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
