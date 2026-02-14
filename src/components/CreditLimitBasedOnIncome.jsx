function CreditLimitBasedOnIncome({
  income,
  investment,
  installments,
  fixedExpenses
}) {

  const totalInstallmentsMonthly =
    installments.reduce((acc, item) => acc + item.value, 0)

  const totalFixed =
    fixedExpenses.reduce((acc, item) => acc + item.value, 0)

  const maxInvoiceAllowed =
    income - investment - totalFixed

  const remainingAvailable =
    maxInvoiceAllowed - totalInstallmentsMonthly

  const isOver =
    remainingAvailable < 0

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">

      <h2 className="text-base font-semibold">
        📉 Fatura Máxima Permitida
      </h2>

      {income === 0 ? (
        <p className="text-sm text-gray-500">
          Defina seu salário para calcular.
        </p>
      ) : (
        <>
          <div className="text-sm space-y-2">

            <div className="flex justify-between">
              <span>Fatura pode chegar até</span>
              <span className="font-medium">
                R$ {maxInvoiceAllowed}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Fatura atual (parcelas)</span>
              <span>
                R$ {totalInstallmentsMonthly}
              </span>
            </div>

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>
                {isOver ? "Excedente" : "Ainda pode usar"}
              </span>

              <span className={isOver ? "text-red-500" : "text-blue-500"}>
                R$ {Math.abs(remainingAvailable)}
              </span>
            </div>

          </div>

          {isOver && (
            <p className="text-xs text-red-500">
              ⚠️ Sua fatura ultrapassou o valor que você consegue pagar com segurança.
            </p>
          )}
        </>
      )}

    </div>
  )
}

export default CreditLimitBasedOnIncome
