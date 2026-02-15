import { useState, useEffect } from "react"

function CardLimitCard({ cardLimit, setCardLimit }) {

  const [value, setValue] = useState(cardLimit || "")

  /* 🔄 Sincroniza caso venha do banco */
  useEffect(() => {
    setValue(cardLimit || "")
  }, [cardLimit])

  function handleChange(e) {
    const raw = e.target.value

    if (raw === "") {
      setValue("")
      setCardLimit(0)
      return
    }

    const number = Number(raw)

    if (!isNaN(number)) {
      setValue(number)
      setCardLimit(number)
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
        💳 Limite do Cartão
      </h2>

      <input
        type="number"
        placeholder="Ex: 8000"
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

      {cardLimit > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Limite atual:{" "}
          <span className="font-medium text-slate-800 dark:text-slate-100">
            R$ {cardLimit.toLocaleString("pt-BR")}
          </span>
        </p>
      )}
    </div>
  )
}

export default CardLimitCard
