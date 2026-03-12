import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

function RiskChart({ capacity, currentBill }) {

  const safeCapacity = Number(capacity) || 0
  const safeBill = Number(currentBill) || 0

  const remaining = Math.max(safeCapacity - safeBill, 0)

  const data = {
    labels: ["Utilizado", "Disponível"],
    datasets: [
      {
        data: [safeBill, remaining],
        backgroundColor: [
          safeBill / safeCapacity > 0.75
            ? "#ef4444"
            : safeBill / safeCapacity > 0.5
              ? "#f59e0b"
              : "#10b981",
          "#e5e7eb"
        ],
        borderWidth: 0
      }
    ]
  }

  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md text-center space-y-4">

      <h2 className="font-semibold text-black dark:text-white">
        📊 Risco Financeiro
      </h2>

      {safeCapacity > 0 ? (
        <>
          <Doughnut data={data} options={options} />

          <p className="text-sm text-black dark:text-white">
            {((safeBill / safeCapacity) * 100).toFixed(0)}% da capacidade usada
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-400">
          Defina salário e investimento
        </p>
      )}

    </div>
  )
}

export default RiskChart