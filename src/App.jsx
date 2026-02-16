import { useState, useEffect } from "react"
import TopBar from "./components/TopBar"
import IncomeCard from "./components/IncomeCard"
import InvestmentCard from "./components/InvestmentCard"
import CardLimitCard from "./components/CardLimitCard"
import InstallmentsCard from "./components/InstallmentsCard"
import FixedExpensesCard from "./components/FixedExpensesCard"
import CreditLimitBasedOnIncome from "./components/CreditLimitBasedOnIncome"
import SummaryCard from "./components/SummaryCard"
import ChatAssistant from "./components/ChatAssistant" // Novo componente
import { useFinance } from "./context/FinanceContext" // Usando o Contexto
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import LoadingScreen from "./components/LoadingScreen"
import { FinanceProvider } from "./context/FinanceContext"
import BillingDayCard from "./components/BillingDayCard"

// ou o caminho correto onde você salvou o arquivo

function AppContent() {
  const { user, loading } = useAuth()
  const { data, setData, saveToDatabase, isLoaded } = useFinance()

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )
  const [chatOpen, setChatOpen] = useState(false)

  // =============================
  // CONTROLE DE TEMA
  // =============================
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  // =============================
  // AUTO SAVE
  // =============================
  useEffect(() => {
    if (!user || !isLoaded) return
    const timer = setTimeout(() => {
      saveToDatabase()
    }, 1000)
    return () => clearTimeout(timer)
  }, [data, user, isLoaded])

  if (loading) return <LoadingScreen />
  if (!user) return <Login />

  // =============================
  // 🔥 TROCA REAL DE TELA
  // =============================
  if (chatOpen) {
    return (
      <ChatAssistant
        onClose={() => setChatOpen(false)}
      />
    )
  }

  // =============================
  // TELA PRINCIPAL
  // =============================
  return (
    <div className="min-h-screen relative pt-24 px-4 bg-slate-100 dark:bg-black transition-colors duration-300 overflow-x-hidden">

      {/* Glow Background */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <TopBar
        onReset={() =>
          setData({
            income: 0,
            investment: 0,
            billingDay: 1,
            installments: [],
            fixedExpenses: [],
            cardLimit: 0,
            dailyExpenses: []
          })
        }
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAssistant={() => setChatOpen(true)}
      />

      <div className="max-w-md mx-auto space-y-6 pb-24 relative z-10">

        <IncomeCard
          income={data.income}
          setIncome={(val) =>
            setData(prev => ({ ...prev, income: val }))
          }
        />

        <BillingDayCard
          billingDay={data.billingDay}
          setBillingDay={(val) => setData(prev => ({ ...prev, billingDay: val }))}
        />


        <InvestmentCard
          investment={data.investment}
          setInvestment={(val) =>
            setData(prev => ({ ...prev, investment: val }))
          }
        />

        <CardLimitCard
          cardLimit={data.cardLimit}
          setCardLimit={(val) =>
            setData(prev => ({ ...prev, cardLimit: val }))
          }
        />

        <InstallmentsCard
          installments={data.installments}
          setInstallments={(list) =>
            setData(prev => ({ ...prev, installments: list }))
          }
        />

        <FixedExpensesCard
          fixedExpenses={data.fixedExpenses}
          setFixedExpenses={(list) =>
            setData(prev => ({ ...prev, fixedExpenses: list }))
          }
        />

        <SummaryCard
          income={data.income}
          investment={data.investment}
          installments={data.installments}
          fixedExpenses={data.fixedExpenses}
        />

        <CreditLimitBasedOnIncome
          income={data.income}
          investment={data.investment}
          installments={data.installments}
          fixedExpenses={data.fixedExpenses}
          dailyExpenses={data.dailyExpenses}
          cardLimit={data.cardLimit}
        />
      </div>
    </div>
  )
}


// O App precisa estar dentro do Provider
export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}