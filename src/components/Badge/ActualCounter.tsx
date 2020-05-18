import React from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { success, warning, danger } from "../../util/style";

export const ActualCounter = ({
  actual,
  threshold,
  warningRate,
  dangerRate,
}: {
  actual: number;
  threshold: number;
  warningRate: number;
  dangerRate: number;
}) => {
  const classes = useStyles();
  const isWarning = actual > warningRate * threshold;
  const isDanger = actual > dangerRate * threshold;
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

const useStyles = makeStyles({ ...success, ...warning, ...danger });
