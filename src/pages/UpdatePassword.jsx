import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function UpdatePassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)

  const navigate = useNavigate()

  // Verifica se usuário veio do link de recuperação
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setValidSession(true)
        }
      }
    )

    return () => data.subscription.unsubscribe()
  }, [])

  async function handleUpdatePassword() {
    if (!password || password.length < 6) {
      alert("Senha precisa ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirm) {
      alert("As senhas não coincidem")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    setLoading(false)

    if (error) {
      alert("Erro ao atualizar senha")
      console.error(error)
    } else {
      alert("Senha atualizada com sucesso 🎉")
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6">

        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          🔐 Redefinir senha
        </h1>

        {!validSession ? (
          <p className="text-sm text-slate-500">
            Verificando sessão...
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            />

            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              {loading ? "Atualizando..." : "Atualizar senha"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default UpdatePassword
