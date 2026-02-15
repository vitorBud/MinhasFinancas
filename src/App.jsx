import { useState, useEffect, useRef } from "react"
import TopBar from "./components/TopBar"
import IncomeCard from "./components/IncomeCard"
import InvestmentCard from "./components/InvestmentCard"
import CardLimitCard from "./components/CardLimitCard"
import InstallmentsCard from "./components/InstallmentsCard"
import FixedExpensesCard from "./components/FixedExpensesCard"
import CreditLimitBasedOnIncome from "./components/CreditLimitBasedOnIncome"
import SummaryCard from "./components/SummaryCard"
import AssistantModal from "./components/AssistantModal"
import { supabase } from "./lib/supabase"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import LoadingScreen from "./components/LoadingScreen"

function App() {

  const { user, loading } = useAuth()

  /* ===========================
     THEME CONTROL
  ============================ */

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  /* ===========================
     FINANCE STATES
  ============================ */

  const [income, setIncome] = useState(0)
  const [investment, setInvestment] = useState(0)
  const [installments, setInstallments] = useState([])
  const [cardLimit, setCardLimit] = useState(0)
  const [fixedExpenses, setFixedExpenses] = useState([])

  /* ===========================
     ASSISTANT STATES
  ============================ */

  const [dailyExpenses, setDailyExpenses] = useState([])
  const [assistantOpen, setAssistantOpen] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const isFirstRender = useRef(true)

  /* ===========================
     FETCH DATA
  ============================ */

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const { data } = await supabase
        .from("finance_data")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setIncome(Number(data.income) || 0)
        setInvestment(Number(data.investment) || 0)
        setInstallments(data.installments || [])
        setFixedExpenses(data.fixed_expenses || [])
        setCardLimit(Number(data.card_limit) || 0)
      }

      setIsLoaded(true)
    }

    fetchData()
  }, [user])

  /* ===========================
     AUTO SAVE
  ============================ */

  useEffect(() => {
    if (!user || !isLoaded) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    async function saveData() {
      await supabase
        .from("finance_data")
        .upsert(
          {
            user_id: user.id,
            income: Number(income) || 0,
            investment: Number(investment) || 0,
            installments,
            fixed_expenses: fixedExpenses,
            card_limit: Number(cardLimit) || 0
          },
          { onConflict: "user_id" }
        )
    }

    saveData()
  }, [
    income,
    investment,
    installments,
    fixedExpenses,
    cardLimit,
    user,
    isLoaded
  ])

  /* ===========================
     ASSISTANT CALCULATIONS
  ============================ */

  const totalManualSpent =
    dailyExpenses.reduce((acc, item) => acc + item.value, 0)

  const totalInstallmentsMonthly =
    installments.reduce((acc, item) => acc + Number(item.value || 0), 0)

  const totalFixed =
    fixedExpenses.reduce((acc, item) => acc + Number(item.value || 0), 0)

  const maxByIncome =
    Number(income || 0) - Number(investment || 0) - totalFixed

  const realMaxAllowed =
    Math.min(maxByIncome, Number(cardLimit || 0))

  const remainingAfterManual =
    realMaxAllowed - totalInstallmentsMonthly - totalManualSpent

  /* ===========================
     RESET
  ============================ */

  function handleReset() {
    setIncome(0)
    setInvestment(0)
    setInstallments([])
    setCardLimit(0)
    setFixedExpenses([])
    setDailyExpenses([])
  }

  /* ===========================
     LOADING
  ============================ */

  if (loading) return <LoadingScreen />
  if (!user) return <Login />

  /* ===========================
     MAIN LAYOUT
  ============================ */

  return (
    <div className="
      min-h-screen
      relative
      pt-24
      px-4
      bg-slate-100
      dark:bg-black
      transition-colors duration-300
    ">

      {/* Glow Background */}
      <div
        className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2
          w-[320px] sm:w-[500px] md:w-[600px]
          h-[320px] sm:h-[500px] md:h-[600px]
          bg-blue-500/20
          blur-[120px]
          rounded-full
          dark:bg-blue-600/20
          pointer-events-none
        "
      />

      <TopBar
        onReset={handleReset}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAssistant={() => setAssistantOpen(true)}
      />


      <div className="max-w-md mx-auto space-y-6 pb-16 relative z-10">

        <IncomeCard income={income} setIncome={setIncome} />

        <InvestmentCard
          investment={investment}
          setInvestment={setInvestment}
        />

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
          cardLimit={cardLimit}
        />

      </div>


      {/* 🤖 MODAL */}
      <AssistantModal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        dailyExpenses={dailyExpenses}
        setDailyExpenses={setDailyExpenses}
        totalManualSpent={totalManualSpent}
        remainingAfterManual={remainingAfterManual}
      />

    </div>
  )
}

export default App
