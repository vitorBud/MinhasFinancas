function SummaryCard({
  income,
  investment,
  installments,
  fixedExpenses
}) {

  const totalInstallmentsMonthly =
    installments.reduce((acc, item) => acc + item.value, 0)

  const totalFixed =
    fixedExpenses.reduce((acc, item) => acc + item.value, 0)

  const remaining =
    income - investment - totalInstallmentsMonthly - totalFixed

  const totalDebt =
    installments.reduce((acc, item) => acc + (item.value * item.months), 0)

  const monthsLeft =
    installments.length > 0
      ? Math.max(...installments.map(item => item.months))
      : 0

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-base font-semibold">
        📊 Resumo Mensal
      </h2>

      <div className="text-sm space-y-2">

        <div className="flex justify-between">
          <span>Salário</span>
          <span>R$ {income}</span>
        </div>

        <div className="flex justify-between">
          <span>Investimento</span>
          <span>R$ {investment}</span>
        </div>

        <div className="flex justify-between">
          <span>Parcelas (mensal)</span>
          <span>R$ {totalInstallmentsMonthly}</span>
        </div>

        <div className="flex justify-between">
          <span>Gastos fixos</span>
          <span>R$ {totalFixed}</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Sobra</span>
          <span className={remaining < 0 ? "text-red-500" : "text-blue-500"}>
            R$ {remaining}
          </span>
        </div>
      </div>

      {installments.length > 0 && (
        <div className="text-sm border-t pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Total dívida futura</span>
            <span>R$ {totalDebt}</span>
          </div>

          <div className="flex justify-between">
            <span>Meses restantes</span>
            <span>{monthsLeft}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryCard
