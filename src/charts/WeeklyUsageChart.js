import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function WeeklyUsageChart({ meals }) {
  const counts = Object.fromEntries(DAYS.map(d => [d, 0]));
  for (const m of meals) counts[m.day] = (counts[m.day] || 0) + (m.ingredients?.length || 0);

  const data = { labels: DAYS, datasets: [{ label: "Ingredients used", data: DAYS.map(d => counts[d]) }] };

  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-semibold mb-2">Weekly Ingredient Usage</h3>
      <Bar data={data} />
    </div>
  );
}