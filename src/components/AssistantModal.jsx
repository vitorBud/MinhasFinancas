import { useState } from "react"

function AssistantModal({
  open,
  onClose,
  dailyExpenses,
  setDailyExpenses,
  totalManualSpent,
  remainingAfterManual
}) {

  const [input, setInput] = useState("")

  if (!open) return null

  function handleAdd() {
    const value = Number(input)
    if (!value || value <= 0) return

    const newExpense = {
      id: Date.now(),
      value
    }

    setDailyExpenses([...dailyExpenses, newExpense])
    setInput("")
  }

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[90%] max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          🤖 Assistente de Gastos
        </h2>

        <input
          type="number"
          placeholder="Quanto você gastou hoje?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-3 rounded-xl"
        >
          Registrar gasto
        </button>

        <div className="text-sm space-y-2 pt-3 border-t">

          <p>
            Total gasto este mês:
            <strong> {formatCurrency(totalManualSpent)}</strong>
          </p>

          <p className={remainingAfterManual < 0 ? "text-red-500" : "text-emerald-500"}>
            {remainingAfterManual < 0
              ? "⚠️ Você ultrapassou seu limite mensal em "
              : "Você ainda pode gastar "}
            <strong>
              {formatCurrency(Math.abs(remainingAfterManual))}
            </strong>
          </p>

        </div>

        <button
          onClick={onClose}
          className="w-full text-sm text-slate-500 mt-3"
        >
          Fechar
        </button>

      </div>
    </div>
  )
}

export default AssistantModal
