import { useState, useEffect } from 'react'

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose && onClose(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'notification-success'
      case 'error': return 'notification-error'
      case 'warning': return 'notification-warning'
      default: return 'notification-info'
    }
  }

  return (
    <div className={`notification ${getTypeClass()} ${isVisible ? 'notification-visible' : 'notification-hidden'}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close"
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose && onClose(), 300)
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Notification