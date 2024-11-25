import React, {useEffect, useState} from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface PieChartData {
    name: string;
    value: number;
}

interface Props {
    data: PieChartData[];
}

const COLORS = [
    "#0088FE", // Bleu
    "#00C49F", // Vert
    "#FFBB28", // Jaune
    "#FF8042", // Orange
    "#A28DFF", // Violet
    "#FF6384", // Rouge clair
    "#36A2EB", // Bleu clair
    "#FFCE56", // Jaune doré
    "#4BC0C0", // Vert turquoise
    "#9966FF", // Violet foncé
];

const CustomPieChart: React.FC<Props> = ({ data }) => {
    const [dataChart, setDataCHart] = useState<PieChartData[]>([])
    useEffect(()=>{
        setDataCHart(data)
    }, [data])
    return (
        <PieChart width={650} height={400}>
            <Pie
                data={dataChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default CustomPieChart;
