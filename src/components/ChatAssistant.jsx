import { useState, useRef, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

function ChatAssistant({ onClose }) {
  const { data, setData } = useFinance();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! Sou seu assistente inteligente. Pode me contar seus gastos ou pedir um resumo da sua conta." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    // Cálculos de contexto para a IA
    const totalFixed = data.fixedExpenses.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
    const totalInstallments = data.installments.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
    const totalDaily = data.dailyExpenses.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
    const sobraAtual = data.income - data.investment - totalFixed - totalInstallments - totalDaily;

    const promptContext = `Você é um assistente financeiro. 
      Dados atuais: Renda R$${data.income}, Gastos Totais R$${totalFixed + totalInstallments + totalDaily}, Sobra R$${sobraAtual}.
      Regras: 
      1. Ignore erros de digitação (ex: "reaias"). 
      2. Responda de forma muito curta e amigável. 
      3. Se o usuário informar um gasto, termine a frase OBRIGATORIAMENTE com a tag [GASTO:valor].`;

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      // SOLUÇÃO DO 404: v1beta + gemini-1.5-flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${promptContext}\n\nUsuário: ${userMsg}` }]
          }]
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Erro detalhado:", result);
        throw new Error(result.error?.message || "Erro na API");
      }

      const responseText = result.candidates[0].content.parts[0].text;

      // Lógica de Extração de Gasto via IA
      const gastoMatch = responseText.match(/\[GASTO:(\d+\.?\d*)\]/);
      if (gastoMatch) {
        const valorGasto = parseFloat(gastoMatch[1]);
        setData(prev => ({
          ...prev,
          dailyExpenses: [
            ...prev.dailyExpenses,
            { id: Date.now(), value: valorGasto, name: `IA: ${userMsg.substring(0, 10)}` }
          ]
        }));
      }

      const cleanText = responseText.replace(/\[GASTO:.*?\]/g, "").trim();
      setMessages(prev => [...prev, { role: "assistant", content: cleanText }]);

    } catch (err) {
      console.error("Falha na conexão:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Ops, tive um problema ao processar. Verifique sua conexão e a nova chave API." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-black flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
        <button onClick={onClose} className="text-2xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          ←
        </button>
        <div className="flex flex-col">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Assistente IA</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-500 font-medium">Inteligência Ativa</span>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-black/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              m.role === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border dark:border-slate-700 rounded-tl-none"
            }`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-1.5 p-2 ml-2">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 pb-10">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Gastei 30 reaias..."
            className="flex-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAssistant;