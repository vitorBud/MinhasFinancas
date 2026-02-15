function CreditLimitBasedOnIncome({
  income = 0,
  investment = 0,
  installments = [],
  fixedExpenses = []
}) {

  const totalInstallmentsMonthly =
    installments.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const totalFixed =
    fixedExpenses.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )

  const maxInvoiceAllowed =
    income - investment - totalFixed

  const remainingAvailable =
    maxInvoiceAllowed - totalInstallmentsMonthly

  const isOver =
    remainingAvailable < 0

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
        space-y-4
        transition-colors duration-300
      "
    >

      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        📉 Fatura Máxima Permitida
      </h2>

      {income === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Defina seu salário para calcular.
        </p>
      ) : (
        <>
          <div className="text-sm space-y-4">

            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Fatura pode chegar até
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {formatCurrency(maxInvoiceAllowed)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Fatura atual (parcelas)
              </span>
              <span className="text-slate-800 dark:text-slate-100">
                {formatCurrency(totalInstallmentsMonthly)}
              </span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">

              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {isOver ? "Excedente" : "Ainda pode usar"}
              </span>

              <span
                className={`text-lg font-bold ${
                  isOver
                    ? "text-red-500"
                    : "text-emerald-500"
                }`}
              >
                {formatCurrency(Math.abs(remainingAvailable))}
              </span>

            </div>

          </div>

          {isOver && (
            <div className="
              mt-3
              bg-red-50
              dark:bg-red-900/20
              border border-red-200
              dark:border-red-700/40
              text-red-600
              dark:text-red-400
              text-xs
              p-3
              rounded-xl
              transition-colors duration-300
            ">
              ⚠️ Sua fatura ultrapassou o valor que você consegue pagar com segurança.
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default CreditLimitBasedOnIncome
