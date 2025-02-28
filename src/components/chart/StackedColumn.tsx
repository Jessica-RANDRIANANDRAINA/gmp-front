import Chart from "react-apexcharts";
import { COLORS } from "../../constants/colors";

interface StackedColumnProps {
  data: { name: string; data: number[] }[];
}

const StackedColumn = ({ data }: StackedColumnProps) => {
  // Calculer le mois en cours
  const currentMonth = new Date().getMonth(); // 0 = janvier, 11 = décembre

  // Générer les mois de janvier à décembre
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2023, i, 1).toLocaleString("fr-FR", { month: "long" })
  );

  // Réorganiser les mois pour que le mois en cours soit en dernière position
  const rotatedMonths = [
    ...months.slice(currentMonth + 1), // Mois après le mois actuel
    ...months.slice(0, currentMonth + 1), // Mois avant et y compris le mois actuel
  ];

  // Réorganiser les données pour correspondre à l'ordre des mois
  const rotatedData = data.map((category) => ({
    ...category,
    data: [
      ...category.data.slice(currentMonth + 1), // Mois après le mois actuel
      ...category.data.slice(0, currentMonth + 1), // Mois avant et y compris le mois actuel
    ],
  }));

  return (
    <Chart
      options={{
        chart: {
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: { enabled: true, speed: 800,  },
        },
        colors: COLORS,
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: { position: "bottom", offsetX: 0, offsetY: 0 },
            },
          },
        ],
        plotOptions: { bar: { horizontal: false } },
        xaxis: {
          categories: rotatedMonths, // Mois réorganisés
        },
        legend: { position: "right", offsetY: 40 },
        fill: { opacity: 1 },
        dataLabels: {
          enabled: true,
          formatter: (value: number) => `${value}h`,
        },
        tooltip: {
          y: {
            formatter: (value: number) => `${value}h`,
          },
        },
      }}
      series={rotatedData} // Données réorganisées
      type="bar"
      height={300}
    />
  );
};

export default StackedColumn;
