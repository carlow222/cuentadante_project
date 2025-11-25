import { useState, useEffect } from 'react'
import Loading from './Loading'

const Inventario = () => {
  const [bienes, setBienes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchBienes()
  }, [])

  const fetchBienes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/assets')
      const data = await response.json()
      setBienes(data)
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBienes = bienes.filter(bien => {
    const matchesName = bien.name.toLowerCase().includes(filter.toLowerCase())
    const matchesSerial = bien.serial_number.toLowerCase().includes(filter.toLowerCase())
    const matchesCategory = categoryFilter === '' || bien.category === categoryFilter
    return (matchesName || matchesSerial) && matchesCategory
  })

  const categories = [...new Set(bienes.map(bien => bien.category))]

  if (loading) {
    return <Loading message="Cargando inventario..." />
  }

  return (
    <div className="view-container">
      <div className="mb-6">
        {/* Estadísticas */}
        <div className="stats mb-6">
          <div className="stat-badge stat-total">
            📊 Total: {bienes.length} bienes
          </div>
          <div className="stat-badge stat-available">
            ✅ Disponibles: {bienes.filter(b => b.status === 'Available').length}
          </div>
          <div className="stat-badge stat-borrowed">
            📤 Asignados: {bienes.filter(b => b.status === 'Assigned').length}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o número de serie..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-48"
          >
            <option value="">📂 Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-scroll">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Bien</th>
                <th>Número de Serie</th>
                <th>Marca/Modelo</th>
                <th>Ubicación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredBienes.map((bien) => (
                <tr key={bien.id} className="table-row">
                  <td>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bien.name}</div>
                      <div className="text-sm text-gray-500">{bien.category}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {bien.serial_number}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{bien.inventory_number}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{bien.brand}</div>
                    <div className="text-sm text-gray-500">{bien.model}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{bien.location}</div>
                  </td>
                  <td>
                    <span className={`status-tag ${
                      bien.status === 'Available' 
                        ? 'status-approved'
                        : bien.status === 'Assigned'
                        ? 'status-pending'
                        : 'status-rejected'
                    }`}>
                      {bien.status === 'Available' ? '✅ Disponible' : 
                       bien.status === 'Assigned' ? '📤 Asignado' : 
                       bien.status === 'Maintenance' ? '🔧 Mantenimiento' : bien.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBienes.length === 0 && (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">📦</span>
              <p>No se encontraron bienes que coincidan con los filtros</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredBienes.length} de {bienes.length} bienes
      </div>
    </div>
  )
}

export default Inventario