import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SimpleCalculator() {

    const navigate = useNavigate()

    const [income, setIncome] = useState(0)
    const [investment, setInvestment] = useState(0)
    const [cardLimit, setCardLimit] = useState(0)
    const [currentBill, setCurrentBill] = useState(0)

    // =========================
    // CÁLCULO DEFINITIVO
    // =========================

    const capacity = Number(income) - Number(investment)

    const realLimit =
        Math.max(0, Math.min(capacity, Number(cardLimit)))

    const remaining =
        realLimit - Number(currentBill)

    const usagePercent =
        realLimit > 0
            ? (Number(currentBill) / realLimit) * 100
            : 0

    const format = (v) =>
        Number(v).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-black pt-16 px-6 flex justify-center">

            <div className="w-full max-w-md space-y-6">

                {/* BOTÃO VOLTAR */}
                <button
                    onClick={() => navigate("/")}
                    className="
            text-sm
            px-4 py-2
            rounded-xl
            bg-slate-200 dark:bg-slate-800
            text-black dark:text-white
            hover:opacity-80
            transition
          "
                >
                    ← Voltar para Home
                </button>

                {/* CARD PRINCIPAL */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-md space-y-6">

                    <h1 className="text-xl font-semibold text-center text-black dark:text-white">
                        ⚡ Cálculo Simplificado
                    </h1>

                    <Input label="Salário" value={income} setValue={setIncome} />
                    <Input label="Investimentos" value={investment} setValue={setInvestment} />
                    <Input label="Limite do cartão" value={cardLimit} setValue={setCardLimit} />
                    <Input label="Fatura atual" value={currentBill} setValue={setCurrentBill} />

                </div>

                {/* MINI DASHBOARD */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md space-y-4">

                    <h2 className="font-semibold text-black dark:text-white">
                        📊 Resumo
                    </h2>

                    <DashboardRow label="Capacidade por renda" value={format(capacity)} />
                    <DashboardRow label="Limite seguro da fatura" value={format(realLimit)} />
                    <DashboardRow label="Fatura atual" value={format(currentBill)} />

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 text-center space-y-2">

                        <p className="text-sm text-black dark:text-white">
                            Sua fatura pode chegar até:
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                            {format(realLimit)}
                        </p>

                        <p className="text-sm text-black dark:text-white pt-2">
                            Você ainda pode gastar:
                        </p>

                        <p className={`text-3xl font-bold ${remaining < 0 ? "text-red-500" : "text-emerald-500"
                            }`}>
                            {format(Math.max(remaining, 0))}
                        </p>

                    </div>

                    {/* Barra visual */}
                    {realLimit > 0 && (
                        <div className="pt-4 space-y-2">

                            <div className="flex justify-between text-xs text-black dark:text-white">
                                <span>Uso da capacidade</span>
                                <span>{usagePercent.toFixed(0)}%</span>
                            </div>

                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${usagePercent < 50
                                            ? "bg-emerald-500"
                                            : usagePercent < 75
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}

function Input({ label, value, setValue }) {
    return (
        <div>
            <label className="text-sm text-black dark:text-white">
                {label}
            </label>
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="
          w-full px-4 py-2 rounded-xl
          bg-slate-100 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-black dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
            />
        </div>
    )
}

function DashboardRow({ label, value }) {
    return (
        <div className="flex justify-between text-black dark:text-white text-sm">
            <span>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export default SimpleCalculator