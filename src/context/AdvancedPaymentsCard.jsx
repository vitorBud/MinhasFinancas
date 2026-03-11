import { useState } from "react"

export default function AdvancedPaymentsCard({
    advancedPayments,
    setAdvancedPayments
}) {

    const [description, setDescription] = useState("")
    const [value, setValue] = useState("")

    function handleAdd() {
        if (!value) return

        const newPayment = {
            description,
            value: Number(value)
        }

        setAdvancedPayments([...advancedPayments, newPayment])
        setDescription("")
        setValue("")
    }

    function handleRemove(index) {
        const updated = advancedPayments.filter((_, i) => i !== index)
        setAdvancedPayments(updated)
    }

    return (
        <div className="
    
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
      ">

            <h2 className="text-gray-900 dark:text-white text-lg font-semibold">
                💸 Adiantei a conta?
            </h2>

            <input
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
        w-full
        px-4 py-3
        rounded-xl
        bg-white/60
        dark:bg-white/10
        border border-white/30
        dark:border-white/10
        text-gray-900
        dark:text-white
        placeholder:text-gray-400
        focus:outline-none
      "
            />

            <input
                type="number"
                placeholder="Valor"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="
        w-full
        px-4 py-3
        rounded-xl
        bg-white/60
        dark:bg-white/10
        border border-white/30
        dark:border-white/10
        text-gray-900
        dark:text-white
        placeholder:text-gray-400
        focus:outline-none
      "
            />

            <button
                onClick={handleAdd}
                className="
        w-full
        py-3
        rounded-xl
        bg-blue-500
        hover:bg-blue-600
        text-white
        font-medium
        transition
      "
            >
                Adicionar
            </button>

            {advancedPayments.map((item, index) => (
                <div
                    key={index}
                    className="
          flex
          justify-between
          items-center
          p-3
          rounded-xl
          bg-white/50
          dark:bg-white/5
        "
                >
                    <span className="text-sm text-gray-900 dark:text-white">
                        {item.description} - R$ {item.value}
                    </span>

                    <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 text-sm"
                    >
                        Remover
                    </button>
                </div>
            ))}

        </div>
    )
}