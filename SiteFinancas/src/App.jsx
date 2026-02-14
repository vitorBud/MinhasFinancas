import { useState, useEffect } from "react"
import TopBar from "./components/TopBar"
import IncomeCard from "./components/IncomeCard"
import InvestmentCard from "./components/InvestmentCard"
import CardLimitCard from "./components/CardLimitCard"
import InstallmentsCard from "./components/InstallmentsCard"
import FixedExpensesCard from "./components/FixedExpensesCard"
import CreditLimitBasedOnIncome from "./components/CreditLimitBasedOnIncome"
import SummaryCard from "./components/SummaryCard"

function App() {

  const [income, setIncome] = useState(0)
  const [investment, setInvestment] = useState(0)
  const [installments, setInstallments] = useState([])
  const [cardLimit, setCardLimit] = useState(0)
  const [fixedExpenses, setFixedExpenses] = useState([])

  // 🔹 Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem("financeData")

    if (savedData) {
      const parsed = JSON.parse(savedData)

      setIncome(parsed.income || 0)
      setInvestment(parsed.investment || 0)
      setInstallments(parsed.installments || [])
      setCardLimit(parsed.cardLimit || 0)
      setFixedExpenses(parsed.fixedExpenses || [])
    }
  }, [])

  // 🔹 Salvar sempre que mudar
  useEffect(() => {
    const data = {
      income,
      investment,
      installments,
      cardLimit,
      fixedExpenses
    }

    localStorage.setItem("financeData", JSON.stringify(data))
  }, [income, investment, installments, cardLimit, fixedExpenses])

  function handleReset() {
    localStorage.removeItem("financeData")
    setIncome(0)
    setInvestment(0)
    setInstallments([])
    setCardLimit(0)
    setFixedExpenses([])
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] pt-20 px-4">
      <TopBar onReset={handleReset} />

      <div className="max-w-md mx-auto space-y-6 pb-10">

        <IncomeCard setIncome={setIncome} />

        <InvestmentCard setInvestment={setInvestment} />

        <CardLimitCard
          cardLimit={cardLimit}
          setCardLimit={setCardLimit}
        />

        <InstallmentsCard
          installments={installments}
          setInstallments={setInstallments}
        />

        <FixedExpensesCard
          fixedExpenses={fixedExpenses}
          setFixedExpenses={setFixedExpenses}
        />

        <SummaryCard
          income={income}
          investment={investment}
          installments={installments}
          fixedExpenses={fixedExpenses}
        />

        <CreditLimitBasedOnIncome
          income={income}
          investment={investment}
          installments={installments}
          fixedExpenses={fixedExpenses}
        />



      </div>
    </div>
  )
}

export default App
