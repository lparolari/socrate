import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { ButtonGroup } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { pipe } from "fp-ts/lib/pipeable";
import { ThresholdContext } from "../../providers/threshold";
import { Item } from "../../types";
import { HistEntry, CounterContext } from "../../providers/counter";
import { ActualCounter } from "../../components/Badge/ActualCounter";
import { TotalCounter } from "../../components/Badge/TotalCounter";
import { Inc } from "../../components/Button/Inc";
import { Dec } from "../../components/Button/Dec";
import { Reset } from "../../components/Button/Reset";
import { HistPerHour } from "../../components/HistPerHour/HistPerHour";
import { Summary } from "../../components/Badge/Summary";

export const Home = () => {
  const [actual, setActual] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [histPerHour, setHistPerHour] = useState<HistEntry[]>([]);

  const { threshold, setThreshold } = useContext(ThresholdContext);
  const { lastHour, minutes, buildHist } = useContext(CounterContext);

  if (!threshold) throw new Error("Threshold should not be undefined.");

  const reviver = (k: string, v: any) => {
    if (k === "actual" || k === "total" || k === "threshold")
      return Number.parseInt(v);
    if (k === "timestamp") return moment(v);
    return v;
  };

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
    setItems([]);
  };

  useEffect(() => {
    setHistPerHour(pipe(items, lastHour, minutes, buildHist));
  }, [items, lastHour, minutes, buildHist]);

  useEffect(() => {
    setInterval(
      () => setHistPerHour(pipe(items, lastHour, minutes, buildHist)),
      1000 * 60
    );
  }, [items, lastHour, minutes, buildHist]);

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
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <ActualCounter actual={actual} threshold={threshold} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
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
        <div className="col-md-8" style={{ marginBottom: 20 }}>
          <HistPerHour data={histPerHour} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <Summary data={items} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
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
                            importData(JSON.parse(text, reviver));
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
