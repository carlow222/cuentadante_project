import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Llamar callback de login exitoso con opción de recordar
        onLogin(data.user, data.token, rememberMe)
      } else {
        setError(data.error || 'Credenciales inválidas')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error de conexión. Verifique que el servidor esté funcionando.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'cuentadante@sistema.edu.co',
      password: 'cuentadante_1'
    })
    setRememberMe(false) // Por defecto no recordar en demo
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <img 
                src="/logo.png" 
                alt="Logo SENA" 
                className="sena-logo"
              />
            </div>
            <div className="logo-text">
              <h1>Sistema de Bienes</h1>
              <p>SENA - Cuentadante</p>
            </div>
          </div>
        </div>

        <div className="login-body">
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">Acceso exclusivo para Cuentadantes</p>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="ejemplo@sena.edu.co"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese su contraseña"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                  disabled={loading}
                />
                <span className="remember-me-text">
                  🔐 Recordar mi sesión
                </span>
              </label>
              <p className="remember-me-help">
                Si activas esta opción, no tendrás que iniciar sesión cada vez que abras la aplicación.
              </p>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  🚀 Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-demo">
            <p className="demo-text">¿Necesitas acceso de prueba?</p>
            <button 
              type="button"
              onClick={handleDemoLogin}
              className="demo-button"
              disabled={loading}
            >
              💡 Usar credenciales de demo
            </button>
          </div>
        </div>

        <div className="login-footer">
          <div className="system-info">
            <p>🔐 Acceso seguro al sistema de gestión de bienes</p>
            <p>📞 Soporte técnico: ext. 1234</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login