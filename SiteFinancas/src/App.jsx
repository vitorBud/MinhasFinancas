import { useState, useEffect } from "react"
import IncomeCard from "./components/IncomeCard"
import InstallmentsCard from "./components/InstallmentsCard"
import CardLimitCard from "./components/CardLimitCard"
import SummaryCard from "./components/SummaryCard"
import TopBar from "./components/TopBar"

function App() {

  const [income, setIncome] = useState(0)
  const [installments, setInstallments] = useState([])
  const [cardLimit, setCardLimit] = useState(0)

  // 🔹 Carregar dados ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem("financeData")

    if (savedData) {
      const parsed = JSON.parse(savedData)
      setIncome(parsed.income || 0)
      setInstallments(parsed.installments || [])
      setCardLimit(parsed.cardLimit || 0)
    }
  }, [])

  // 🔹 Salvar sempre que algo mudar
  useEffect(() => {
    const data = {
      income,
      installments,
      cardLimit
    }

    localStorage.setItem("financeData", JSON.stringify(data))
  }, [income, installments, cardLimit])

  return (
    <div className="min-h-screen text-white pt-20 px-4">
      <TopBar/>
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">
          Controle Financeiro
        </h1>

        <IncomeCard setIncome={setIncome} />

        <CardLimitCard 
          cardLimit={cardLimit}
          setCardLimit={setCardLimit}
        />

        <InstallmentsCard 
          installments={installments}
          setInstallments={setInstallments}
        />

        <SummaryCard 
          income={income}
          installments={installments}
          cardLimit={cardLimit}
        />
      </div>
    </div>
  )
}

export default App
