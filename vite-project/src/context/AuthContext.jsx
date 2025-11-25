import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    // Solo verificar sesión guardada si el usuario eligió "recordar sesión"
    const rememberSession = localStorage.getItem('remember_session')
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')

    if (rememberSession === 'true' && savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setToken(savedToken)
        
        // Verificar que el token siga siendo válido
        verifyToken(savedToken)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        logout()
      }
    } else {
      // Si no hay "recordar sesión", limpiar datos guardados
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('remember_session')
    }
    
    setLoading(false)
  }, [])

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      })

      if (!response.ok) {
        logout()
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      logout()
    }
  }

  const login = (userData, userToken, rememberMe = false) => {
    setUser(userData)
    setToken(userToken)
    
    if (rememberMe) {
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
      localStorage.setItem('remember_session', 'true')
    } else {
      // Solo guardar en sessionStorage para la sesión actual
      sessionStorage.setItem('auth_token', userToken)
      sessionStorage.setItem('user_data', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    // Limpiar tanto localStorage como sessionStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('remember_session')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user_data')
  }

  const isAuthenticated = () => {
    return user !== null && token !== null
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}