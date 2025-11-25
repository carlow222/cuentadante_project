import { useState, useEffect } from 'react'
import Loading from './Loading'

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedSolicitud, setSelectedSolicitud] = useState(null)
  const [modalType, setModalType] = useState('') // 'approve' o 'reject'
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/requests')
      const data = await response.json()
      setSolicitudes(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedSolicitud) return

    try {
      const response = await fetch(`http://localhost:3000/api/requests/${selectedSolicitud.id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved_by: 'Cuentadante SENA',
          notes: notes
        }),
      })

      if (response.ok) {
        alert('Solicitud aprobada exitosamente')
        setShowModal(false)
        setSelectedSolicitud(null)
        setNotes('')
        fetchSolicitudes()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Error al aprobar la solicitud')
    }
  }

  const handleReject = async () => {
    if (!selectedSolicitud || !rejectionReason.trim()) {
      alert('Debe proporcionar un motivo de rechazo')
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/requests/${selectedSolicitud.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejected_by: 'Cuentadante SENA',
          rejection_reason: rejectionReason
        }),
      })

      if (response.ok) {
        alert('Solicitud rechazada exitosamente')
        setShowModal(false)
        setSelectedSolicitud(null)
        setRejectionReason('')
        fetchSolicitudes()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Error al rechazar la solicitud')
    }
  }

  const openModal = (solicitud, type) => {
    setSelectedSolicitud(solicitud)
    setModalType(type)
    setShowModal(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
      case 'Importante':
        return 'priority-urgente'
      case 'Media':
        return 'priority-media'
      case 'Leve':
        return 'priority-leve'
      default:
        return 'priority-media'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Alta':
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

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    if (solicitud.status !== 'Pendiente') return false
    
    const matchesName = solicitud.applicant_name.toLowerCase().includes(filter.toLowerCase())
    const matchesAsset = solicitud.asset_name?.toLowerCase().includes(filter.toLowerCase())
    const matchesSerial = solicitud.asset_serial?.toLowerCase().includes(filter.toLowerCase())
    return matchesName || matchesAsset || matchesSerial
  })

  if (loading) {
    return <Loading message="Cargando solicitudes pendientes..." />
  }

  return (
    <div className="view-container">
      <div className="mb-6">
        {/* Estadísticas */}
        <div className="stats mb-6">
          <div className="stat-badge stat-total">
            📋 Total Pendientes: {filteredSolicitudes.length}
          </div>
          <div className="stat-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            🔴 Alta Prioridad: {filteredSolicitudes.filter(s => s.priority === 'Alta' || s.priority === 'Importante').length}
          </div>
          <div className="stat-badge stat-borrowed">
            🟡 Media Prioridad: {filteredSolicitudes.filter(s => s.priority === 'Media').length}
          </div>
          <div className="stat-badge stat-available">
            🟢 Baja Prioridad: {filteredSolicitudes.filter(s => s.priority === 'Leve').length}
          </div>
        </div>
        
        {/* Filtro */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por solicitante, bien o número de serie..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredSolicitudes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">📝</span>
            <h3>No hay solicitudes pendientes</h3>
            <p>Todas las solicitudes han sido procesadas o no coinciden con el filtro</p>
          </div>
        </div>
      ) : (
        <div className="approval-cards-container">
          {filteredSolicitudes.map(solicitud => (
            <div key={solicitud.id} className="approval-card">
              <div className="card-header">
                <div className="card-id">
                  <span className="id-badge">#{solicitud.id}</span>
                  <span className={`priority-indicator ${getPriorityColor(solicitud.priority)}`}>
                    {getPriorityIcon(solicitud.priority)} {solicitud.priority}
                  </span>
                </div>
                <div className="card-date">
                  📅 {new Date(solicitud.request_date).toLocaleDateString()}
                </div>
              </div>

              <div className="card-body">
                <div className="solicitud-info">
                  <h4>👤 {solicitud.applicant_name}</h4>
                  {solicitud.applicant_position && (
                    <p className="text-sm text-gray-600">🏢 {solicitud.applicant_position}</p>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg mt-3 mb-3">
                    <div className="flex items-center gap-4 text-gray-700 mb-2">
                      <span className="font-medium">📦 {solicitud.asset_name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        S/N: {solicitud.asset_serial}
                      </span>
                      <span>🏷️ {solicitud.asset_brand} {solicitud.asset_model}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">📝 Motivo:</span> {solicitud.reason}
                  </div>
                  
                  {solicitud.expected_return_date && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">📅 Devolución esperada:</span> {new Date(solicitud.expected_return_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => openModal(solicitud, 'approve')}
                  className="btn-approve"
                >
                  ✅ Aprobar
                </button>
                <button
                  onClick={() => openModal(solicitud, 'reject')}
                  className="btn-reject"
                >
                  ❌ Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Aprobación/Rechazo */}
      {showModal && selectedSolicitud && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className={`modal-header ${modalType === 'approve' ? '' : 'reject-header'}`}>
              <h3>
                {modalType === 'approve' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Información de la solicitud:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Solicitante:</span>
                    <span className="ml-2 text-blue-700">{selectedSolicitud.applicant_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Cargo:</span>
                    <span className="ml-2 text-blue-700">{selectedSolicitud.applicant_position || 'No especificado'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Bien:</span>
                    <span className="ml-2 text-blue-700">{selectedSolicitud.asset_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Serie:</span>
                    <span className="ml-2 text-blue-700 font-mono">{selectedSolicitud.asset_serial}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-blue-800">Motivo:</span>
                    <span className="ml-2 text-blue-700">{selectedSolicitud.reason}</span>
                  </div>
                </div>
              </div>

              {modalType === 'approve' ? (
                <div className="form-group">
                  <label className="form-label">
                    📝 Observaciones de aprobación (opcional):
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-textarea"
                    placeholder="Ingrese observaciones adicionales sobre la aprobación..."
                    rows="3"
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">
                    📝 Motivo del rechazo (obligatorio):
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="form-textarea"
                    placeholder="Explique detalladamente por qué se rechaza esta solicitud..."
                    rows="4"
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <div className="flex gap-3">
                <button 
                  onClick={modalType === 'approve' ? handleApprove : handleReject}
                  className={`btn ${modalType === 'approve' ? 'btn-primary' : 'btn-reject'}`}
                  disabled={modalType === 'reject' && !rejectionReason.trim()}
                >
                  {modalType === 'approve' ? '✅ Confirmar Aprobación' : '❌ Confirmar Rechazo'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  🚫 Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SolicitudesPendientes