import { useState, useEffect } from "react"
import TopBar from "../components/TopBar"
import IncomeCard from "../components/IncomeCard"
import InvestmentCard from "../components/InvestmentCard"
import CardLimitCard from "../components/CardLimitCard"
import InstallmentsCard from "../components/InstallmentsCard"
import FixedExpensesCard from "../components/FixedExpensesCard"
import CreditLimitBasedOnIncome from "../components/CreditLimitBasedOnIncome"
import SummaryCard from "../components/SummaryCard"
import MonthlySummaryCard from "../components/MonthlySummaryCard"
import ChatAssistant from "../components/ChatAssistant"
import BillingDayCard from "../components/BillingDayCard"
import AdvancedPaymentsCard from "../context/AdvancedPaymentsCard"
import { useFinance } from "../context/FinanceContext"
import { useNavigate } from "react-router-dom"

function Dashboard() {
    const { data, setData, selectedMonth, setSelectedMonth } = useFinance()

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    )

    const [chatOpen, setChatOpen] = useState(false)
    const navigate = useNavigate()

    // =============================
    // CONTROLE DE TEMA
    // =============================
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode)
        localStorage.setItem("theme", darkMode ? "dark" : "light")
    }, [darkMode])

    // =============================
    // CHAT SCREEN
    // =============================
    if (chatOpen) {
        return <ChatAssistant onClose={() => setChatOpen(false)} />
    }

    return (
        <div className="min-h-screen relative pt-24 px-4 bg-slate-100 dark:bg-black transition-colors duration-300 overflow-x-hidden">

            {/* Glow Background */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-md mx-auto mb-6">
                <button
                    onClick={() => navigate("/")}
                    className="
      text-sm
      px-4 py-2
      rounded-xl
      bg-slate-200 dark:bg-slate-800
      text-black dark:text-white
      hover:opacity-80
      transition
    "
                >
                    ← Voltar para Home
                </button>
            </div>

            {/* Seletor de Mês */}
            <div className="flex justify-center mb-6">
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="
            w-44
            sm:w-52
            px-4 py-2
            rounded-xl
            bg-white dark:bg-slate-900
            border border-slate-300 dark:border-slate-700
            text-sm
            text-slate-800 dark:text-slate-100
            shadow-sm
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            transition
          "
                />
            </div>

            {/* TopBar */}
            <TopBar
                onReset={() =>
                    setData({
                        income: 0,
                        investment: 0,
                        billingDay: 1,
                        installments: [],
                        fixedExpenses: [],
                        cardLimit: 0,
                        dailyExpenses: [],
                        advancedPayments: []
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
                    setBillingDay={(val) =>
                        setData(prev => ({ ...prev, billingDay: val }))
                    }
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

                <AdvancedPaymentsCard
                    advancedPayments={data.advancedPayments}
                    setAdvancedPayments={(list) =>
                        setData(prev => ({ ...prev, advancedPayments: list }))
                    }
                />

                <FixedExpensesCard
                    fixedExpenses={data.fixedExpenses}
                    setFixedExpenses={(list) =>
                        setData(prev => ({ ...prev, fixedExpenses: list }))
                    }
                />

                <MonthlySummaryCard data={data} />

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
                    advancedPayments={data.advancedPayments}
                />

            </div>
        </div>
    )
}

export default Dashboard