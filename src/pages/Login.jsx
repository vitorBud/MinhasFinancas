import { useState } from "react"
import { supabase } from "../lib/supabase"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) setError(error.message)
      else setMessage("Conta criada! Verifique seu email.")
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) setError(error.message)
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Digite seu email primeiro.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    })

    if (error) setError(error.message)
    else setMessage("Email de recuperação enviado!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black transition-colors duration-300 px-4">

      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-black/40 rounded-2xl p-8 space-y-6">

        <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-100">
          {isRegistering ? "Criar Conta" : "Entrar"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium active:scale-95 transition-all duration-200"
          >
            {isRegistering ? "Criar Conta" : "Entrar"}
          </button>

        </form>

        <div className="text-sm text-center space-y-2">

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:underline "
          >
            {isRegistering
              ? "Já tem conta? Entrar"
              : "Não tem conta? Criar"}
          </button>

          {!isRegistering && (
            <button
              onClick={handleForgotPassword}
              className="block text-slate-500 dark:text-slate-400 hover:underline mx-auto"
            >
              Esqueci minha senha
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

const inputStyle = `
  w-full
  px-4 py-3
  rounded-xl
  bg-slate-100
  dark:bg-slate-800
  border border-slate-300
  dark:border-slate-600
  text-slate-800
  dark:text-slate-100
  placeholder:text-slate-400
  dark:placeholder:text-slate-500
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  transition-all duration-200
`

export default Login
