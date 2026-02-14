import { useState, useEffect, useRef } from "react"
import TopBar from "./components/TopBar"
import IncomeCard from "./components/IncomeCard"
import InvestmentCard from "./components/InvestmentCard"
import CardLimitCard from "./components/CardLimitCard"
import InstallmentsCard from "./components/InstallmentsCard"
import FixedExpensesCard from "./components/FixedExpensesCard"
import CreditLimitBasedOnIncome from "./components/CreditLimitBasedOnIncome"
import SummaryCard from "./components/SummaryCard"
import { supabase } from "./lib/supabase"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"

function App() {

  const { user, loading } = useAuth()

  const [income, setIncome] = useState(0)
  const [investment, setInvestment] = useState(0)
  const [installments, setInstallments] = useState([])
  const [cardLimit, setCardLimit] = useState(0)
  const [fixedExpenses, setFixedExpenses] = useState([])

  const [isLoaded, setIsLoaded] = useState(false)
  const isFirstRender = useRef(true)

  // 🔹 Buscar dados do usuário
  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const { data, error } = await supabase
        .from("finance_data")
        .select("*")
        .eq("user_id", user.id)

      if (error && error.code !== "PGRST116") {
        console.log("ERRO BUSCAR:", error)
        return
      }

      if (data && data.length > 0) {
        const finance = data[0]

        setIncome(finance.income || 0)
        setInvestment(finance.investment || 0)
        setInstallments(finance.installments || [])
        setFixedExpenses(finance.fixed_expenses || [])
        setCardLimit(finance.card_limit || 0)
      }


      setIsLoaded(true)
    }

    fetchData()
  }, [user])

  // 🔹 Salvar automaticamente (apenas depois de carregar)
  useEffect(() => {
    if (!user || !isLoaded) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    async function saveData() {
      const { error } = await supabase
        .from("finance_data")
        .upsert(
          {
            user_id: user.id,
            income,
            investment,
            installments,
            fixed_expenses: fixedExpenses,
            card_limit: cardLimit
          },
          { onConflict: "user_id" }
        )

      if (error) {
        console.log("ERRO SALVAR:", error)
      }
    }

    saveData()

  }, [income, investment, installments, fixedExpenses, cardLimit, user, isLoaded])

  function handleReset() {
    setIncome(0)
    setInvestment(0)
    setInstallments([])
    setCardLimit(0)
    setFixedExpenses([])
  }

  if (loading) return <p>Carregando...</p>

  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-[#f2f2f7] pt-20 px-4">
      <TopBar onReset={handleReset} />

      <div className="max-w-md mx-auto space-y-6 pb-10">

        <IncomeCard income={income} setIncome={setIncome} />

        <InvestmentCard investment={investment} setInvestment={setInvestment} />

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
