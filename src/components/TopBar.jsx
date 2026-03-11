import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

function TopBar({
  onReset,
  darkMode,
  setDarkMode,
  onOpenAssistant
}) {
  const { user, profile, logout } = useAuth()

  const [openMenu, setOpenMenu] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(profile?.full_name || "")
  const [loading, setLoading] = useState(false)

  const menuRef = useRef(null)
  const fileInputRef = useRef(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // =============================
  // Atualizar Nome
  // =============================
  async function handleUpdateName() {
    if (!newName.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", user.id)

    setLoading(false)

    if (error) {
      alert("Erro ao atualizar nome")
      console.error(error)
    } else {
      setEditingName(false)
      window.location.reload()
    }
  }

  // =============================
  // Upload Foto
  // =============================
  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}.${fileExt}`

    setLoading(true)

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert("Erro ao enviar foto")
      console.error(uploadError)
      setLoading(false)
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id)

    setLoading(false)
    window.location.reload()
  }

  // =============================
  // Reset senha
  // =============================
  async function handleResetPassword() {
    if (!user?.email) return

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + "/update-password"
    })

    setLoading(false)

    if (error) {
      alert("Erro ao enviar email de redefinição")
      console.error(error)
    } else {
      alert("Email de redefinição enviado 📩")
    }
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U"

  return (
    <div className="fixed top-3 left-5 right-5 z-40 flex justify-center">
      <div
        className="
          w-full max-w-md
          backdrop-blur-xl
          bg-white/70 dark:bg-slate-900/70
          border border-slate-200 dark:border-slate-700
          shadow-xl dark:shadow-black/40
          rounded-2xl
          px-5 py-3
          flex justify-between items-center
        "
      >
        <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
          Minhas Finanças
        </h1>

        <div className="flex items-center gap-3">

          {/* Assistente */}
          <button
            onClick={onOpenAssistant}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition"
          >
            🤖
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Reset
          </button>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-9 h-9 rounded-full overflow-hidden shadow-md hover:scale-105 transition"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
              )}
            </button>

            {openMenu && (
              <div className="
    absolute right-0 mt-3 w-80
    backdrop-blur-xl
    bg-white/80 dark:bg-slate-900/80
    border border-slate-200 dark:border-slate-700
    shadow-2xl dark:shadow-black/40
    rounded-2xl
    p-5
    space-y-5
    transition-all duration-200
  ">

                {/* PERFIL */}
                <div className="space-y-3">

                  {editingName ? (
                    <div className="space-y-2">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="
              w-full px-3 py-2 rounded-xl
              bg-slate-100 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-sm text-slate-800 dark:text-white
              focus:outline-none
            "
                      />
                      <button
                        onClick={handleUpdateName}
                        className="
              w-full py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white text-sm font-medium
              transition
            "
                      >
                        Salvar nome
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {profile?.full_name || "Usuário"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </p>
                      </div>

                      <button
                        onClick={() => setEditingName(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-500 transition"
                      >
                        Editar nome
                      </button>
                    </>
                  )}

                </div>

                <div className="border-t border-slate-200 dark:border-slate-700" />

                {/* AÇÕES */}
                <div className="space-y-2 text-sm">

                  <MenuItem
                    onClick={() => fileInputRef.current.click()}
                    label="🖼 Alterar foto"
                  />

                  <MenuItem
                    onClick={() => setDarkMode(!darkMode)}
                    label={darkMode ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
                  />

                  <MenuItem
                    onClick={handleResetPassword}
                    label="🔐 Trocar senha"
                  />

                </div>

                <div className="border-t border-slate-200 dark:border-slate-700" />

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="
        w-full py-2 rounded-xl
        bg-red-500/10 hover:bg-red-500/20
        text-red-500 font-medium
        transition
      "
                >
                  Sair da conta
                </button>

                {loading && (
                  <p className="text-xs text-slate-400 text-center">
                    Processando...
                  </p>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

function MenuItem({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left px-3 py-2
        rounded-xl
        text-slate-700 dark:text-slate-300
        hover:bg-slate-100 dark:hover:bg-slate-800
        transition
      "
    >
      {label}
    </button>
  )
}

export default TopBar
