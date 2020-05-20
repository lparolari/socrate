export interface Passage {
  timestamp: moment.Moment;
}

export interface Threshold {
  threshold: number;
}

export type Hist = HistEntry[];

export interface HistEntry {
  key: number;
  value: number;
}
