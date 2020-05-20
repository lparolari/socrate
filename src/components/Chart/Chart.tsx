import React from "react";
import { BarChart } from "recharts";
import { Bar } from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";

import { useTheme } from "@material-ui/core/styles";
import { Hist } from "../../types";

export interface ChartProps {
  data: Hist;
  xLabel: string;
  yLabel: string;
}

export const Chart = ({ xLabel, yLabel, data }: ChartProps) => {
  const theme = useTheme();

  return (
    <BarChart width={650} height={300} data={data} style={{ marginBottom: 20 }}>
      <Bar dataKey="value" fill={theme.palette.primary.main} />
      <XAxis
        dataKey="key"
        label={{
          value: xLabel,
          dy: 15,
        }}
        interval="preserveEnd"
      />
      <YAxis
        label={{
          value: yLabel,
          angle: -90,
        }}
        allowDecimals={false}
      />
    </BarChart>
  );
};
