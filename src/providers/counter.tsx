import React, { createContext, useState } from "react";
import moment from "moment";
import { Passage } from "../types";
import { noop } from "../util/noop";

const makePassage = (): Passage => {
  return { timestamp: moment() };
};

interface Context {
  actual: number;
  total: number;
  passages: Passage[];
  inc: () => void;
  dec: () => void;
  reset: () => void;
  bulkImport: (actual: number, total: number, passages: Passage[]) => void;
}

// Create context with default values.
export const CounterContext = createContext<Context>({
  actual: 0,
  total: 0,
  passages: [],
  inc: noop,
  dec: noop,
  reset: noop,
  bulkImport: noop,
});

// Create context provider and bind the context.
export const CounterContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  const [actual, setActual] = useState(0);
  const [total, setTotal] = useState(0);
  const [passages, setPassages] = useState<Passage[]>([]);

  const inc = () => {
    console.log("AAA");
    setActual(actual + 1);
    setTotal(total + 1);
    setPassages([...passages, makePassage()]);
  };

  const dec = () => {
    if (actual <= 0) return;

    setActual(actual - 1);
  };

  const reset = () => {
    setActual(0);
    setTotal(0);
    setPassages([]);
  };

  const bulkImport = (actual: number, total: number, passages: Passage[]) => {
    setActual(actual);
    setTotal(total);
    setPassages(passages);
  };

  return (
    <CounterContext.Provider
      value={{
        actual: actual,
        total: total,
        passages: passages,
        inc: inc,
        dec: dec,
        reset: reset,
        bulkImport: bulkImport,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};
