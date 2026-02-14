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
    setInstallments(installments.filter(item => item.id !== id))
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-base font-semibold text-[#1c1c1e]">
        🧾 Parcelamentos
      </h2>

      <input
        type="text"
        placeholder="Nome da compra"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <input
        type="number"
        placeholder="Valor da parcela"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <input
        type="number"
        placeholder="Quantidade de parcelas"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-500 text-white p-3 rounded-xl font-medium active:scale-95 transition"
      >
        Adicionar
      </button>

      <div className="space-y-2">
        {installments.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
          >
            <div>
              <p className="font-medium text-[#1c1c1e]">{item.name}</p>
              <p className="text-sm text-gray-500">
                R$ {item.value} x {item.months}
              </p>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="text-sm text-red-500"
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
