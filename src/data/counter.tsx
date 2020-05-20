import moment from "moment";
import { pipe } from "fp-ts/lib/pipeable";
import * as Option from "fp-ts/lib/Option";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import * as _ from "lodash";
import { Passage, HistEntry } from "../types";

export const meanLastMin = (min: number, passages: Passage[]): number =>
  pipe(
    passages,
    lastMin(min),
    toMinutes,
    bins(60),
    Array.filter((x: number) => x !== 0),
    NonEmptyArray.fromArray,
    Option.fold(
      () => 0,
      (x: number[]) => _.mean(x)
    )
  );

export const guestLastMin = (min: number, passages: Passage[]): number => {
  return pipe(passages, (x: Passage[]) => lastMin(min)(x), count);
};

export const histLastMin = (min: number, passages: Passage[]): HistEntry[] => {
  return pipe(passages, lastMin(min), toMinutes, buildHist);
};

// HELPERS

const count = <T,>(xs: T[]): number => xs.length;

/**
 * Return passages with timestamp between `min` minutes ago and now.
 * @param passages
 */
const lastMin = (min: number) => (passages: Passage[]) =>
  pipe(
    passages,
    Array.filter((x: Passage) =>
      x.timestamp.isAfter(moment().subtract(min, "minute"))
    )
  );

/**
 * Return passages with timestamp between an hour ago and now.
 * @param passages
 */
// eslint-disable-next-line
const lastHour = lastMin(60);

/**
 * Map list passages to minute corresponding to their timestamp.
 * @param passages
 */
const toMinutes = (passages: Passage[]): number[] => {
  return pipe(
    passages,
    Array.map((x) => x.timestamp.minute())
  );
};

/**
 * Create `n` bins from `data`, counting duplicate elements and storing them in their bin.
 * @param n
 * @param data
 */
const bins = (n: number) => (data: number[]): number[] => {
  const bins: number[] = Array.replicate(n, 0);
  for (const m of data) {
    bins[m] = bins[m] + 1;
  }
  return bins;
};

/**
 * Build an histogram with bins from 0 to 59.
 * @param minutes An array of numbers from 0 to 59 with repetitions.
 */
const buildHist = (minutes: number[]): HistEntry[] => {
  const mbins = bins(60)(minutes);

  const now = moment();

  let hist: HistEntry[] = [];
  for (let i = now.minute() + 60; i >= now.minute() + 1; i--) {
    hist = [...hist, { key: i % 60, value: mbins[i % 60] }];
  }

  hist = _.reverse(hist);

  return hist;
};
