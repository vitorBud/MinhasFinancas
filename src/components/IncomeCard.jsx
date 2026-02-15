import { useState, useEffect } from "react"

function IncomeCard({ income = 0, setIncome }) {

  const [value, setValue] = useState("")

  // 🔹 Sincroniza com valor vindo do Supabase
  useEffect(() => {
    if (income !== 0) {
      setValue(income)
    }
  }, [income])

  function handleChange(e) {
    const inputValue = e.target.value

    // Permite limpar o campo
    if (inputValue === "") {
      setValue("")
      setIncome(0)
      return
    }

    const number = Number(inputValue)

    if (!isNaN(number)) {
      setValue(number)
      setIncome(number)
    }
  }

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
        💰 Quanto você ganha?
      </h2>

      <input
        type="number"
        placeholder="Ex: 3700"
        value={value}
        onChange={handleChange}
        className="
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
        "
      />
    </div>
  )
}

export default IncomeCard
