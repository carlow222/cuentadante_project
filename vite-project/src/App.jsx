import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Login from './components/Login'
import Header from './components/Header'
import Loading from './components/Loading'
import { BieneProvider } from './context/BieneContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Componente interno que usa el contexto de autenticación
function AppContent() {
  const { user, loading, login, isAuthenticated } = useAuth()

  if (loading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (!isAuthenticated()) {
    return <Login onLogin={login} />
  }

  return (
    <BieneProvider>
      <div className="app-with-header">
        <Header />
        <div className="app-body">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </BieneProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
