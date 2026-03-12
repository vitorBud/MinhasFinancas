import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="
      min-h-screen
      bg-slate-100 dark:bg-black
      flex flex-col items-center justify-center
      px-6
      transition-colors duration-300
    ">

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-10 text-center">
        Bem-vindo ao seu controle financeiro
      </h1>

      <div className="grid gap-6 w-full max-w-4xl sm:grid-cols-2">

        {/* FINANÇAS COMPLETO */}
        <div className="
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          rounded-3xl
          p-8
          shadow-lg dark:shadow-black/40
          hover:scale-[1.02]
          transition-all duration-300
          cursor-pointer
        "
          onClick={() => navigate("/dashboard")}
        >

          <div className="text-4xl mb-4">📊</div>

          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
            Finanças Completo
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Controle detalhado por mês, diagnóstico do cartão, parcelas,
            investimentos e visão completa da sua saúde financeira.
          </p>

          <button className="
            w-full py-2 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            transition
          ">
            Entrar
          </button>

        </div>

        {/* CÁLCULO SIMPLIFICADO */}
        <div className="
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          rounded-3xl
          p-8
          shadow-lg dark:shadow-black/40
          hover:scale-[1.02]
          transition-all duration-300
          cursor-pointer
        "
          onClick={() => navigate("/calculo-simplificado")}
        >

          <div className="text-4xl mb-4">⚡</div>

          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
            Cálculo Simplificado
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Descubra rapidamente até quanto pode gastar sem comprometer
            sua renda ou estourar o limite do cartão.
          </p>

          <button className="
            w-full py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-medium
            transition
          ">
            Simular agora
          </button>

        </div>

      </div>

    </div>
  )
}

export default Home