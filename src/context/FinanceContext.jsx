import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [data, setData] = useState({
    income: 0,
    investment: 0,
    cardLimit: 0,
    billingDay: 1,
    installments: [],
    fixedExpenses: [],
    dailyExpenses: [],
    advancedPayments: [],
    simpleCurrentBill: 0,
    simpleExtraExpenses: []
  });

  const [isLoaded, setIsLoaded] = useState(false);

  function normalizeArray(field) {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "object") return Object.values(field);
    return [];
  }

  // =========================
  // CARREGAR POR MÊS
  // =========================
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      setIsLoaded(false);

      const { data: dbData, error } = await supabase
        .from("finance_months")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar:", error);
        setIsLoaded(true);
        return;
      }

      if (dbData) {
        setData({
          income: Number(dbData.income) || 0,
          investment: Number(dbData.investment) || 0,
          cardLimit: Number(dbData.card_limit) || 0,
          billingDay: Number(dbData.billing_day) || 1,
          installments: normalizeArray(dbData.installments),
          fixedExpenses: normalizeArray(dbData.fixed_expenses),
          dailyExpenses: normalizeArray(dbData.daily_expenses),
          advancedPayments: normalizeArray(dbData.advanced_payments),
          simpleCurrentBill: Number(dbData.simple_current_bill) || 0,
          simpleExtraExpenses: normalizeArray(dbData.simple_extra_expenses)
        });
      } else {
        await supabase.from("finance_months").insert({
          user_id: user.id,
          month: selectedMonth
        });

        setData({
          income: 0,
          investment: 0,
          cardLimit: 0,
          billingDay: 1,
          installments: [],
          fixedExpenses: [],
          dailyExpenses: [],
          advancedPayments: [],
          simpleCurrentBill: 0,
          simpleExtraExpenses: []
        });
      }

      setIsLoaded(true);
    }

    loadData();
  }, [user, selectedMonth]);

  // =========================
  // AUTO SAVE
  // =========================
  useEffect(() => {
    if (!user || !isLoaded) return;

    const timeout = setTimeout(() => {
      saveToDatabase();
    }, 800);

    return () => clearTimeout(timeout);
  }, [data]);

  // =========================
  // SALVAR
  // =========================
  async function saveToDatabase() {
    if (!user) return;

    const { error } = await supabase
      .from("finance_months")
      .upsert(
        {
          user_id: user.id,
          month: selectedMonth,
          income: data.income,
          investment: data.investment,
          card_limit: data.cardLimit,
          billing_day: data.billingDay,
          installments: data.installments,
          fixed_expenses: data.fixedExpenses,
          daily_expenses: data.dailyExpenses,
          advanced_payments: data.advancedPayments,
          simple_current_bill: data.simpleCurrentBill,
          simple_extra_expenses: data.simpleExtraExpenses
        },
        {
          onConflict: ["user_id", "month"]
        }
      );

    if (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        data,
        setData,
        saveToDatabase,
        isLoaded,
        selectedMonth,
        setSelectedMonth
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);