import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import UpdatePassword from "./pages/UpdatePassword"
import { AuthProvider } from "./context/AuthContext"
import { FinanceProvider } from "./context/FinanceContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
