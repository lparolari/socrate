import React, { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import { Chart } from "../Chart/Chart";
import { CounterContext } from "../../providers/counter";
import { histLastMin } from "../../data/counter";
import { Hist } from "../../types";

export const PassagesChart = () => {
  const { passages } = useContext(CounterContext);

  // const [min, setMin] = useState(60);
  const min = 60;
  const [hist, setHist] = useState<Hist>(histLastMin(min, passages));

  useEffect(() => {
    setHist(histLastMin(min, passages));
  }, [passages]);

  useEffect(() => {
    setInterval(() => setHist(histLastMin(min, passages)), 1000 * min);
  }, [passages]);

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Ultimi {min} minuti</Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ overflowX: "auto", flex: 1.0 }}>
            <Chart xLabel="Minuti" yLabel="Ospiti" data={hist} />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};
