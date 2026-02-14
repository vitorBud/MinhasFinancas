import { useState } from "react"

function InstallmentsCard({ installments, setInstallments }) {

  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [months, setMonths] = useState("")

  function handleAdd() {
    if (!name || !value || !months) return

    const newInstallment = {
      id: Date.now(),
      name,
      value: Number(value),
      months: Number(months)
    }

    setInstallments([...installments, newInstallment])

    setName("")
    setValue("")
    setMonths("")
  }

  function handleRemove(id) {
    const updated = installments.filter(item => item.id !== id)
    setInstallments(updated)
  }

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">
        🧾 Parcelamentos
      </h2>

      <input
        type="text"
        placeholder="Nome da compra"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Valor da parcela"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Quantidade de parcelas"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
      >
        Adicionar
      </button>

      {/* Lista */}
      <div className="space-y-2">
        {installments.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-800 p-3 rounded-xl"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-400">
                R$ {item.value} x {item.months}
              </p>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 text-sm"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstallmentsCard
