import { useState } from "react"
import { supabase } from "../lib/supabase"

function ChangePassword() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleChangePassword() {
    if (password.length < 6) {
      alert("Senha precisa ter no mínimo 6 caracteres")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    setLoading(false)

    if (error) {
      alert("Erro ao trocar senha")
      console.error(error)
    } else {
      alert("Senha alterada com sucesso ✅")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">

        <h2 className="text-lg font-semibold">
          🔐 Alterar Senha
        </h2>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl border bg-slate-100 dark:bg-slate-800"
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>

      </div>
    </div>
  )
}

export default ChangePassword
