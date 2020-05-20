import React from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Table } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { TableCell } from "@material-ui/core";

import { guestLastMin, meanLastMin } from "../../data/counter";
import { Passage } from "../../types";

export const Summary = ({ data }: { data: Passage[] }) => {
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
                  <Typography>{guestLastMin(5, data)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography>Media ultima ora</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{meanLastMin(60, data).toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
};
