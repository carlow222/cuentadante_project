import { useState, useEffect } from 'react'
import Loading from './Loading'

const MovimientosBienes = () => {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchMovimientos()
  }, [])

  const fetchMovimientos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movements')
      const data = await response.json()
      setMovimientos(data)
    } catch (error) {
      console.error('Error fetching movements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMovementIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return '📤'
      case 'RETURN': return '📥'
      case 'MAINTENANCE': return '🔧'
      case 'REPAIR': return '🛠️'
      default: return '🔄'
    }
  }

  const getMovementColor = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return 'status-pending'
      case 'RETURN': return 'status-approved'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'REPAIR': return 'bg-red-100 text-red-800'
      default: return 'status-tag'
    }
  }

  const getMovementText = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return 'Asignación'
      case 'RETURN': return 'Devolución'
      case 'MAINTENANCE': return 'Mantenimiento'
      case 'REPAIR': return 'Reparación'
      default: return type
    }
  }

  const filteredMovimientos = movimientos.filter(mov => {
    const matchesAsset = mov.asset_name?.toLowerCase().includes(filter.toLowerCase())
    const matchesSerial = mov.asset_serial?.toLowerCase().includes(filter.toLowerCase())
    const matchesPerson = mov.to_person?.toLowerCase().includes(filter.toLowerCase()) ||
                         mov.from_person?.toLowerCase().includes(filter.toLowerCase())
    const matchesType = typeFilter === '' || mov.movement_type === typeFilter
    return (matchesAsset || matchesSerial || matchesPerson) && matchesType
  })

  const movementTypes = [...new Set(movimientos.map(mov => mov.movement_type))]

  if (loading) {
    return <Loading message="Cargando movimientos de bienes..." />
  }

  return (
    <div className="view-container">
      <div className="mb-6">
        {/* Estadísticas */}
        <div className="stats mb-6">
          <div className="stat-badge stat-total">
            🔄 Total Movimientos: {movimientos.length}
          </div>
          <div className="stat-badge stat-borrowed">
            📤 Asignaciones: {movimientos.filter(m => m.movement_type === 'ASSIGNMENT').length}
          </div>
          <div className="stat-badge stat-available">
            📥 Devoluciones: {movimientos.filter(m => m.movement_type === 'RETURN').length}
          </div>
          <div className="stat-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
            🔧 Mantenimientos: {movimientos.filter(m => m.movement_type === 'MAINTENANCE').length}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por bien, serie o persona..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-48"
          >
            <option value="">🔄 Todos los tipos</option>
            {movementTypes.map(type => (
              <option key={type} value={type}>
                {getMovementIcon(type)} {getMovementText(type)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Bien</th>
                <th>De</th>
                <th>Para</th>
                <th>Autorizado por</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovimientos.map((movimiento) => (
                <tr key={movimiento.id} className="table-row">
                  <td>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(movimiento.movement_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(movimiento.movement_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-tag ${getMovementColor(movimiento.movement_type)}`}>
                      {getMovementIcon(movimiento.movement_type)} {getMovementText(movimiento.movement_type)}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{movimiento.asset_name}</div>
                      <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                        S/N: {movimiento.asset_serial}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {movimiento.from_person || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {movimiento.to_person || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-medium text-green-700">
                      {movimiento.authorized_by}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700 max-w-xs">
                      {movimiento.reason}
                    </div>
                    {movimiento.notes && (
                      <div className="text-xs text-gray-500 mt-1 italic">
                        📝 {movimiento.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMovimientos.length === 0 && (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">🔄</span>
              <p>No se encontraron movimientos que coincidan con los filtros</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredMovimientos.length} de {movimientos.length} movimientos
      </div>
    </div>
  )
}

export default MovimientosBienes