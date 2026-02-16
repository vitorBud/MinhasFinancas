import { supabase } from "../lib/supabase"

function TopBar({
  onReset,
  darkMode,
  setDarkMode,
  onOpenAssistant
}) {

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="fixed top-3 left-5 right-5 z-40 flex justify-center">

      <div
        className="
          w-full max-w-md
          backdrop-blur-xl
          bg-white/70 dark:bg-slate-900/70
          border border-slate-200 dark:border-slate-700
          shadow-lg dark:shadow-black/40
          rounded-2xl
          px-4 py-3
          flex justify-between items-center
          transition-colors duration-300
        "
      >

        {/* Title */}
        <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
          Minhas Finanças
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* 🤖 Assistente */}
          <button
            onClick={onOpenAssistant}
            className="
              text-lg
              hover:scale-110
              active:scale-95
              transition-transform
            "
          >
            🤖
          </button>

          {/* Dark Mode Toggle */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
              hover:text-slate-800
              dark:hover:text-slate-100
              transition-colors
            "
          >
            {darkMode ? "🌙" : "☀️"}
          </button> */}

          {/* Reset */}
          <button
            onClick={onReset}
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
              hover:text-slate-800
              dark:hover:text-slate-100
              transition-colors
            "
          >
            Reset
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              text-sm
              text-red-500
              hover:text-red-600
              dark:hover:text-red-400
              transition-colors
            "
          >
            Sair
          </button>

        </div>

      </div>
    </div>
  )
}

export default TopBar
