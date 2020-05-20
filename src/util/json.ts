import moment from "moment";

export const reviver = (k: string, v: any) => {
  if (k === "actual" || k === "total" || k === "threshold")
    return Number.parseInt(v);
  if (k === "timestamp") return moment(v);
  return v;
};
