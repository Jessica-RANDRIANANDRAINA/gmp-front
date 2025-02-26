import Chart from "react-apexcharts";
import { COLORS } from "../../constants/colors";
import { useMemo } from "react";

interface SimpleDonutProps {
  labels: string[];
  values: number[];
}

const DonutCharts = ({ labels, values }: SimpleDonutProps) => {
  const options = useMemo(() => ({
    chart: {
      type: "donut" as "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
    },
    colors: COLORS,
    labels: labels,
    legend: {
      position: "bottom" as "bottom",
      fontSize: "14px",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 250 },
          legend: { position: "bottom" as "bottom" },
        },
      },
    ],
  }), [labels]);

  return <Chart options={options} series={values} height={300} type="donut" />;
};

export default DonutCharts;
