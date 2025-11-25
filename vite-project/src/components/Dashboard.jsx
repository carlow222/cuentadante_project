import { useState, useEffect } from 'react'
import StatsCard from './StatsCard'
import Loading from './Loading'
import { Package, CheckCircle, Send, Clock, FileText, ThumbsUp, XCircle, RefreshCw, DollarSign, Plus, BarChart3, Search } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    pendingRequests: 0,
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalMovements: 0,
    avgAssetValue: 0,
    totalAssetValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/stats')
      const data = await response.json()

      setStats({
        totalAssets: parseInt(data.total_assets),
        availableAssets: parseInt(data.available_assets),
        assignedAssets: parseInt(data.assigned_assets),
        pendingRequests: parseInt(data.pending_requests),
        totalRequests: parseInt(data.total_requests),
        approvedRequests: parseInt(data.approved_requests),
        rejectedRequests: parseInt(data.rejected_requests),
        totalMovements: parseInt(data.total_movements),
        avgAssetValue: parseFloat(data.avg_asset_value),
        totalAssetValue: parseFloat(data.total_asset_value)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Cargando panel de control..." />
  }

  return (
    <div className="view-container">
      <div className="dashboard-grid">
        <StatsCard
          icon={<Package size={24} />}
          title="Total de Bienes"
          value={stats.totalAssets}
          subtitle="Bienes registrados en el sistema"
          color="blue"
        />
        
        <StatsCard
          icon={<CheckCircle size={24} />}
          title="Bienes Disponibles"
          value={stats.availableAssets}
          subtitle="Listos para asignación"
          color="green"
          trend={{
            type: 'up',
            text: `${Math.round((stats.availableAssets / stats.totalAssets) * 100)}% del total`
          }}
        />
        
        <StatsCard
          icon={<Send size={24} />}
          title="Bienes Asignados"
          value={stats.assignedAssets}
          subtitle="Actualmente en uso"
          color="yellow"
          trend={{
            type: 'neutral',
            text: `${Math.round((stats.assignedAssets / stats.totalAssets) * 100)}% del total`
          }}
        />
        
        <StatsCard
          icon={<Clock size={24} />}
          title="Solicitudes Pendientes"
          value={stats.pendingRequests}
          subtitle="Esperando aprobación"
          color="red"
        />
        
        <StatsCard
          icon={<FileText size={24} />}
          title="Total Solicitudes"
          value={stats.totalRequests}
          subtitle="Historial completo"
          color="purple"
        />
        
        <StatsCard
          icon={<ThumbsUp size={24} />}
          title="Solicitudes Aprobadas"
          value={stats.approvedRequests}
          subtitle="Procesadas exitosamente"
          color="green"
          trend={{
            type: 'up',
            text: `${stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0}% de éxito`
          }}
        />
        
        <StatsCard
          icon={<XCircle size={24} />}
          title="Solicitudes Rechazadas"
          value={stats.rejectedRequests}
          subtitle="No aprobadas"
          color="red"
        />
        
        <StatsCard
          icon={<RefreshCw size={24} />}
          title="Movimientos Registrados"
          value={stats.totalMovements}
          subtitle="Asignaciones y devoluciones"
          color="purple"
        />
        
        <StatsCard
          icon={<DollarSign size={24} />}
          title="Valor Total Inventario"
          value={`${stats.totalAssetValue?.toLocaleString() || '0'}`}
          subtitle={`Promedio: ${stats.avgAssetValue?.toLocaleString() || '0'}`}
          color="blue"
        />
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Acciones Rápidas</h3>
          <div className="quick-actions">
            <button className="btn btn-primary">
              <Plus size={18} style={{ marginRight: '8px' }} />
              Nueva Solicitud
            </button>
            <button className="btn btn-secondary">
              <BarChart3 size={18} style={{ marginRight: '8px' }} />
              Ver Reportes
            </button>
            <button className="btn btn-secondary">
              <Search size={18} style={{ marginRight: '8px' }} />
              Buscar Bien
            </button>
          </div>
        </div>
        
        <div className="action-card">
          <h3>Resumen del Sistema</h3>
          <div className="system-summary">
            <div className="summary-item">
              <span className="summary-label">Tasa de Disponibilidad:</span>
              <span className="summary-value success">
                {Math.round((stats.availableAssets / stats.totalAssets) * 100)}%
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tasa de Aprobación:</span>
              <span className="summary-value success">
                {stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0}%
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Solicitudes Activas:</span>
              <span className="summary-value warning">
                {stats.pendingRequests}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
