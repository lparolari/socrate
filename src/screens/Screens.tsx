import React, { useContext } from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Home } from "./home/Home";
import { Bootstrap } from "./bootstrap/Bootstrap";
import { ThresholdContext } from "../providers/threshold";

export const Screens = () => {
  const { threshold } = useContext(ThresholdContext);

  if (!threshold) return <Bootstrap />;

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/?">
        <p>Test222</p>
      </Route>
    </Switch>
  );
};
