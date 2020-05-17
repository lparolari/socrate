import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { ButtonGroup } from "@material-ui/core";
import { Table } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { LineChart } from "recharts";
import { Line } from "recharts";
import { CartesianGrid } from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";
import * as Option from "fp-ts/lib/Option";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/pipeable";
import * as _ from "lodash";
import { ThresholdContext } from "../../providers/threshold";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { orange } from "@material-ui/core/colors";
import { green } from "@material-ui/core/colors";
import { Prompt } from "react-router-dom";

const Inc = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} {...rest}>
      Incrementa
    </Button>
  );
};

const Dec = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} {...rest}>
      Decrementa
    </Button>
  );
};

const Reset = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button variant="outlined" color="secondary" onClick={onClick} {...rest}>
      Azzera
    </Button>
  );
};

const ActualCounter = ({
  actual,
  threshold,
}: {
  actual: number;
  threshold: number;
}) => {
  const classes = useStyles();
  const isWarning = actual > 0.7 * threshold;
  const isDanger = actual > 0.9 * threshold;
  const alert = !isWarning
    ? classes.success
    : !isDanger
    ? classes.warning
    : classes.danger;
  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h3">Al momento</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h3" align="right">
            <span className={alert}>{actual}</span>/{threshold}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="right">
            Ospiti nella struttura
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const TotalCounter = ({ total }: { total: number }) => {
  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h3">In totale</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h3" align="right">
            {total}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="right">
            Ospiti durante la giornata
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const HistPerHour = ({ data }: { data: HistEntry[] }) => {
  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Ultima ora</Typography>
        </Grid>
        <Grid item xs={12}>
          <LineChart width={650} height={300} data={data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="key" />
            <YAxis />
          </LineChart>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Summary = ({ data }: { data: Item[] }) => {
  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Metriche</Typography>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>Negli ultimi 5 minuti</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>
                    {pipe(data, (x: Item[]) => lastMin(5, x), count)}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography>Media ultima ora</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{meanLastHour(data)}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface Item {
  timestamp: moment.Moment;
}

interface HistEntry {
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

export const Home = () => {
  const classes = useStyles();

  const [actual, setActual] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [histPerHour, setHistPerHour] = useState<HistEntry[]>([]);

  const { threshold, setThreshold } = useContext(ThresholdContext);

  if (!threshold) throw new Error("Threshold should not be undefined.");

  const incHandler = () => {
    setActual(actual + 1);
    setTotal(total + 1);
    setItems([...items, { timestamp: moment() }]);
  };

  const decHandler = () => {
    if (actual <= 0) return;

    setActual(actual - 1);
  };

  const resetHandler = () => {
    setActual(0);
    setTotal(0);
  };

  useEffect(() => {
    setHistPerHour(pipe(items, lastHour, minutes, buildHist));
  }, [items]);

  useEffect(() => {
    setInterval(
      () => setHistPerHour(pipe(items, lastHour, minutes, buildHist)),
      1000 * 60
    );
  }, [items]);

  const exportData = async () => {
    const data = {
      actual: actual,
      total: total,
      items: items,
      threshold: threshold,
    };
    // json
    const fileName = `socrate_${moment().format("YYYYMMDD_HHmmss")}`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (obj: {
    actual: number;
    total: number;
    items: Item[];
    threshold: number;
  }) => {
    setActual(obj.actual);
    setTotal(obj.total);
    setItems(obj.items);
    setThreshold(obj.threshold);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12" style={{ marginBottom: 20 }}>
          <Typography variant="h1">Home</Typography>
        </div>
        <div className="col-md-4">
          <ActualCounter actual={actual} threshold={threshold} />
        </div>
        <div className="col-md-4">
          <TotalCounter total={total} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <Paper style={{ padding: 16 }}>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">Azioni</Typography>
                <div style={{ marginTop: 10 }}>
                  <ButtonGroup variant="outlined" color="primary">
                    <Inc onClick={() => incHandler()} />
                    <Dec onClick={() => decHandler()} />
                  </ButtonGroup>
                  <Reset onClick={() => resetHandler()} />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <HistPerHour data={histPerHour} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <Summary data={items} />
        </div>
        <div className="col-md-4">
          {" "}
          <Paper style={{ padding: 16 }}>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">Impostazioni</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Soglia"
                  type="number"
                  variant="outlined"
                  value={threshold}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setThreshold(Number.parseInt(e.target.value))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => exportData()}
                  >
                    Esporta
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Typography align="right">Salva i tuoi dati</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={4}>
                  <Button variant="contained" color="primary" component="label">
                    Importa
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e: any) => {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                          const text: any = e.target ? e.target.result : null;
                          if (text) {
                            importData(
                              JSON.parse(text, (k: string, v: any) => {
                                if (
                                  k === "actual" ||
                                  k === "total" ||
                                  k === "threshold"
                                )
                                  return Number.parseInt(v);
                                if (k === "timestamp") return moment(v);
                                return v;
                              })
                            );
                          }
                        };
                        reader.readAsText(e.target.files[0]);
                      }}
                    />
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Typography align="right">Carica i dati salvati</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setThreshold(undefined)}
                  >
                    Esci
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Typography align="right">Perderai tutti i dati</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  success: {
    color: green[500],
  },
  warning: {
    color: orange[500],
  },
  danger: {
    color: red[500],
  },
});
