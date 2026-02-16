import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  const [data, setData] = useState({
    income: 0,
    investment: 0,
    cardLimit: 0,
    billingDay: 1,
    installments: [],
    fixedExpenses: [],
    dailyExpenses: []
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 🔥 FUNÇÃO QUE GARANTE ARRAY SEMPRE
  function normalizeArray(field) {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "object") return Object.values(field);
    return [];
  }

  // =========================
  // CARREGAR DADOS
  // =========================
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      const { data: dbData, error } = await supabase
        .from("finance_data")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar:", error);
      }

      if (dbData) {
        setData({
          income: Number(dbData.income) || 0,
          investment: Number(dbData.investment) || 0,
          cardLimit: Number(dbData.card_limit) || 0,
          billingDay: Number(dbData.billing_day) || 1,

          installments: normalizeArray(dbData.installments),
          fixedExpenses: normalizeArray(dbData.fixed_expenses),
          dailyExpenses: normalizeArray(dbData.daily_expenses)
        });
      }

      setIsLoaded(true);
    }

    loadData();
  }, [user]);

  // =========================
  // SALVAR DADOS
  // =========================
  async function saveToDatabase() {
    if (!user) return;

    const { error } = await supabase
      .from("finance_data")
      .upsert(
        {
          user_id: user.id,
          income: data.income,
          investment: data.investment,
          card_limit: data.cardLimit,
          billing_day: data.billingDay,
          installments: data.installments,
          fixed_expenses: data.fixedExpenses,
          daily_expenses: data.dailyExpenses
        },
        {
          onConflict: "user_id"
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
        isLoaded
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
