import { useBienes } from '../context/BieneContext'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { activeView, setActiveView } = useBienes()
  const { user } = useAuth()

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Panel de Control', 
      icon: '🏠',
      description: 'Resumen del sistema'
    },
    { 
      id: 'pendientes', 
      label: 'Solicitudes Pendientes', 
      icon: '📋',
      description: 'Aprobar o rechazar solicitudes'
    },
    { 
      id: 'inventario', 
      label: 'Inventario de Bienes', 
      icon: '📦',
      description: 'Gestionar bienes disponibles'
    },
    { 
      id: 'asignados', 
      label: 'Bienes Asignados', 
      icon: '📤',
      description: 'Controlar bienes prestados'
    },
    { 
      id: 'historial', 
      label: 'Historial de Solicitudes', 
      icon: '📚',
      description: 'Ver solicitudes procesadas'
    },
    { 
      id: 'movimientos', 
      label: 'Movimientos de Bienes', 
      icon: '🔄',
      description: 'Registro de asignaciones y devoluciones'
    }
  ]

  // Solo rol de Cuentadante
  const currentRole = { value: 'cuentadante', label: '📊 Cuentadante SENA', color: '#16a34a' }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <img 
              src="https://res.cloudinary.com/dcvlxzwsn/image/upload/v1764082209/th_g3frew.webp" 
              alt="Logo SENA" 
              className="sena-logo-sidebar"
            />
          </div>
          <div className="logo-text">
            <h2>Sistema de Bienes</h2>
            <p>SENA - Cuentadante</p>
          </div>
        </div>
      </div>
      
      <div className="role-selector">
        <label>
          <span className="role-icon">👤</span>
          Usuario Autenticado:
        </label>
        <div className="user-card">
          <div className="user-avatar-sidebar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-sidebar">
            <div className="user-name-sidebar">{user?.name}</div>
            <div className="user-email-sidebar">{user?.email}</div>
          </div>
        </div>
        <div className="role-display" style={{ borderColor: currentRole.color }}>
          <span className="role-badge" style={{ backgroundColor: currentRole.color }}>
            {currentRole.label}
          </span>
        </div>
        <div className="role-description">
          <p>Gestión y control de bienes institucionales</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Funciones del Cuentadante</h3>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
              {activeView === item.id && <span className="nav-indicator">▶</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="system-info">
          <div className="info-item">
            <span className="info-icon">🕒</span>
            <span className="info-text">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💻</span>
            <span className="info-text">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar