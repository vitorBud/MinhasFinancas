import { useState } from "react"

function FixedExpensesCard({ fixedExpenses, setFixedExpenses }) {

  const [name, setName] = useState("")
  const [value, setValue] = useState("")

  function handleAdd() {
    if (!name || !value) return

    const newExpense = {
      id: Date.now(),
      name,
      value: Number(value)
    }

    setFixedExpenses([...fixedExpenses, newExpense])
    setName("")
    setValue("")
  }

  function handleRemove(id) {
    setFixedExpenses(fixedExpenses.filter(item => item.id !== id))
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-base font-semibold">
        🔁 Gastos Fixos Mensais
      </h2>

      <input
        type="text"
        placeholder="Nome do gasto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <input
        type="number"
        placeholder="Valor mensal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-500 text-white p-3 rounded-xl font-medium"
      >
        Adicionar
      </button>

      <div className="space-y-2">
        {fixedExpenses.map(item => (
          <div
            key={item.id}
            className="flex justify-between bg-gray-50 p-3 rounded-xl"
          >
            <span>{item.name}</span>
            <span>R$ {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FixedExpensesCard
