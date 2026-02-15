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
import LoadingScreen from "./components/LoadingScreen"

function App() {

  const { user, loading } = useAuth()

  /* ===========================
     THEME CONTROL (CORRETO)
  ============================ */

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

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
            income,
            investment,
            installments,
            fixed_expenses: fixedExpenses,
            card_limit: cardLimit
          },
          { onConflict: "user_id" }
        )
    }

    saveData()
  }, [income, investment, installments, fixedExpenses, cardLimit, user, isLoaded])

  /* ===========================
     RESET
  ============================ */

  function handleReset() {
    setIncome(0)
    setInvestment(0)
    setInstallments([])
    setCardLimit(0)
    setFixedExpenses([])
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
      />

      <div className=" max-w-md mx-auto space-y-6 pb-16 relative z-10">

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
        />

      </div>
    </div>
  )
}

export default App
