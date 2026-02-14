import { useState } from "react"

function IncomeCard({ setIncome }) {
  const [value, setValue] = useState("")

  function handleChange(e) {
    const number = Number(e.target.value)
    setValue(number)
    setIncome(number)
  }

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        💰 Quanto você ganha?
      </h2>

      <input
        type="number"
        placeholder="Ex: 3700"
        value={value}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}

export default IncomeCard
