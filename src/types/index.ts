import { InformationEvent } from "http";

export interface Item {
  id: number;
  timestamp: moment.Moment;
  in: boolean;
  info: InformationEvent;
}

export interface Info {}
