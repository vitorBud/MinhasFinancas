import { useState } from "react"

function CardLimitCard({ cardLimit, setCardLimit }) {

  const [value, setValue] = useState("")

  function handleChange(e) {
    const number = Number(e.target.value)
    setValue(number)
    setCardLimit(number)
  }

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md space-y-3">
      <h2 className="text-lg font-semibold">
        💳 Limite do Cartão
      </h2>

      <input
        type="number"
        placeholder="Ex: 8000"
        value={value}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
      />
    </div>
  )
}

export default CardLimitCard
