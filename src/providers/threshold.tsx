import React, { createContext, useState } from "react";
import { noop } from "../util/noop";

interface Context {
  threshold?: number;
  setThreshold: (t: number | undefined) => void;
}

export const ThresholdContext = createContext<Context>({
  threshold: undefined,
  setThreshold: noop,
});

export const ThresholdContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  const [threshold, setThreshold] = useState<number | undefined>(undefined);

  return (
    <ThresholdContext.Provider
      value={{ threshold: threshold, setThreshold: setThreshold }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
