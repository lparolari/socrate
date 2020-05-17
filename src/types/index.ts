export interface Item {
  timestamp: moment.Moment;
}

export interface ItemIn extends Item {}

export interface ItemOut extends Item {}

export interface Info {}

export interface Threshold {
  threshold: number;
}
