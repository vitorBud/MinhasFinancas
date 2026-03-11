function CreditLimitBasedOnIncome({
  income = 0,
  investment = 0,
  installments = [],
  fixedExpenses = [],
  dailyExpenses = [],
  cardLimit = 0,
  advancedPayments = []
}) {

  // ========================
  // NORMALIZAÇÃO
  // ========================

  const safeIncome = Number(income) || 0
  const safeInvestment = Number(investment) || 0
  const safeCardLimit = Number(cardLimit) || 0

  // ========================
  // CÁLCULOS
  // ========================

  const totalInstallmentsMonthly =
    installments.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const totalAdvanced =
    advancedPayments.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const totalDaily =
    dailyExpenses.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const adjustedInstallments =
    Math.max(0, totalInstallmentsMonthly - totalAdvanced)

  const totalCardUsage = adjustedInstallments + totalDaily

  const totalFixed =
    fixedExpenses.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const maxByIncome =
    safeIncome - safeInvestment - totalFixed

  const realMaxAllowed =
    Math.max(0, Math.min(maxByIncome, safeCardLimit))

  const remainingAvailable =
    realMaxAllowed - totalCardUsage

  const usagePercent =
    safeCardLimit > 0
      ? (totalCardUsage / safeCardLimit) * 100
      : 0

  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

  // ========================
  // DIAGNÓSTICO
  // ========================

  let message = ""
  let color = "text-emerald-500"
  let bg = "bg-emerald-50 dark:bg-emerald-900/20"
  let border = "border-emerald-200 dark:border-emerald-700/40"

  if (safeCardLimit === 0) {
    message = "Defina o limite do cartão para análise completa."
    color = "text-slate-500"
    bg = "bg-slate-100 dark:bg-slate-800"
    border = "border-slate-300 dark:border-slate-600"
  }
  else if (usagePercent >= 90) {
    message = "⚠️ Você está utilizando mais de 90% do seu limite."
    color = "text-red-500"
    bg = "bg-red-50 dark:bg-red-900/20"
    border = "border-red-200 dark:border-red-700/40"
  }
  else if (usagePercent >= 75) {
    message = "Seu uso do cartão está acima de 75% do limite."
    color = "text-yellow-500"
    bg = "bg-yellow-50 dark:bg-yellow-900/20"
    border = "border-yellow-200 dark:border-yellow-700/40"
  }
  else if (safeCardLimit < maxByIncome) {
    message = "Seu limite é menor que sua capacidade de pagamento."
    color = "text-blue-500"
    bg = "bg-blue-50 dark:bg-blue-900/20"
    border = "border-blue-200 dark:border-blue-700/40"
  }
  else if (maxByIncome < safeCardLimit) {
    message = "Sua renda é o fator limitante, não o cartão."
  }

  // ========================
  // RENDER
  // ========================

  if (safeIncome === 0) {
    return (
      <CardContainer>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Defina seu salário para calcular.
        </p>
      </CardContainer>
    )
  }

  return (
    <CardContainer>

      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        💳 Diagnóstico do Cartão
      </h2>

      <div className="text-sm space-y-4">

        <Row
          label="Capacidade por renda"
          value={formatCurrency(maxByIncome)}
        />

        <Row
          label="Limite do cartão"
          value={formatCurrency(safeCardLimit)}
        />

        <Row
          label="Valor utilizável real"
          value={formatCurrency(realMaxAllowed)}
        />

        <Row
          label="Uso total no cartão"
          value={formatCurrency(totalCardUsage)}
        />

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">

          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {remainingAvailable < 0 ? "Excedente" : "Ainda pode usar"}
          </span>

          <span
            className={`text-lg font-bold ${remainingAvailable < 0
              ? "text-red-500"
              : "text-emerald-500"
              }`}
          >
            {formatCurrency(Math.abs(remainingAvailable))}
          </span>

        </div>

        {safeCardLimit > 0 && (
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Uso do limite</span>
            <span>{usagePercent.toFixed(0)}%</span>
          </div>
        )}

      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-xl border text-xs ${bg} ${border} ${color}`}>
          {message}
        </div>
      )}

    </CardContainer>
  )
}

/* 🔹 Card base */
function CardContainer({ children }) {
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
      {children}
    </div>
  )
}

/* 🔹 Linha padrão */
function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  )
}

export default CreditLimitBasedOnIncome
