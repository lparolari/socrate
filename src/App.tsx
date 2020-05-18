import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Screens } from "./screens/Screens";
import { ThresholdContextProvider } from "./providers/threshold";

// // Initialize Firebase
// import * as firebase from "firebase/app";
// import "firebase/analytics";

// // TODO: remove private content!!
// var firebaseConfig = {
//   apiKey: "AIzaSyAj8HuRTN8rh_0zdqSIiXP_roHYeOq1h0I",
//   authDomain: "socrate-76439.firebaseapp.com",
//   databaseURL: "https://socrate-76439.firebaseio.com",
//   projectId: "socrate-76439",
//   storageBucket: "socrate-76439.appspot.com",
//   messagingSenderId: "851641638775",
//   appId: "1:851641638775:web:f8975128e96b5139f54b72",
//   measurementId: "G-4G6MMM6BQ8",
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// firebase.analytics().logEvent("page_view", { name: "root" });

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
