import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import LoadingScreen from "./components/LoadingScreen"
import Login from "./pages/Login"
import UpdatePassword from "./pages/UpdatePassword"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import SimpleCalculator from "./pages/SimpleCalculator"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Login />

  return children
}

function App() {
  return (
    <Routes>

      <Route path="/update-password" element={<UpdatePassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calculo-simplificado"
        element={
          <ProtectedRoute>
            <SimpleCalculator />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App