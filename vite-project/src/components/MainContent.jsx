import { useBienes } from '../context/BieneContext'
import Dashboard from './Dashboard'
import SolicitudesPendientes from './SolicitudesPendientes'
import Historial from './Historial'
import Inventario from './Inventario'
import BienesAsignados from './BienesAsignados'
import MovimientosBienes from './MovimientosBienes'

const MainContent = () => {
  const { activeView, userRole } = useBienes()

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return { title: 'Panel de Control', icon: '🏠', description: 'Resumen general del sistema de gestión de bienes' }
      case 'pendientes':
        return { title: 'Solicitudes Pendientes', icon: '📋', description: 'Aprobar o rechazar solicitudes de bienes' }
      case 'inventario':
        return { title: 'Inventario de Bienes', icon: '📦', description: 'Gestionar bienes disponibles para asignación' }
      case 'asignados':
        return { title: 'Bienes Asignados', icon: '📤', description: 'Controlar bienes actualmente prestados' }
      case 'historial':
        return { title: 'Historial de Solicitudes', icon: '📚', description: 'Consultar solicitudes procesadas anteriormente' }
      case 'movimientos':
        return { title: 'Movimientos de Bienes', icon: '🔄', description: 'Registro de asignaciones y devoluciones' }
      default:
        return { title: 'Panel de Control', icon: '🏠', description: 'Resumen general del sistema de gestión de bienes' }
    }
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'pendientes':
        return <SolicitudesPendientes />
      case 'inventario':
        return <Inventario />
      case 'asignados':
        return <BienesAsignados />
      case 'historial':
        return <Historial />
      case 'movimientos':
        return <MovimientosBienes />
      default:
        return <Dashboard />
    }
  }

  const viewInfo = getViewTitle()

  return (
    <main className="main-content">
      <div className="content-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">🏠 Inicio</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">
            {viewInfo.icon} {viewInfo.title}
          </span>
        </div>
        <div className="view-info">
          <h1 className="view-title">
            <span className="title-icon">{viewInfo.icon}</span>
            {viewInfo.title}
          </h1>
          <p className="view-description">{viewInfo.description}</p>
        </div>
      </div>
      
      <div className="content-body">
        {renderView()}
      </div>
    </main>
  )
}

export default MainContent