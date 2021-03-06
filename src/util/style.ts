import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { orange } from "@material-ui/core/colors";
import { green } from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#009DE3",
    },
  },
  typography: {
    body1: {
      fontSize: 16,
    },
    fontSize: 16,
  },
});

export const success = {success: {
    color: green[500],
  }};
  export const warning = {warning: {
    color: orange[500],
  }};
  export const danger = {danger: {
    color: red[500],
  }};