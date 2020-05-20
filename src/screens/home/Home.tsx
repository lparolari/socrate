import React, { useContext } from "react";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { ButtonGroup } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { ThresholdContext } from "../../providers/threshold";
import { CounterContext } from "../../providers/counter";
import { ActualCounter } from "../../components/Badge/ActualCounter";
import { TotalCounter } from "../../components/Badge/TotalCounter";
import { Inc } from "../../components/Button/Inc";
import { Dec } from "../../components/Button/Dec";
import { Reset } from "../../components/Button/Reset";
import { Summary } from "../../components/Badge/Summary";
import { Passage } from "../../types";
import { reviver } from "../../util/json";
import { PassagesChart } from "../../components/PassagesChart/PassagesChart";

export const Home = () => {
  const {
    threshold,
    warningRate,
    dangerRate,
    setThreshold,
    setWarningRate,
    setDangerRate,
  } = useContext(ThresholdContext);

  if (!threshold) throw new Error("Threshold should not be undefined.");

  const { actual, total, passages, inc, dec, reset, bulkImport } = useContext(
    CounterContext
  );

  const exportData = async () => {
    const data = {
      actual: actual,
      total: total,
      passages: passages,
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
    passages: Passage[];
    threshold: number;
  }) => {
    bulkImport(obj.actual, obj.total, obj.passages);
    setThreshold(obj.threshold);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12" style={{ marginBottom: 20 }}>
          <Typography variant="h1">Home</Typography>
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <ActualCounter
            actual={actual}
            threshold={threshold}
            warningRate={warningRate}
            dangerRate={dangerRate}
          />
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
                    <Inc onClick={() => inc()} />
                    <Dec onClick={() => dec()} />
                  </ButtonGroup>
                  <Reset onClick={() => reset()} />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8" style={{ marginBottom: 20 }}>
          <PassagesChart />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <Summary data={passages} />
        </div>
        <div className="col-md-4" style={{ marginBottom: 20 }}>
          <Paper style={{ padding: 16 }}>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">Impostazioni</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={4}>
                <TextField
                  label="Warning Rate"
                  type="number"
                  inputProps={{ min: "0", max: "1", step: "0.01" }}
                  variant="outlined"
                  value={warningRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newWarningRate = Number.parseFloat(
                      e.target.value ? e.target.value : "0"
                    );
                    if (newWarningRate > dangerRate) {
                      setDangerRate(newWarningRate);
                    }
                    setWarningRate(newWarningRate);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Danger Rate"
                  type="number"
                  inputProps={{ min: "0", max: "1", step: "0.01" }}
                  variant="outlined"
                  value={dangerRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newDangerRate = Number.parseFloat(
                      e.target.value ? e.target.value : "0"
                    );
                    if (newDangerRate < warningRate) {
                      setWarningRate(newDangerRate);
                    }
                    setDangerRate(newDangerRate);
                  }}
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
