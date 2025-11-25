import { useState } from 'react'

const InspectionModal = ({ solicitud, isOpen, onClose }) => {
  if (!isOpen || !solicitud) return null

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'Importante':
        return 'priority-importante'
      case 'Media':
        return 'priority-media'
      case 'Leve':
        return 'priority-leve'
      default:
        return 'priority-media'
    }
  }

  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case 'Importante':
        return '🔴'
      case 'Media':
        return '🟡'
      case 'Leve':
        return '🟢'
      default:
        return '🟡'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔍 Inspección de Solicitud #{solicitud.id}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="inspection-grid">
            <div className="inspection-item">
              <span className="inspection-label">👤 Solicitante:</span>
              <span className="inspection-value">{solicitud.solicitante}</span>
            </div>
            
            <div className="inspection-item">
              <span className="inspection-label">📅 Fecha de Solicitud:</span>
              <span className="inspection-value">{solicitud.fecha}</span>
            </div>
            
            <div className="inspection-item">
              <span className="inspection-label">📦 Bien Solicitado:</span>
              <span className="inspection-value">{solicitud.bien}</span>
            </div>
            
            <div className="inspection-item">
              <span className="inspection-label">🔢 Cantidad:</span>
              <span className="inspection-value">{solicitud.cantidad}</span>
            </div>
            
            <div className="inspection-item full-width">
              <span className="inspection-label">📝 Motivo:</span>
              <span className="inspection-value">{solicitud.motivo}</span>
            </div>
            
            <div className="inspection-item">
              <span className="inspection-label">⚡ Prioridad:</span>
              <span className={`inspection-value priority-badge ${getPriorityColor(solicitud.prioridad)}`}>
                {getPriorityIcon(solicitud.prioridad)} {solicitud.prioridad}
              </span>
            </div>
          </div>
          
          <div className="approval-status">
            <h4>📋 Estado de Aprobaciones</h4>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-role">Cuentadante:</span>
                <span className={`status-badge status-${solicitud.estados.cuentadante.toLowerCase()}`}>
                  {solicitud.estados.cuentadante}
                </span>
              </div>
              <div className="status-item">
                <span className="status-role">Gerente:</span>
                <span className={`status-badge status-${solicitud.estados.gerente.toLowerCase()}`}>
                  {solicitud.estados.gerente}
                </span>
              </div>
              <div className="status-item">
                <span className="status-role">Administrador:</span>
                <span className={`status-badge status-${solicitud.estados.administrador.toLowerCase()}`}>
                  {solicitud.estados.administrador}
                </span>
              </div>
              <div className="status-item">
                <span className="status-role">Celador:</span>
                <span className={`status-badge status-${solicitud.estados.celador.toLowerCase()}`}>
                  {solicitud.estados.celador}
                </span>
              </div>
            </div>
            
            {solicitud.motivoRechazo && (
              <div className="rejection-info">
                <h4>❌ Motivo de Rechazo</h4>
                <div className="rejection-details">
                  <p><strong>Rechazado por:</strong> {solicitud.rolQueRechazo}</p>
                  <p><strong>Motivo:</strong></p>
                  <div className="rejection-reason">
                    {solicitud.motivoRechazo}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default InspectionModal