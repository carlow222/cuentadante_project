import { useState, useEffect } from 'react'
import Loading from './Loading'

const Historial = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800'
      case 'Rechazado':
        return 'bg-red-100 text-red-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
      case 'Importante':
        return 'text-red-600'
      case 'Media':
        return 'text-yellow-600'
      case 'Leve':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesName = solicitud.applicant_name.toLowerCase().includes(filter.toLowerCase())
    const matchesAsset = solicitud.asset_name?.toLowerCase().includes(filter.toLowerCase())
    const matchesSerial = solicitud.asset_serial?.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = statusFilter === '' || solicitud.status === statusFilter
    return (matchesName || matchesAsset || matchesSerial) && matchesStatus
  })

  if (loading) {
    return <Loading message="Cargando historial..." />
  }

  return (
    <div className="view-container">
      <div className="mb-6">
        {/* Estadísticas */}
        <div className="stats mb-6">
          <div className="stat-badge stat-total">
            📚 Total: {solicitudes.length} solicitudes
          </div>
          <div className="stat-badge stat-approved">
            ✅ Aprobadas: {solicitudes.filter(s => s.status === 'Aprobado').length}
          </div>
          <div className="stat-badge stat-rejected">
            ❌ Rechazadas: {solicitudes.filter(s => s.status === 'Rechazado').length}
          </div>
          <div className="stat-badge stat-borrowed">
            ⏳ Pendientes: {solicitudes.filter(s => s.status === 'Pendiente').length}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por solicitante, bien o número de serie..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-48"
          >
            <option value="">📋 Todos los estados</option>
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="Aprobado">✅ Aprobado</option>
            <option value="Rechazado">❌ Rechazado</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Bien / Número de Serie</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Procesado por</th>
                <th>Fecha de Proceso</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.map((solicitud) => (
                <tr key={solicitud.id} className="table-row">
                  <td className="text-sm font-medium text-gray-900">
                    #{solicitud.id}
                  </td>
                  <td className="text-sm text-gray-900">
                    {new Date(solicitud.request_date).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="text-sm font-medium text-gray-900">{solicitud.applicant_name}</div>
                    {solicitud.applicant_position && (
                      <div className="text-xs text-gray-500">{solicitud.applicant_position}</div>
                    )}
                  </td>
                  <td>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{solicitud.asset_name}</div>
                      <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                        S/N: {solicitud.asset_serial}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`text-sm font-medium ${getPriorityColor(solicitud.priority)}`}>
                      {solicitud.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitud.status)}`}>
                      {solicitud.status}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {solicitud.approved_by || solicitud.rejected_by || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {solicitud.approval_date ? new Date(solicitud.approval_date).toLocaleDateString() :
                       solicitud.rejection_date ? new Date(solicitud.rejection_date).toLocaleDateString() : '—'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSolicitudes.length === 0 && (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">📚</span>
              <p>No se encontraron solicitudes que coincidan con los filtros</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredSolicitudes.length} de {solicitudes.length} solicitudes
      </div>
    </div>
  )
}

export default Historial