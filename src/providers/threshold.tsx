import React, { createContext, useState } from "react";
import { noop } from "../util/noop";

interface Context {
  threshold?: number;
  warningRate: number;
  dangerRate: number;
  setThreshold: (t: number | undefined) => void;
  setWarningRate: (x: number) => void;
  setDangerRate: (x: number) => void;
}

export const ThresholdContext = createContext<Context>({
  threshold: undefined,
  warningRate: 0.7,
  dangerRate: 0.9,
  setThreshold: noop,
  setWarningRate: noop,
  setDangerRate: noop,
});

export const ThresholdContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  const [threshold, setThreshold] = useState<number | undefined>(undefined);
  const [warningRate, setWarningRate] = useState<number>(0.7);
  const [dangerRate, setDangerRate] = useState<number>(0.9);

  return (
    <ThresholdContext.Provider
      value={{
        threshold: threshold,
        warningRate: warningRate,
        dangerRate: dangerRate,
        setThreshold: setThreshold,
        setWarningRate: setWarningRate,
        setDangerRate: setDangerRate,
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
