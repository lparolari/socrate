import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Screens } from "./screens/Screens";
import { ThresholdContextProvider } from "./providers/threshold";

import ReactGA from "react-ga";

const theme = createMuiTheme({
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

const trackingId = "233043456"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <ThresholdContextProvider>
          <div className="container" style={{ marginTop: 20 }}>
            <Screens />
          </div>
        </ThresholdContextProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
