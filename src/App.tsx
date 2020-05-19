import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Screens } from "./screens/Screens";
import { ThresholdContextProvider } from "./providers/threshold";
import { theme } from "./util/style";

import * as firebase from "firebase/app";
import "firebase/analytics";
import { firebaseConfig } from "./util/firebase";

firebase.initializeApp(firebaseConfig);
firebase.analytics();

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
