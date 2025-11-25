import { useState, useEffect } from 'react'
import Loading from './Loading'

const BienesAsignados = () => {
  const [bienesAsignados, setBienesAsignados] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedBien, setSelectedBien] = useState(null)
  const [returnNotes, setReturnNotes] = useState('')

  useEffect(() => {
    fetchBienesAsignados()
  }, [])

  const fetchBienesAsignados = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/assets')
      const data = await response.json()
      setBienesAsignados(data.filter(bien => bien.status === 'Assigned'))
    } catch (error) {
      console.error('Error fetching assigned assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async () => {
    if (!selectedBien) return

    try {
      const response = await fetch(`http://localhost:3000/api/assets/${selectedBien.id}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: returnNotes,
          returned_by: 'Cuentadante SENA'
        }),
      })

      if (response.ok) {
        alert('Bien devuelto exitosamente')
        setShowModal(false)
        setSelectedBien(null)
        setReturnNotes('')
        fetchBienesAsignados()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Error returning asset:', error)
      alert('Error al procesar la devolución')
    }
  }

  const filteredBienes = bienesAsignados.filter(bien => {
    const matchesName = bien.name.toLowerCase().includes(filter.toLowerCase())
    const matchesSerial = bien.serial_number.toLowerCase().includes(filter.toLowerCase())
    const matchesAssigned = bien.assigned_to?.toLowerCase().includes(filter.toLowerCase())
    return matchesName || matchesSerial || matchesAssigned
  })

  const getReturnStatus = (expectedDate) => {
    if (!expectedDate) return { status: 'sin-fecha', text: 'Sin fecha límite', color: 'gray' }
    
    const today = new Date()
    const returnDate = new Date(expectedDate)
    const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { status: 'vencido', text: `Vencido hace ${Math.abs(diffDays)} días`, color: 'red' }
    } else if (diffDays <= 3) {
      return { status: 'por-vencer', text: `Vence en ${diffDays} días`, color: 'yellow' }
    } else {
      return { status: 'en-tiempo', text: `${diffDays} días restantes`, color: 'green' }
    }
  }

  if (loading) {
    return <Loading message="Cargando bienes asignados..." />
  }

  return (
    <div className="view-container">
      <div className="mb-6">
        {/* Estadísticas */}
        <div className="stats mb-6">
          <div className="stat-badge stat-total">
            📤 Total Asignados: {bienesAsignados.length}
          </div>
          <div className="stat-badge stat-borrowed">
            ⏰ Por Vencer: {bienesAsignados.filter(b => {
              const status = getReturnStatus(b.expected_return_date)
              return status.status === 'por-vencer'
            }).length}
          </div>
          <div className="stat-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            🚨 Vencidos: {bienesAsignados.filter(b => {
              const status = getReturnStatus(b.expected_return_date)
              return status.status === 'vencido'
            }).length}
          </div>
        </div>
        
        {/* Filtro */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, serie o persona asignada..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Bien</th>
                <th>Número de Serie</th>
                <th>Asignado a</th>
                <th>Fecha de Asignación</th>
                <th>Fecha de Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBienes.map((bien) => {
                const returnStatus = getReturnStatus(bien.expected_return_date)
                return (
                  <tr key={bien.id} className="table-row">
                    <td>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bien.name}</div>
                        <div className="text-sm text-gray-500">{bien.category}</div>
                        <div className="text-xs text-gray-400">{bien.brand} {bien.model}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {bien.serial_number}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{bien.inventory_number}</div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{bien.assigned_to}</div>
                      <div className="text-xs text-gray-500">{bien.location}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">
                        {bien.assignment_date ? new Date(bien.assignment_date).toLocaleDateString() : 'No registrada'}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">
                        {bien.expected_return_date ? new Date(bien.expected_return_date).toLocaleDateString() : 'No definida'}
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${
                        returnStatus.status === 'vencido' ? 'status-rejected' :
                        returnStatus.status === 'por-vencer' ? 'status-pending' :
                        'status-approved'
                      }`}>
                        {returnStatus.text}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedBien(bien)
                          setShowModal(true)
                        }}
                        className="btn btn-primary"
                        title="Procesar devolución"
                      >
                        🔄 Devolver
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredBienes.length === 0 && (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">📤</span>
              <p>No hay bienes asignados que coincidan con el filtro</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredBienes.length} de {bienesAsignados.length} bienes asignados
      </div>

      {/* Modal de Devolución */}
      {showModal && selectedBien && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔄 Procesar Devolución</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Información del bien:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Bien:</span>
                    <span className="ml-2 text-blue-700">{selectedBien.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Serie:</span>
                    <span className="ml-2 text-blue-700 font-mono">{selectedBien.serial_number}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Asignado a:</span>
                    <span className="ml-2 text-blue-700">{selectedBien.assigned_to}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Fecha esperada:</span>
                    <span className="ml-2 text-blue-700">
                      {selectedBien.expected_return_date ? 
                        new Date(selectedBien.expected_return_date).toLocaleDateString() : 
                        'No definida'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  📝 Observaciones de la devolución:
                </label>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Ingrese observaciones sobre el estado del bien, daños, etc..."
                  rows="4"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="flex gap-3">
                <button 
                  onClick={handleReturn}
                  className="btn btn-primary"
                >
                  ✅ Confirmar Devolución
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BienesAsignados