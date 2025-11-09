import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    button: {
      textTransform: "unset",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
        size: "small",
      },
    },
  },
});

export default theme;
