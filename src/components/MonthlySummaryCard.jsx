export default function MonthlySummaryCard({ data }) {

    const totalInstallments =
        data.installments.reduce((acc, item) => acc + Number(item.value || 0), 0)

    const totalAdvanced =
        data.advancedPayments.reduce((acc, item) => acc + Number(item.value || 0), 0)

    const adjustedInstallments =
        Math.max(0, totalInstallments - totalAdvanced)

    const totalFixed =
        data.fixedExpenses.reduce((acc, item) => acc + Number(item.value || 0), 0)

    const totalDaily =
        data.dailyExpenses.reduce((acc, item) => acc + Number(item.value || 0), 0)

    const totalCommitment =
        adjustedInstallments + totalFixed + totalDaily + Number(data.investment || 0)

    const remaining =
        Number(data.income || 0) - totalCommitment

    const format = (v) =>
        v.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    let status = "Situação saudável 🟢"
    let color = "text-emerald-500"

    if (remaining < 0) {
        status = "Você gastou mais do que recebeu 🔴"
        color = "text-red-500"
    }
    else if (remaining < 500) {
        status = "Atenção ao fluxo de caixa 🟡"
        color = "text-yellow-500"
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

            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                📊 Resumo do Mês
            </h2>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Receita</span>
                <span className="text-slate-800 dark:text-slate-100">
                    {format(Number(data.income || 0))}
                </span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total comprometido</span>
                <span className="text-slate-800 dark:text-slate-100">
                    {format(totalCommitment)}
                </span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">

                <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Sobrou no débito
                </span>

                <span
                    className={`text-lg font-bold ${remaining < 0
                            ? "text-red-500"
                            : "text-emerald-500"
                        }`}
                >
                    {format(remaining)}
                </span>

            </div>

            <div className={`text-sm ${color}`}>
                {status}
            </div>

        </div>
    )
}