import React from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { BarChart } from "recharts";
import { Bar } from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";

import { useTheme } from "@material-ui/core/styles";
import { HistEntry } from "../../providers/counter";

export const HistPerHour = ({ data }: { data: HistEntry[] }) => {
  const theme = useTheme();

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Ultimi 60 minuti</Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ overflowX: "auto", flex: 1.0 }}>
            <BarChart
              width={650}
              height={300}
              data={data}
              style={{ marginBottom: 20 }}
            >
              <Bar dataKey="value" fill={theme.palette.primary.main} />
              <XAxis
                dataKey="key"
                label={{
                  value: "Minuti",
                  dy: 15,
                }}
                interval="preserveEnd"
              />
              <YAxis
                label={{
                  value: "Ospiti",
                  angle: -90,
                }}
                allowDecimals={false}
              />
            </BarChart>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};
