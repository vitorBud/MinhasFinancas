import { useState } from "react"
import { supabase } from "../lib/supabase"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) setError(error.message)
  }

  async function handleRegister(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f7]">
      <form className="bg-white p-6 rounded-2xl shadow space-y-4 w-80">

        <h2 className="text-lg font-semibold text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Entrar
        </button>

        <button
          onClick={handleRegister}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          Criar Conta
        </button>

      </form>
    </div>
  )
}

export default Login
