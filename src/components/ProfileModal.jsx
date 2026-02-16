import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import { useState } from "react"

function ProfileModal({ onClose }) {
  const { user, profile, setProfile } = useAuth()

  const [name, setName] = useState(profile?.full_name || "")
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: name
      })

    if (!error) {
      setProfile({ ...profile, full_name: name })
    }

    setLoading(false)
  }

  async function handleChangePassword() {
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + "/reset"
    })

    alert("Email de redefinição enviado.")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm space-y-4">

        <h2 className="font-semibold text-lg">Perfil</h2>

        <div>
          <label>Email</label>
          <input
            value={user.email}
            disabled
            className="w-full p-2 rounded bg-slate-100"
          />
        </div>

        <div>
          <label>Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-slate-100"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Salvar
        </button>

        <button
          onClick={handleChangePassword}
          className="w-full bg-yellow-500 text-white py-2 rounded"
        >
          Trocar Senha
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Sair
        </button>

        <button
          onClick={onClose}
          className="w-full border py-2 rounded"
        >
          Fechar
        </button>

      </div>
    </div>
  )
}

export default ProfileModal
