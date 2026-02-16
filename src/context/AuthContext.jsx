import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Erro ao pegar sessão:", error)
      }

      const sessionUser = data?.session?.user ?? null
      setUser(sessionUser)
      setLoading(false) // 🔥 libera aqui SEM depender de profile

      if (sessionUser) {
        loadProfile(sessionUser.id)
      }
    }

    getInitialSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)

        if (sessionUser) {
          loadProfile(sessionUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (error) {
        console.error("Erro ao carregar perfil:", error)
        return
      }

      setProfile(data)
    } catch (err) {
      console.error("Erro inesperado profile:", err)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
