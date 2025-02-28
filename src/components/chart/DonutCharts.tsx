import Chart from "react-apexcharts";
import { COLORS } from "../../constants/colors";
import { useMemo } from "react";

interface SimpleDonutProps {
  labels: string[];
  values: number[];
}

const DonutCharts = ({ labels, values }: SimpleDonutProps) => {
  const options = useMemo(
    () => ({
      chart: {
        type: "donut" as "donut",
        animations: {
          enabled: true,
          speed: 800,
        },
      },
      colors: COLORS,
      labels: labels,
      legend: {
        position: "bottom" as "bottom",
        fontSize: "14px",
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return `${val.toFixed(2)}%`;
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 250 },
            legend: { position: "bottom"},
          },
        },
      ],
    }),
    [labels]
  );

  return <Chart options={options} series={values} height={300} type="donut" />;
};

export default DonutCharts;
