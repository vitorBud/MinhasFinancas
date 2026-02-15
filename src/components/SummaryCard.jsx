function SummaryCard({
  income = 0,
  investment = 0,
  installments = [],
  fixedExpenses = []
}) {

  const totalInstallmentsMonthly =
    installments.reduce((acc, item) => acc + Number(item.value || 0), 0)

  const totalFixed =
    fixedExpenses.reduce((acc, item) => acc + Number(item.value || 0), 0)

  const remaining =
    income - investment - totalInstallmentsMonthly - totalFixed

  const totalDebt =
    installments.reduce(
      (acc, item) => acc + (Number(item.value || 0) * Number(item.months || 0)),
      0
    )

  const monthsLeft =
    installments.length > 0
      ? Math.max(...installments.map(item => Number(item.months || 0)))
      : 0

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

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
        space-y-5
        transition-colors duration-300
      "
    >
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        📊 Resumo Mensal
      </h2>

      <div className="text-sm space-y-3">

        <Row label="Salário" value={formatCurrency(income)} positive />

        <Row label="Investimento" value={formatCurrency(investment)} />

        <Row label="Parcelas (mensal)" value={formatCurrency(totalInstallmentsMonthly)} />

        <Row label="Gastos fixos" value={formatCurrency(totalFixed)} />

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">

          <span className="text-slate-800 dark:text-slate-100 font-semibold">
            Sobra
          </span>

          <span
            className={`text-lg font-bold ${
              remaining < 0
                ? "text-red-500"
                : "text-emerald-500"
            }`}
          >
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {installments.length > 0 && (
        <div className="text-sm border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">

          <Row label="Total dívida futura" value={formatCurrency(totalDebt)} />

          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Meses restantes
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {monthsLeft}
            </span>
          </div>

        </div>
      )}
    </div>
  )
}

/* 🔥 Linha padronizada */
function Row({ label, value, positive }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={`font-medium ${
          positive
            ? "text-blue-500"
            : "text-slate-800 dark:text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default SummaryCard
