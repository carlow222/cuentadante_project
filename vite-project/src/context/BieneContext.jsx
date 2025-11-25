import { createContext, useContext, useState, useEffect } from 'react'

const BieneContext = createContext()

const API_URL = 'http://localhost:3000/api'

export const useBienes = () => {
  const context = useContext(BieneContext)
  if (!context) {
    throw new Error('useBienes debe ser usado dentro de BieneProvider')
  }
  return context
}

export const BieneProvider = ({ children }) => {
  const [bienes, setBienes] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [userRole, setUserRole] = useState('cuentadante')
  const [activeView, setActiveView] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Fetch bienes from API
  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await fetch(`${API_URL}/assets`)
        const data = await response.json()

        // Transform DB data to match frontend format
        const transformedBienes = data.map(asset => ({
          id: asset.id,
          nombre: asset.name,
          ubicacion: asset.description || 'Sin ubicación',
          stock: 1,
          prestadoA: asset.status === 'Assigned' ? 'Alguien' : null
        }))

        setBienes(transformedBienes)
      } catch (error) {
        console.error('Error fetching bienes:', error)
      }
    }

    fetchBienes()
  }, [])

  // Fetch solicitudes from API
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(`${API_URL}/requests`)
        const data = await response.json()

        // Transform DB data to match frontend format
        const transformedSolicitudes = data.map(req => ({
          id: req.id,
          fecha: new Date(req.request_date).toLocaleString(),
          solicitante: req.applicant_name,
          bienId: req.asset_id,
          bien: req.asset_name,
          cantidad: req.quantity,
          motivo: req.reason,
          prioridad: req.priority,
          estados: req.status_workflow,
          estadoFinal: req.final_status,
          fechaAccion: req.action_date ? new Date(req.action_date).toLocaleString() : null,
          motivoRechazo: req.rejection_reason,
          rolQueRechazo: req.rejected_by_role
        }))

        setSolicitudes(transformedSolicitudes)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching solicitudes:', error)
        setLoading(false)
      }
    }

    fetchSolicitudes()
  }, [])

  // Función personalizada para cambiar el rol con validación
  const changeUserRole = (newRole) => {
    setUserRole(newRole)
    if (newRole !== 'cuentadante' && activeView === 'aprobacion') {
      setActiveView('pendientes')
    }
  }

  const crearSolicitud = async (solicitudData) => {
    const bien = bienes.find(b => b.id === parseInt(solicitudData.bienId))
    if (!bien || solicitudData.cantidad > bien.stock) {
      alert('Stock insuficiente.')
      return false
    }

    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_name: solicitudData.solicitante,
          asset_id: parseInt(solicitudData.bienId),
          quantity: parseInt(solicitudData.cantidad),
          reason: solicitudData.motivo,
          priority: solicitudData.prioridad || 'Media'
        })
      })

      if (response.ok) {
        const newRequest = await response.json()

        // Transform and add to local state
        const transformedRequest = {
          id: newRequest.id,
          fecha: new Date(newRequest.request_date).toLocaleString(),
          solicitante: newRequest.applicant_name,
          bienId: newRequest.asset_id,
          bien: bien.nombre,
          cantidad: newRequest.quantity,
          motivo: newRequest.reason,
          prioridad: newRequest.priority,
          estados: newRequest.status_workflow,
          estadoFinal: newRequest.final_status,
          fechaAccion: null
        }

        setSolicitudes(prev => [...prev, transformedRequest])
        return true
      } else {
        alert('Error al crear solicitud')
        return false
      }
    } catch (error) {
      console.error('Error creating solicitud:', error)
      alert('Error al crear solicitud')
      return false
    }
  }

  const aprobarSolicitud = async (id) => {
    if (userRole === 'instructor') {
      alert('Los instructores no pueden aprobar solicitudes.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/requests/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: userRole
        })
      })

      if (response.ok) {
        const updatedRequest = await response.json()

        // Update local state
        setSolicitudes(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              estados: updatedRequest.status_workflow,
              estadoFinal: updatedRequest.final_status,
              fechaAccion: updatedRequest.action_date ? new Date(updatedRequest.action_date).toLocaleString() : null
            }
          }
          return s
        }))

        // If fully approved, update stock
        if (updatedRequest.final_status === 'Aprobado') {
          const solicitud = solicitudes.find(s => s.id === id)
          if (solicitud) {
            setBienes(prevBienes => prevBienes.map(b => {
              if (b.id === solicitud.bienId) {
                return {
                  ...b,
                  stock: Math.max(0, b.stock - solicitud.cantidad),
                  prestadoA: solicitud.solicitante
                }
              }
              return b
            }))
          }
        }
      } else {
        alert('Error al aprobar solicitud')
      }
    } catch (error) {
      console.error('Error approving solicitud:', error)
      alert('Error al aprobar solicitud')
    }
  }

  const rechazarSolicitud = async (id, motivoRechazo) => {
    if (userRole === 'instructor') {
      alert('Los instructores no pueden rechazar solicitudes.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/requests/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: userRole,
          reason: motivoRechazo
        })
      })

      if (response.ok) {
        const updatedRequest = await response.json()

        // Update local state
        setSolicitudes(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              estados: updatedRequest.status_workflow,
              estadoFinal: updatedRequest.final_status,
              motivoRechazo: updatedRequest.rejection_reason,
              rolQueRechazo: updatedRequest.rejected_by_role,
              fechaAccion: updatedRequest.action_date ? new Date(updatedRequest.action_date).toLocaleString() : null
            }
          }
          return s
        }))
      } else {
        alert('Error al rechazar solicitud')
      }
    } catch (error) {
      console.error('Error rejecting solicitud:', error)
      alert('Error al rechazar solicitud')
    }
  }

  const value = {
    bienes,
    solicitudes,
    userRole,
    setUserRole: changeUserRole,
    activeView,
    setActiveView,
    crearSolicitud,
    aprobarSolicitud,
    rechazarSolicitud,
    loading
  }

  return (
    <BieneContext.Provider value={value}>
      {children}
    </BieneContext.Provider>
  )
}