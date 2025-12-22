import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SalesChart = ({ data, title }) => {
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: title,
        data: data.map((d) => d.total),
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4">{title}</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default SalesChart;
