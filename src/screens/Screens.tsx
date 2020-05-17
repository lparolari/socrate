import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

export const Screens = () => {
  return (
    <Switch>
      <Route exact path="/">
        <p>Test111</p>
      </Route>
      <Route path="/?">
        <p>Test222</p>
      </Route>
    </Switch>
  );
};
