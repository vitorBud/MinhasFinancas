import { supabase } from "../lib/supabase"

function TopBar({ onReset, darkMode, setDarkMode }) {

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">

      <div
        className="
          w-full
          max-w-md
          backdrop-blur-xl
          bg-white/70 dark:bg-slate-900/70
          border border-slate-200 dark:border-slate-700
          shadow-lg dark:shadow-black/40
          rounded-2xl
          px-6 py-4
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

          {/* Toggle Theme - Estilo Switch */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="
              relative
              w-11 h-6
              bg-slate-300 dark:bg-slate-600
              rounded-full
              transition-colors duration-300
              focus:outline-none
            "
          >
            <span
              className={`
                absolute
                top-1
                left-1
                w-4 h-4
                bg-white
                rounded-full
                shadow
                transition-transform duration-300
                ${darkMode ? "translate-x-5" : ""}
              `}
            />
          </button>

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
