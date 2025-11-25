import { useState, useEffect } from 'react';

const SolicitudesPendientesCereales = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('cuentadante'); // Por defecto
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/requests');
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/requests/${requestId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: userRole }),
            });

            if (response.ok) {
                fetchRequests();
                alert('Solicitud aprobada exitosamente');
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Error al aprobar la solicitud');
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectReason.trim()) {
            alert('Por favor ingrese un motivo de rechazo');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/requests/${selectedRequest.id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    role: userRole,
                    reason: rejectReason 
                }),
            });

            if (response.ok) {
                fetchRequests();
                setIsRejectModalOpen(false);
                setSelectedRequest(null);
                setRejectReason('');
                alert('Solicitud rechazada exitosamente');
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error al rechazar la solicitud');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Alta':
            case 'Importante':
                return 'text-red-600 bg-red-100';
            case 'Media':
                return 'text-yellow-600 bg-yellow-100';
            case 'Leve':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Alta':
            case 'Importante':
                return '🔴';
            case 'Media':
                return '🟡';
            case 'Leve':
                return '🟢';
            default:
                return '🟡';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Aprobado':
                return '✅';
            case 'Rechazado':
                return '❌';
            default:
                return '⏳';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Aprobado':
                return 'text-green-600';
            case 'Rechazado':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    const pendingRequests = requests.filter(r => r.final_status === 'Pendiente');

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando solicitudes...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Panel de Aprobaciones</h2>
                    <div className="flex gap-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {pendingRequests.length} solicitudes pendientes
                        </span>
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="cuentadante">Cuentadante</option>
                            <option value="gerente">Gerente</option>
                            <option value="administrador">Administrador</option>
                            <option value="celador">Celador</option>
                        </select>
                    </div>
                </div>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay solicitudes pendientes</h3>
                    <p className="text-gray-500">Todas las solicitudes han sido procesadas</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingRequests.map(request => (
                        <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                            #{request.id}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                                            {getPriorityIcon(request.priority)} {request.priority}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        📅 {new Date(request.request_date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        👤 {request.applicant_name}
                                    </h4>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        {request.request_type === 'cereal' ? (
                                            <span>🌾 {request.cereal_name} - {parseFloat(request.quantity).toFixed(2)} {request.cereal_unit}</span>
                                        ) : (
                                            <span>📦 {request.asset_name} - {request.quantity} unidades</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        <span className="font-medium">Motivo:</span> {request.reason}
                                    </p>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {['cuentadante', 'gerente', 'administrador', 'celador'].map(role => {
                                        const status = request.status_workflow[role];
                                        return (
                                            <div key={role} className="text-center">
                                                <div className="text-xs text-gray-500 mb-1 capitalize">{role}</div>
                                                <div className={`text-sm font-medium ${getStatusColor(status)}`}>
                                                    {getStatusIcon(status)} {status}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        Inspeccionar
                                    </button>
                                    
                                    {request.status_workflow[userRole] === 'Pendiente' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setIsRejectModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                Rechazar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Inspección */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Detalles de la Solicitud #{selectedRequest.id}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <strong>Solicitante:</strong> {selectedRequest.applicant_name}
                            </div>
                            <div>
                                <strong>Fecha:</strong> {new Date(selectedRequest.request_date).toLocaleString()}
                            </div>
                            <div>
                                <strong>Tipo:</strong> {selectedRequest.request_type === 'cereal' ? 'Cereal' : 'Bien'}
                            </div>
                            <div>
                                <strong>Item:</strong> {selectedRequest.request_type === 'cereal' 
                                    ? `${selectedRequest.cereal_name} - ${parseFloat(selectedRequest.quantity).toFixed(2)} ${selectedRequest.cereal_unit}`
                                    : `${selectedRequest.asset_name} - ${selectedRequest.quantity} unidades`
                                }
                            </div>
                            <div>
                                <strong>Prioridad:</strong> {selectedRequest.priority}
                            </div>
                            <div>
                                <strong>Motivo:</strong> {selectedRequest.reason}
                            </div>
                            <div>
                                <strong>Estado actual:</strong> {selectedRequest.final_status}
                            </div>
                            
                            <div className="mt-4">
                                <strong>Estado por roles:</strong>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {Object.entries(selectedRequest.status_workflow).map(([role, status]) => (
                                        <div key={role} className="flex justify-between">
                                            <span className="capitalize">{role}:</span>
                                            <span className={getStatusColor(status)}>
                                                {getStatusIcon(status)} {status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Rechazo */}
            {isRejectModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud #{selectedRequest.id}</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motivo del rechazo:
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                rows="4"
                                placeholder="Ingrese el motivo del rechazo..."
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirmar Rechazo
                            </button>
                            <button
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setSelectedRequest(null);
                                    setRejectReason('');
                                }}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolicitudesPendientesCereales;