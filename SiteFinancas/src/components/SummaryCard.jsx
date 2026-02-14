function SummaryCard({ income, installments, cardLimit }) {

  const totalInstallments = installments.reduce((acc, item) => {
    return acc + item.value
  }, 0)

  const remaining = income - totalInstallments

  const percentageUsed = cardLimit > 0
    ? (totalInstallments / cardLimit) * 100
    : 0

  // 🔥 NOVA PARTE — SIMULAÇÃO
  const monthsLeft = installments.length > 0
    ? Math.max(...installments.map(item => item.months))
    : 0

  const totalDebt = installments.reduce((acc, item) => {
    return acc + (item.value * item.months)
  }, 0)

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md space-y-6">
      <h2 className="text-lg font-semibold">
        📊 Resumo Mensal
      </h2>

      {/* RESUMO BÁSICO */}
      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Salário:</span>
          <span>R$ {income}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Parcelas:</span>
          <span>R$ {totalInstallments}</span>
        </div>

        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-base">
          <span>Sobra:</span>
          <span className={remaining < 0 ? "text-red-500" : "text-green-400"}>
            R$ {remaining}
          </span>
        </div>
      </div>

      {/* BARRA DO CARTÃO */}
      {cardLimit > 0 && (
        <div className="space-y-2">
          <p className="text-sm">Uso do Cartão</p>

          <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
            <div
              className={`h-4 ${
                percentageUsed > 100
                  ? "bg-red-600"
                  : percentageUsed > 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>

          <p className="text-xs text-gray-400">
            {percentageUsed.toFixed(1)}% do limite usado
          </p>
        </div>
      )}

      {/* 🔥 SIMULAÇÃO FUTURA */}
      {installments.length > 0 && (
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <h3 className="font-semibold text-sm text-gray-300">
            📆 Projeção
          </h3>

          <div className="flex justify-between text-sm">
            <span>Meses restantes:</span>
            <span>{monthsLeft}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Total a pagar ainda:</span>
            <span>R$ {totalDebt}</span>
          </div>

          <div className="text-xs text-gray-400 pt-1">
            Você ficará livre das parcelas em {monthsLeft} meses.
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryCard
