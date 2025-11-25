const StatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pendiente':
        return { className: 'status-pending', icon: '⏳' }
      case 'Aprobado':
        return { className: 'status-approved', icon: '✅' }
      case 'Rechazado':
        return { className: 'status-rejected', icon: '❌' }
      default:
        return { className: 'status-pending', icon: '⏳' }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`status-tag ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-text">{status}</span>
    </span>
  )
}

export default StatusTag