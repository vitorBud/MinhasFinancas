import { useState } from "react"

function FixedExpensesCard({ fixedExpenses = [], setFixedExpenses }) {

  const [name, setName] = useState("")
  const [value, setValue] = useState("")

  function handleAdd() {
    if (!name.trim() || !value) return

    const numberValue = Number(value)

    if (numberValue <= 0) return

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      value: numberValue
    }

    setFixedExpenses([...fixedExpenses, newExpense])
    setName("")
    setValue("")
  }

  function handleRemove(id) {
    setFixedExpenses(fixedExpenses.filter(item => item.id !== id))
  }

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

  return (
    <div
      className="
        bg-white
        dark:bg-slate-900
        border border-slate-200
        dark:border-slate-700
        shadow-sm
        dark:shadow-black/40
        rounded-2xl
        p-6
        space-y-4
        transition-colors duration-300
      "
    >
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        🔁 Gastos Fixos Mensais
      </h2>

      {/* INPUTS */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nome do gasto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputStyle}
        />

        <input
          type="number"
          placeholder="Valor mensal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputStyle}
        />

        <button
          onClick={handleAdd}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            text-white
            py-3
            rounded-xl
            font-medium
            active:scale-95
            transition-all duration-200
          "
        >
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-2">
        {fixedExpenses.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nenhum gasto fixo adicionado.
          </p>
        )}

        {fixedExpenses.map(item => (
          <div
            key={item.id}
            className="
              flex justify-between items-center
              bg-slate-100
              dark:bg-slate-800
              border border-slate-200
              dark:border-slate-700
              p-3
              rounded-xl
              transition-colors duration-300
            "
          >
            <span className="text-slate-800 dark:text-slate-100 font-medium">
              {item.name}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400">
                {formatCurrency(item.value)}
              </span>

              <button
                onClick={() => handleRemove(item.id)}
                className="
                  text-sm
                  text-red-500
                  hover:text-red-600
                  dark:hover:text-red-400
                  transition-colors
                "
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}


/* 🔥 Input padrão reutilizável */
const inputStyle = `
  w-full
  px-4 py-3
  rounded-xl
  bg-slate-100
  dark:bg-slate-800
  border border-slate-300
  dark:border-slate-600
  text-slate-800
  dark:text-slate-100
  placeholder:text-slate-400
  dark:placeholder:text-slate-500
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  transition-all duration-200
`

export default FixedExpensesCard
