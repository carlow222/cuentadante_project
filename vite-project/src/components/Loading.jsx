const Loading = ({ message = "Cargando...", size = "medium" }) => {
  const sizeClasses = {
    small: "loading-small",
    medium: "loading-medium", 
    large: "loading-large"
  }

  return (
    <div className={`loading-container ${sizeClasses[size]}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  )
}

export default Loading