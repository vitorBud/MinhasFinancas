import { useState, useRef, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

function ChatAssistant({ onClose }) {
  const { data, setData } = useFinance();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá 👋 O que você deseja fazer?"
    }
  ]);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showAddExpense]);

  const format = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  // ==========================
  // ADICIONAR / EDITAR
  // ==========================

  function handleAddOrEditExpense() {
    if (!category || !value) return;

    const numberValue = Number(value);
    if (numberValue <= 0) return;

    if (editingId) {
      setData(prev => ({
        ...prev,
        dailyExpenses: prev.dailyExpenses.map(item =>
          item.id === editingId
            ? { ...item, name: category, value: numberValue }
            : item
        )
      }));
      setEditingId(null);
    } else {
      setData(prev => ({
        ...prev,
        dailyExpenses: [
          ...prev.dailyExpenses,
          {
            id: Date.now(),
            name: category,
            value: numberValue
          }
        ]
      }));
    }

    setCategory("");
    setValue("");
    setShowAddExpense(false);
  }

  function handleRemove(id) {
    setData(prev => ({
      ...prev,
      dailyExpenses: prev.dailyExpenses.filter(item => item.id !== id)
    }));
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setCategory(item.name);
    setValue(item.value);
    setShowAddExpense(true);
  }

  // ==========================
  // CÁLCULOS
  // ==========================

  const totalFixed = data.fixedExpenses.reduce(
    (acc, i) => acc + Number(i.value || 0),
    0
  );

  const totalInstallments = data.installments.reduce(
    (acc, i) => acc + Number(i.value || 0),
    0
  );

  const totalDaily = data.dailyExpenses.reduce(
    (acc, i) => acc + Number(i.value || 0),
    0
  );

  const totalCardUsage = totalInstallments + totalDaily;

  const maxByIncome =
    data.income - data.investment - totalFixed;

  const realMaxAllowed =
    Math.min(maxByIncome, data.cardLimit);

  const remainingAvailable =
    realMaxAllowed - totalCardUsage;

  function gerarResumo() {
    const sobraReal =
      data.income -
      data.investment -
      totalFixed -
      totalInstallments -
      totalDaily;

    const alerta =
      sobraReal < 0
        ? `

        🚨 ALERTA FINANCEIRO

        Você está gastando ${format(Math.abs(sobraReal))} a mais do que deveria.

        Reveja seus gastos imediatamente.
        `
        : "";

    return `
        📊 Resumo

        Renda: ${format(data.income)}
        Gastos totais: ${format(totalFixed + totalInstallments + totalDaily)}
        Sobra: ${format(sobraReal)}
        ${alerta}
        `;
  }

  function diagnostico() {
    return `
💳 Diagnóstico

Valor utilizável real: ${format(realMaxAllowed)}
Uso atual no cartão: ${format(totalCardUsage)}

${remainingAvailable < 0
        ? `⚠️ Excedente: ${format(Math.abs(remainingAvailable))}`
        : `✅ Ainda pode usar: ${format(remainingAvailable)}`
      }
`;
  }

  // ==========================
  // UI
  // ==========================

  return (
    <div className="min-h-screen flex flex-col 
    bg-gradient-to-br 
    from-slate-100 via-white to-slate-200
    dark:from-slate-950 dark:via-slate-900 dark:to-black
    text-slate-900 dark:text-white">

      {/* HEADER */}
      <div className="sticky top-0 z-20 
      backdrop-blur-xl bg-white/40 dark:bg-white/5 
      border-b border-black/5 dark:border-white/10">

        <div className="max-w-md mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            ←
          </button>

          <div>
            <h2 className="font-semibold tracking-tight">
              Assistente Financeiro
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Controle inteligente do seu cartão
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto">

        <div className="max-w-md mx-auto px-5 py-6 space-y-6">

          {/* Mensagens */}
          {messages.map((m, i) => {
            const isAlert = m.content.includes("ALERTA FINANCEIRO");

            return (
              <div
                key={i}
                className={`p-4 rounded-2xl backdrop-blur-xl whitespace-pre-line text-sm shadow-lg
      ${isAlert
                    ? "bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400"
                    : "bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                  }`}
              >
                {m.content}
              </div>
            );
          })}


          {/* Botões */}
          <div className="space-y-3">

            <button
              onClick={() =>
                setMessages(prev => [...prev, { role: "assistant", content: gerarResumo() }])
              }
              className="w-full py-3 rounded-2xl font-medium
              bg-gradient-to-r from-blue-600 to-indigo-600
              text-white shadow-lg hover:scale-[1.02] transition"
            >
              📊 Ver Resumo
            </button>

            <button
              onClick={() =>
                setMessages(prev => [...prev, { role: "assistant", content: diagnostico() }])
              }
              className="w-full py-3 rounded-2xl font-medium
              bg-gradient-to-r from-violet-600 to-purple-600
              text-white shadow-lg hover:scale-[1.02] transition"
            >
              💳 Diagnóstico
            </button>

            <button
              onClick={() => setShowAddExpense(!showAddExpense)}
              className="w-full py-3 rounded-2xl font-medium
              bg-gradient-to-r from-emerald-500 to-teal-500
              text-white shadow-lg hover:scale-[1.02] transition"
            >
              ➕ Adicionar Gasto no Cartão
            </button>
          </div>

          {/* Formulário */}
          {showAddExpense && (
            <div className="p-4 rounded-2xl 
            backdrop-blur-xl
            bg-white/60 dark:bg-white/5
            border border-black/5 dark:border-white/10
            space-y-3">

              <input
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl 
                bg-white dark:bg-slate-800
                border border-black/5 dark:border-white/10"
              />

              <input
                type="number"
                placeholder="Valor"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 rounded-xl 
                bg-white dark:bg-slate-800
                border border-black/5 dark:border-white/10"
              />

              <button
                onClick={handleAddOrEditExpense}
                className="w-full py-3 rounded-xl 
                bg-emerald-500 hover:bg-emerald-600 
                text-white font-medium transition"
              >
                {editingId ? "Salvar Alteração" : "Confirmar Gasto"}
              </button>
            </div>
          )}

          {/* Histórico */}
          <div className="space-y-3">

            <h3 className="text-sm font-semibold text-slate-500 dark:text-white/60">
              Histórico do Cartão
            </h3>

            {data.dailyExpenses.length === 0 && (
              <p className="text-sm text-slate-400">
                Nenhum gasto registrado.
              </p>
            )}

            {data.dailyExpenses.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl 
                backdrop-blur-xl
                bg-white/60 dark:bg-white/5
                border border-black/5 dark:border-white/10
                flex justify-between items-center shadow"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-white/50">
                    {format(item.value)}
                  </p>
                </div>

                <div className="flex gap-3 text-lg">
                  <button onClick={() => handleEdit(item)}>✏️</button>
                  <button onClick={() => handleRemove(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div ref={scrollRef} />

        </div>
      </div>
    </div>
  );
}

export default ChatAssistant;
