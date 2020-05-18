import React, { createContext } from "react";
import moment from "moment";
import { pipe } from "fp-ts/lib/pipeable";
import * as Option from "fp-ts/lib/Option";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import * as _ from "lodash";

export interface Item {
  timestamp: moment.Moment;
}

export interface HistEntry {
  key: number;
  value: number;
}

const count = <T,>(xs: T[]): number => xs.length;

const meanLastHour = (items: Item[]): number =>
  pipe(
    items,
    lastHour,
    minutes,
    (minutes: number[]) => bins(60, minutes),
    Array.filter((x: number) => x !== 0),
    NonEmptyArray.fromArray,
    Option.fold(
      () => 0,
      (x: number[]) => _.mean(x)
    )
  );

/**
 * Return items with timestamp between an hour ago and now.
 * @param items
 */
const lastHour = (items: Item[]): Item[] => {
  return pipe(
    items,
    Array.filter((x: Item) => x.timestamp.isAfter(moment().subtract(1, "hour")))
  );
};

const lastMin = (min: number, items: Item[]): Item[] => {
  return pipe(
    items,
    Array.filter((x: Item) =>
      x.timestamp.isAfter(moment().subtract(min, "minute"))
    )
  );
};

/**
 * Map list items to minute corresponding to their timestamp.
 * @param items
 */
const minutes = (items: Item[]): number[] => {
  return pipe(
    items,
    Array.map((x) => x.timestamp.minute())
  );
};

/**
 * Create `n` bins from `data`, counting duplicate elements and storing them in their bin.
 * @param n
 * @param data
 */
const bins = (n: number, data: number[]): number[] => {
  const bins: number[] = Array.replicate(n, 0);
  for (const m of data) {
    bins[m] = bins[m] + 1;
  }
  return bins;
};

const buildHist = (minutes: number[]): HistEntry[] => {
  // @param minutes An array of numbers from 0 to 59 with repetitions.

  const mbins = bins(60, minutes);

  const now = moment();

  let hist: HistEntry[] = [];
  for (let i = now.minute() + 60; i >= now.minute() + 1; i--) {
    hist = [...hist, { key: i % 60, value: mbins[i % 60] }];
  }

  hist = _.reverse(hist);

  return hist;
};

const guestLastMin = (min: number, items: Item[]): number => {
  return pipe(items, (x: Item[]) => lastMin(5, x), count);
};

interface Context {
  meanLastHour: (items: Item[]) => number;
  guestLastMin: (min: number, items: Item[]) => number;
  lastHour: (items: Item[]) => Item[];
  lastMin: (min: number, items: Item[]) => Item[];
  minutes: (items: Item[]) => number[];
  bins: (n: number, data: number[]) => number[];
  buildHist: (minutes: number[]) => HistEntry[];
}

const ctx = {
  meanLastHour: meanLastHour,
  guestLastMin: guestLastMin,
  lastHour: lastHour,
  lastMin: lastMin,
  minutes: minutes,
  bins: bins,
  buildHist: buildHist,
};

export const CounterContext = createContext<Context>(ctx);

export const CounterContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  return (
    <CounterContext.Provider value={ctx}>{children}</CounterContext.Provider>
  );
};
