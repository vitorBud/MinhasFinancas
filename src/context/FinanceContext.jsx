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
    installments: [],
    fixedExpenses: [],
    dailyExpenses: []
  });

  // Carregar dados iniciais
  useEffect(() => {
    if (!user) return;
    async function fetchFinance() {
      const { data: dbData } = await supabase
        .from("finance_data")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (dbData) {
        setData({
          income: Number(dbData.income),
          investment: Number(dbData.investment),
          cardLimit: Number(dbData.card_limit),
          installments: dbData.installments || [],
          fixedExpenses: dbData.fixed_expenses || [],
          dailyExpenses: dbData.daily_expenses || []
        });
      }
    }
    fetchFinance();
  }, [user]);

  return (
    <FinanceContext.Provider value={{ data, setData }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);