import React from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";

export const TotalCounter = ({ total }: { total: number }) => {
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
