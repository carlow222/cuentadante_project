import { useState, useEffect } from 'react';

const GestionCereales = () => {
    const [cereals, setCereals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCereal, setEditingCereal] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        unit_of_measure: 'kg',
        stock_quantity: '',
        minimum_stock: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCereal 
                ? `http://localhost:3000/api/cereals/${editingCereal.id}`
                : 'http://localhost:3000/api/cereals';
            
            const method = editingCereal ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchCereals();
                resetForm();
                alert(editingCereal ? 'Cereal actualizado exitosamente' : 'Cereal creado exitosamente');
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error saving cereal:', error);
            alert('Error al guardar el cereal');
        }
    };

    const handleEdit = (cereal) => {
        setEditingCereal(cereal);
        setFormData({
            name: cereal.name,
            description: cereal.description || '',
            unit_of_measure: cereal.unit_of_measure,
            stock_quantity: cereal.stock_quantity.toString(),
            minimum_stock: cereal.minimum_stock.toString()
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este cereal?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/cereals/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchCereals();
                    alert('Cereal eliminado exitosamente');
                } else {
                    const error = await response.json();
                    alert('Error: ' + error.error);
                }
            } catch (error) {
                console.error('Error deleting cereal:', error);
                alert('Error al eliminar el cereal');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            unit_of_measure: 'kg',
            stock_quantity: '',
            minimum_stock: ''
        });
        setEditingCereal(null);
        setShowForm(false);
    };

    const getStockStatus = (current, minimum) => {
        const currentStock = parseFloat(current);
        const minStock = parseFloat(minimum);
        
        if (currentStock <= minStock) {
            return { status: 'critical', color: 'text-red-600', text: 'Stock Crítico' };
        } else if (currentStock <= minStock * 1.5) {
            return { status: 'low', color: 'text-yellow-600', text: 'Stock Bajo' };
        } else {
            return { status: 'good', color: 'text-green-600', text: 'Stock Normal' };
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando cereales...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Cereales</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Agregar Cereal
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingCereal ? 'Editar Cereal' : 'Agregar Nuevo Cereal'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Cereal
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unidad de Medida
                                </label>
                                <select
                                    value={formData.unit_of_measure}
                                    onChange={(e) => setFormData({...formData, unit_of_measure: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="kg">Kilogramos (kg)</option>
                                    <option value="lb">Libras (lb)</option>
                                    <option value="ton">Toneladas (ton)</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Actual
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Mínimo
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.minimum_stock}
                                    onChange={(e) => setFormData({...formData, minimum_stock: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingCereal ? 'Actualizar' : 'Crear'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cereal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Actual
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Mínimo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cereals.map((cereal) => {
                            const stockStatus = getStockStatus(cereal.stock_quantity, cereal.minimum_stock);
                            return (
                                <tr key={cereal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{cereal.name}</div>
                                            <div className="text-sm text-gray-500">{cereal.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {parseFloat(cereal.stock_quantity).toFixed(2)} {cereal.unit_of_measure}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {parseFloat(cereal.minimum_stock).toFixed(2)} {cereal.unit_of_measure}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(cereal)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cereal.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionCereales;