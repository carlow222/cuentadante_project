import { useState } from 'react'
import { useBienes } from '../context/BieneContext'

const NuevaSolicitud = () => {
  const { bienes, crearSolicitud, setActiveView } = useBienes()
  const [formData, setFormData] = useState({
    solicitante: '',
    bienId: '',
    cantidad: 1,
    motivo: '',
    prioridad: 'Media'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (crearSolicitud(formData)) {
      setFormData({
        solicitante: '',
        bienId: '',
        cantidad: 1,
        motivo: '',
        prioridad: 'Media'
      })
      
      // Mostrar mensaje de éxito y redirigir
      alert('Solicitud creada exitosamente')
      setActiveView('pendientes')
    }
  }

  const selectedBien = bienes.find(b => b.id === parseInt(formData.bienId))

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>➕ Nueva Solicitud</h2>
        <p className="view-description">
          Complete el formulario para crear una nueva solicitud de bien
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label htmlFor="solicitante" className="form-label">
              👤 Solicitante
            </label>
            <input
              type="text"
              id="solicitante"
              name="solicitante"
              value={formData.solicitante}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingrese el nombre del solicitante"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bienId" className="form-label">
              📦 Bien a solicitar
            </label>
            <select
              id="bienId"
              name="bienId"
              value={formData.bienId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccione un bien</option>
              {bienes.map(bien => (
                <option key={bien.id} value={bien.id} disabled={bien.stock === 0}>
                  {bien.nombre} (Stock: {bien.stock})
                  {bien.stock === 0 && ' - No disponible'}
                </option>
              ))}
            </select>
          </div>

          {selectedBien && (
            <div className="bien-info">
              <h4>📋 Información del bien seleccionado:</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Ubicación:</span>
                  <span className="info-value">{selectedBien.ubicacion}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Stock disponible:</span>
                  <span className="info-value">{selectedBien.stock}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cantidad" className="form-label">
              🔢 Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="form-input"
              min="1"
              max={selectedBien ? selectedBien.stock : 999}
              required
            />
            {selectedBien && formData.cantidad > selectedBien.stock && (
              <span className="form-error">
                ⚠️ La cantidad no puede ser mayor al stock disponible ({selectedBien.stock})
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="prioridad" className="form-label">
              ⚡ Prioridad de la solicitud
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Leve">🟢 Leve - No urgente</option>
              <option value="Media">🟡 Media - Importancia normal</option>
              <option value="Importante">🔴 Importante - Urgente</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="motivo" className="form-label">
              📝 Motivo de la solicitud
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describa el motivo de la solicitud..."
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedBien || formData.cantidad > (selectedBien?.stock || 0)}
            >
              📤 Enviar Solicitud
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setFormData({
                solicitante: '',
                bienId: '',
                cantidad: 1,
                motivo: '',
                prioridad: 'Media'
              })}
            >
              🔄 Limpiar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NuevaSolicitud