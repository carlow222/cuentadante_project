import { useState } from 'react'
import { useBienes } from '../context/BieneContext'

const AprobacionSalida = () => {
  const { solicitudes } = useBienes()
  
  // Filtrar solo solicitudes aprobadas que necesitan salida
  const solicitudesAprobadas = solicitudes.filter(s => s.estadoFinal === 'Aprobado')
  
  const [formData, setFormData] = useState({
    nombreResponsable: '',
    identificacion: '',
    bienSeleccionado: '',
    descripcionBien: '',
    motivoSalida: '',
    fechaSalida: '',
    prioridadSalida: 'Media',
    conformidadResponsable: false,
    aprobado: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'bienSeleccionado') {
      const solicitud = solicitudesAprobadas.find(s => s.id.toString() === value)
      if (solicitud) {
        setFormData({
          ...formData,
          bienSeleccionado: value,
          descripcionBien: solicitud.bien,
          motivoSalida: solicitud.motivo,
          fechaSalida: new Date().toISOString().split('T')[0],
        })
      } else {
        setFormData({
          ...formData,
          bienSeleccionado: '',
          descripcionBien: '',
          motivoSalida: '',
          fechaSalida: '',
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.bienSeleccionado) {
      alert('⚠️ Por favor, seleccione un bien de la lista.')
      return
    }
    
    if (formData.aprobado && formData.conformidadResponsable) {
      alert('✅ Salida de bienes aprobada correctamente.')
      // Aquí podrías agregar lógica para actualizar el estado en el contexto
    } else if (!formData.conformidadResponsable) {
      alert('⚠️ Debe confirmar la conformidad del responsable antes de guardar.')
    } else {
      alert('⚠️ La salida de bienes no ha sido aprobada.')
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>📋 Aprobación de Salida de Bienes</h2>
        <p className="view-description">
          Gestione la salida física de bienes ya aprobados
        </p>
      </div>

      {/* Tabla de solicitudes aprobadas */}
      <div className="approval-section">
        <h3>🎯 Solicitudes Aprobadas Pendientes de Salida</h3>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Solicitante</th>
                <th>Bien</th>
                <th>Cantidad</th>
                <th>Motivo</th>
                <th>Fecha Aprobación</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesAprobadas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-content">
                      <span className="empty-icon">📦</span>
                      <p>No hay solicitudes aprobadas pendientes de salida</p>
                    </div>
                  </td>
                </tr>
              ) : (
                solicitudesAprobadas.map(solicitud => (
                  <tr key={solicitud.id} className="table-row">
                    <td className="id-cell">{solicitud.id}</td>
                    <td className="name-cell">{solicitud.solicitante}</td>
                    <td className="item-cell">{solicitud.bien}</td>
                    <td className="quantity-cell">{solicitud.cantidad}</td>
                    <td className="reason-cell" title={solicitud.motivo}>
                      {solicitud.motivo.length > 30 
                        ? `${solicitud.motivo.substring(0, 30)}...` 
                        : solicitud.motivo
                      }
                    </td>
                    <td className="date-cell">{solicitud.fechaAccion}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario de aprobación de salida */}
      <div className="approval-form-section">
        <h3>📝 Formulario de Aprobación de Salida</h3>
        <form className="approval-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                👤 Nombre del responsable
              </label>
              <input
                type="text"
                name="nombreResponsable"
                value={formData.nombreResponsable}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese el nombre del responsable"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                🆔 Identificación
              </label>
              <input
                type="text"
                name="identificacion"
                value={formData.identificacion}
                onChange={handleChange}
                className="form-input"
                placeholder="Número de identificación"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                📦 Seleccionar bien a aprobar
              </label>
              <select
                name="bienSeleccionado"
                value={formData.bienSeleccionado}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Seleccione un bien --</option>
                {solicitudesAprobadas.map(solicitud => (
                  <option key={solicitud.id} value={solicitud.id}>
                    ID {solicitud.id} - {solicitud.bien} (Solicitante: {solicitud.solicitante})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                📋 Descripción del bien
              </label>
              <input
                type="text"
                value={formData.descripcionBien}
                className="form-input readonly"
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                📝 Motivo de la salida
              </label>
              <input
                type="text"
                value={formData.motivoSalida}
                className="form-input readonly"
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                📅 Fecha de salida
              </label>
              <input
                type="date"
                value={formData.fechaSalida}
                className="form-input readonly"
                readOnly
                disabled
              />
            </div>
          </div>

          {/* Prioridad */}
          <div className="form-group">
            <label className="form-label">⚡ Prioridad de la salida</label>
            <div className="radio-group">
              {['Baja', 'Media', 'Urgente'].map(prioridad => (
                <label key={prioridad} className="radio-option">
                  <input
                    type="radio"
                    name="prioridadSalida"
                    value={prioridad}
                    checked={formData.prioridadSalida === prioridad}
                    onChange={handleChange}
                  />
                  <span className={`radio-label priority-${prioridad.toLowerCase()}`}>
                    {prioridad}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="conformidadResponsable"
                checked={formData.conformidadResponsable}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                ✅ Confirmo que el responsable está conforme con las condiciones de salida
              </span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="aprobado"
                checked={formData.aprobado}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                🎯 ¿Aprobar salida?
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              💾 Guardar Aprobación
            </button>
          </div>
        </form>
      </div>

      {/* Resumen de datos */}
      <div className="approval-summary">
        <h3>📊 Resumen de Aprobación</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">👤 Responsable:</span>
            <span className="summary-value">
              {formData.nombreResponsable || '[Pendiente]'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🆔 Identificación:</span>
            <span className="summary-value">
              {formData.identificacion || '[Pendiente]'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">📦 Bien seleccionado:</span>
            <span className="summary-value">
              {formData.bienSeleccionado
                ? solicitudesAprobadas.find(s => s.id.toString() === formData.bienSeleccionado)?.bien
                : '[Pendiente]'
              }
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">⚡ Prioridad:</span>
            <span className={`summary-value priority-${formData.prioridadSalida.toLowerCase()}`}>
              {formData.prioridadSalida}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">✅ Conformidad:</span>
            <span className={`summary-value ${formData.conformidadResponsable ? 'approved' : 'pending'}`}>
              {formData.conformidadResponsable ? '✅ Confirmada' : '❌ Pendiente'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🎯 Estado:</span>
            <span className={`summary-value ${formData.aprobado ? 'approved' : 'rejected'}`}>
              {formData.aprobado ? '✅ APROBADO' : '❌ NO APROBADO'}
            </span>
          </div>
        </div>

        <div className="final-status">
          {formData.aprobado && formData.conformidadResponsable && formData.bienSeleccionado ? (
            <div className="status-success">
              ✅ Salida aprobada y conformidad confirmada
            </div>
          ) : (
            <div className="status-pending">
              ⏳ Pendiente de selección, aprobación o conformidad
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AprobacionSalida