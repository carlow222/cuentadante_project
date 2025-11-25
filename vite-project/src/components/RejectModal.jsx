import { useState } from 'react'

const RejectModal = ({ solicitud, isOpen, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('')

  if (!isOpen || !solicitud) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (motivo.trim()) {
      onConfirm(solicitud.id, motivo.trim())
      setMotivo('')
      onClose()
    }
  }

  const handleClose = () => {
    setMotivo('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content reject-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header reject-header">
          <h3>❌ Rechazar Solicitud #{solicitud.id}</h3>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="reject-info">
            <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
            <p><strong>Bien:</strong> {solicitud.bien} (x{solicitud.cantidad})</p>
          </div>
          
          <form onSubmit={handleSubmit} className="reject-form">
            <div className="form-group">
              <label htmlFor="motivo-rechazo" className="form-label">
                📝 Motivo del rechazo *
              </label>
              <textarea
                id="motivo-rechazo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="form-textarea"
                placeholder="Explique el motivo por el cual rechaza esta solicitud..."
                rows="4"
                required
              />
              <small className="form-help">
                Este motivo será visible para todos los roles con permisos de aprobación.
              </small>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-reject"
                disabled={!motivo.trim()}
              >
                Confirmar Rechazo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RejectModal