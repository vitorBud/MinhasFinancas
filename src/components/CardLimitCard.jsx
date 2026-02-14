import { useState } from "react"

function CardLimitCard({ setCardLimit }) {

  const [value, setValue] = useState("")

  function handleChange(e) {
    const number = Number(e.target.value)
    setValue(number)
    setCardLimit(number)
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
      <h2 className="text-base font-semibold text-[#1c1c1e]">
        💳 Limite do Cartão
      </h2>

      <input
        type="number"
        placeholder="Ex: 8000"
        value={value}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  )
}

export default CardLimitCard
