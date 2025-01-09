import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Point } from "@/utils/types";

// Registrar componentes de Chart.js
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Props {
  datasets: Array<{
    name: string;
    points: Point[];
  }>
}

const LineChart: React.FC<Props> = (props) => {
  const hueStep = 360 / props.datasets.length;
  const data = {
    datasets: props.datasets.map((dataset, i) => ({
      label: dataset.name,
      data: dataset.points, // Los puntos se plotean automáticamente
      backgroundColor: `hsl(${hueStep * i}, 100%, 50%)`,
    })),
  };

  const options: ChartOptions<"scatter"> = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default LineChart;
