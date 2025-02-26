import Chart from "react-apexcharts";
import { COLORS } from "../../constants/colors";

interface StackedColumnProps {
  data: { name: string; data: number[] }[];
}

const StackedColumn = ({ data }: StackedColumnProps) => {
  // Générer les mois de janvier à décembre
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2023, i, 1).toLocaleString("fr-FR", { month: "long" })
  );

  return (
    <Chart
      options={{
        chart: {
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: { enabled: true, speed: 800 },
        },
        colors: COLORS,
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: { position: "left", offsetX: -10, offsetY: 0 },
            },
          },
        ],
        plotOptions: { bar: { horizontal: false } },
        xaxis: {
          categories: months, 
        },
        legend: { position: "right", offsetY: 40 },
        fill: { opacity: 1 },

      }}
      series={data}
      type="bar"
      height={300}
    />
  );
};

export default StackedColumn;
