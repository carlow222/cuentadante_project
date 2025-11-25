import { useState, useEffect } from 'react';

const NuevaSolicitudCereal = ({ onSuccess }) => {
    const [cereals, setCereals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        applicant_name: '',
        cereal_id: '',
        quantity: '',
        reason: '',
        priority: 'Media'
    });

    useEffect(() => {
        fetchCereals();
    }, []);

    const fetchCereals = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/cereals');
            const data = await response.json();
            setCereals(data);
        } catch (error) {
            console.error('Error fetching cereals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    request_type: 'cereal',
                    quantity: parseFloat(formData.quantity)
                }),
            });

            if (response.ok) {
                alert('Solicitud de cereal creada exitosamente');
                setFormData({
                    applicant_name: '',
                    cereal_id: '',
                    quantity: '',
                    reason: '',
                    priority: 'Media'
                });
                if (onSuccess) onSuccess();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error creating request:', error);
            alert('Error al crear la solicitud');
        }
    };

    const selectedCereal = cereals.find(c => c.id === parseInt(formData.cereal_id));

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando cereales...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Nueva Solicitud de Cereal</h2>
                <p className="text-gray-600">Complete el formulario para solicitar cereales</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="applicant_name" className="block text-sm font-medium text-gray-700 mb-2">
                            👤 Nombre del Solicitante
                        </label>
                        <input
                            type="text"
                            id="applicant_name"
                            name="applicant_name"
                            value={formData.applicant_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese el nombre del solicitante"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cereal_id" className="block text-sm font-medium text-gray-700 mb-2">
                            🌾 Cereal a solicitar
                        </label>
                        <select
                            id="cereal_id"
                            name="cereal_id"
                            value={formData.cereal_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Seleccione un cereal</option>
                            {cereals.map(cereal => (
                                <option 
                                    key={cereal.id} 
                                    value={cereal.id}
                                    disabled={parseFloat(cereal.stock_quantity) === 0}
                                >
                                    {cereal.name} (Stock: {parseFloat(cereal.stock_quantity).toFixed(2)} {cereal.unit_of_measure})
                                    {parseFloat(cereal.stock_quantity) === 0 && ' - No disponible'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCereal && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">📋 Información del cereal seleccionado:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-800">Descripción:</span>
                                    <span className="ml-2 text-blue-700">{selectedCereal.description || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-800">Stock disponible:</span>
                                    <span className="ml-2 text-blue-700">
                                        {parseFloat(selectedCereal.stock_quantity).toFixed(2)} {selectedCereal.unit_of_measure}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-800">Stock mínimo:</span>
                                    <span className="ml-2 text-blue-700">
                                        {parseFloat(selectedCereal.minimum_stock).toFixed(2)} {selectedCereal.unit_of_measure}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-800">Unidad:</span>
                                    <span className="ml-2 text-blue-700">{selectedCereal.unit_of_measure}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            🔢 Cantidad ({selectedCereal ? selectedCereal.unit_of_measure : 'kg'})
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0.01"
                            max={selectedCereal ? selectedCereal.stock_quantity : 999999}
                            placeholder="Ingrese la cantidad solicitada"
                            required
                        />
                        {selectedCereal && parseFloat(formData.quantity) > parseFloat(selectedCereal.stock_quantity) && (
                            <p className="mt-1 text-sm text-red-600">
                                ⚠️ La cantidad no puede ser mayor al stock disponible ({parseFloat(selectedCereal.stock_quantity).toFixed(2)} {selectedCereal.unit_of_measure})
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                            ⚡ Prioridad de la solicitud
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="Leve">🟢 Leve - No urgente</option>
                            <option value="Media">🟡 Media - Importancia normal</option>
                            <option value="Importante">🔴 Importante - Urgente</option>
                            <option value="Alta">🔴 Alta - Muy urgente</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            📝 Motivo de la solicitud
                        </label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describa el motivo de la solicitud de cereal..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            disabled={!selectedCereal || parseFloat(formData.quantity) > parseFloat(selectedCereal?.stock_quantity || 0)}
                        >
                            📤 Enviar Solicitud
                        </button>
                        <button 
                            type="button" 
                            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            onClick={() => setFormData({
                                applicant_name: '',
                                cereal_id: '',
                                quantity: '',
                                reason: '',
                                priority: 'Media'
                            })}
                        >
                            🔄 Limpiar Formulario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NuevaSolicitudCereal;