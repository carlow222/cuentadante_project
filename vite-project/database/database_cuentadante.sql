-- =============================================================================
-- SISTEMA DE GESTIÓN DE BIENES - VERSIÓN CUENTADANTE
-- Base de datos simplificada para PostgreSQL
-- Enfocado únicamente en las funciones del Cuentadante
-- =============================================================================

-- =============================================================================
-- LIMPIEZA INICIAL
-- =============================================================================
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- 1. TABLA DE USUARIOS (Solo Cuentadantes)
-- =============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Cuentadante',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. TABLA DE BIENES
-- =============================================================================
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    inventory_number VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    category VARCHAR(100) NOT NULL DEFAULT 'Electronics',
    purchase_date DATE,
    warranty_expiry DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    condition VARCHAR(50) NOT NULL DEFAULT 'New',
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Available', -- Available, Assigned, Maintenance
    assigned_to VARCHAR(255), -- Nombre de la persona asignada
    assignment_date TIMESTAMP,
    expected_return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. TABLA DE SOLICITUDES (Simplificada)
-- =============================================================================
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_position VARCHAR(255), -- Cargo del solicitante
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Media', -- Leve, Media, Importante, Alta
    status VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, Aprobado, Rechazado
    approved_by VARCHAR(255), -- Nombre del cuentadante que aprobó
    approval_date TIMESTAMP,
    rejection_reason TEXT,
    rejected_by VARCHAR(255),
    rejection_date TIMESTAMP,
    expected_return_date DATE,
    actual_return_date DATE,
    notes TEXT -- Observaciones del cuentadante
);

-- =============================================================================
-- 4. TABLA DE HISTORIAL DE MOVIMIENTOS
-- =============================================================================
CREATE TABLE asset_movements (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'ASSIGNMENT', 'RETURN', 'MAINTENANCE', 'REPAIR'
    from_person VARCHAR(255),
    to_person VARCHAR(255),
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    authorized_by VARCHAR(255), -- Cuentadante que autorizó
    notes TEXT
);

-- =============================================================================
-- 5. ÍNDICES
-- =============================================================================
CREATE INDEX idx_assets_serial ON assets(serial_number);
CREATE INDEX idx_assets_inventory ON assets(inventory_number);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_date ON requests(request_date);
CREATE INDEX idx_movements_asset ON asset_movements(asset_id);
CREATE INDEX idx_movements_date ON asset_movements(movement_date);

-- =============================================================================
-- 6. DATOS DE EJEMPLO - USUARIOS (Solo Cuentadantes)
-- =============================================================================
INSERT INTO users (name, email, role) VALUES 
('María González', 'maria.gonzalez@sena.edu.co', 'Cuentadante'),
('Carlos Rodríguez', 'carlos.rodriguez@sena.edu.co', 'Cuentadante'),
('Ana Martínez', 'ana.martinez@sena.edu.co', 'Cuentadante')
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- 7. DATOS DE EJEMPLO - BIENES
-- =============================================================================
INSERT INTO assets (name, description, serial_number, inventory_number, brand, model, category, purchase_date, warranty_expiry, purchase_price, current_value, condition, location, status) VALUES 
('Computadora de Escritorio HP', 'HP EliteDesk 800 G6, Intel i5-10500, 16GB RAM, 512GB SSD', 'SGH438K012', '100000000001', 'HP', 'EliteDesk 800 G6', 'Computadoras', '2024-02-15', '2026-02-15', 720.00, 650.00, 'Excelente', 'Aula de Informática 1', 'Available'),
('Computadora de Escritorio Dell', 'Dell OptiPlex 7080, Intel i5-10505, 16GB RAM, 256GB SSD', 'CN-8D4H-7K2L', '100000000002', 'Dell', 'OptiPlex 7080', 'Computadoras', '2024-03-10', '2026-03-10', 680.00, 610.00, 'Excelente', 'Aula de Informática 2', 'Available'),
('Laptop Lenovo ThinkPad', 'Lenovo ThinkPad T14 Gen 3, Ryzen 5 PRO, 16GB RAM, 512GB SSD', 'PF4K9M3Z', '100000000003', 'Lenovo', 'ThinkPad T14 Gen 3', 'Laptops', '2024-01-20', '2026-01-20', 950.00, 870.00, 'Excelente', 'Oficina de Coordinación', 'Assigned', 'Juan Pérez - Instructor', CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '30 days'),
('Laptop HP Pavilion', 'HP Pavilion 15-eg2097nr, Intel i5-1235U, 8GB RAM, 512GB SSD', '5CD4567GHI', '100000000004', 'HP', 'Pavilion 15-eg2097nr', 'Laptops', '2024-04-05', '2026-04-05', 630.00, 570.00, 'Bueno', 'Sala de Profesores', 'Available'),
('Televisor Samsung 55"', 'Samsung QN55Q60BAFXZA, QLED 4K Smart TV', '0TQN55Q60BA01234', '100000000005', 'Samsung', 'QN55Q60BA', 'Televisores', '2024-01-30', '2025-01-30', 520.00, 460.00, 'Excelente', 'Aula Magna', 'Available'),
('Televisor LG 43"', 'LG 43UQ7570PUB, 4K UHD Smart TV con webOS', '43UQ7570PUB12345', '100000000006', 'LG', '43UQ7570PUB', 'Televisores', '2023-11-20', '2024-11-20', 380.00, 310.00, 'Bueno', 'Sala de Reuniones', 'Available'),
('Monitor Dell 24"', 'Dell P2422HE, 23.8" Full HD, USB-C, HDMI, DisplayPort', 'CN0V3R1M2N3P', '100000000007', 'Dell', 'P2422HE', 'Monitores', '2024-02-28', '2026-02-28', 210.00, 190.00, 'Excelente', 'Aula de Informática 1', 'Available'),
('Proyector Epson', 'Epson PowerLite 1781W, 3600 lúmenes, WXGA inalámbrico', 'V1W2X3Y4Z5', '100000000008', 'Epson', 'PowerLite 1781W', 'Proyectores', '2024-03-05', '2026-03-05', 450.00, 410.00, 'Bueno', 'Aula de Capacitación A', 'Available'),
('Impresora HP LaserJet', 'HP LaserJet Pro MFP M28w, WiFi, impresión y escaneo', 'VNC9J78901', '100000000009', 'HP', 'LaserJet Pro MFP M28w', 'Impresoras', '2024-04-10', '2025-04-10', 140.00, 120.00, 'Bueno', 'Oficina Principal', 'Available'),
('Mesa de Reuniones Ejecutiva', 'Mesa para 10 personas, tablero melamina, base metálica', 'MEL10-2024-001', '100000000010', 'Oficina Total', 'Ejecutiva Pro 10', 'Mobiliario', '2024-01-15', NULL, 580.00, 520.00, 'Excelente', 'Sala de Juntas', 'Available'),
('Tablet Samsung Galaxy', 'Samsung Galaxy Tab S8, 11", 128GB, WiFi', 'SM-X706B123456', '100000000011', 'Samsung', 'Galaxy Tab S8', 'Tablets', '2024-05-15', '2025-05-15', 450.00, 400.00, 'Excelente', 'Biblioteca', 'Available'),
('Cámara Canon EOS', 'Canon EOS Rebel T7, 24.1MP, Kit con lente 18-55mm', 'CN0T7KIT789', '100000000012', 'Canon', 'EOS Rebel T7', 'Cámaras', '2024-03-20', '2025-03-20', 380.00, 340.00, 'Excelente', 'Laboratorio de Medios', 'Available')
ON CONFLICT (serial_number) DO NOTHING;

-- =============================================================================
-- 8. DATOS DE EJEMPLO - SOLICITUDES
-- =============================================================================
INSERT INTO requests (applicant_name, applicant_position, asset_id, reason, priority, status, expected_return_date) VALUES
('Juan Pérez', 'Instructor de Programación', 1, 'Curso intensivo de desarrollo web para 20 estudiantes del programa de Análisis y Desarrollo de Software', 'Alta', 'Pendiente', CURRENT_DATE + INTERVAL '14 days'),
('María Gómez', 'Coordinadora Académica', 5, 'Presentación de logros del programa ante autoridades del SENA regional', 'Importante', 'Pendiente', CURRENT_DATE + INTERVAL '7 days'),
('Carlos López', 'Instructor de Diseño Gráfico', 8, 'Sesión de proyección de portafolios estudiantiles para evaluación final', 'Media', 'Aprobado', CURRENT_DATE + INTERVAL '5 days', 'María González', CURRENT_TIMESTAMP),
('Ana Martínez', 'Directora Académica', 10, 'Reunión estratégica con aliados institucionales y empresas del sector', 'Importante', 'Pendiente', CURRENT_DATE + INTERVAL '3 days'),
('Luis Rodríguez', 'Técnico de Soporte', 4, 'Pruebas de compatibilidad con software educativo especializado', 'Media', 'Rechazado', CURRENT_DATE + INTERVAL '10 days', NULL, NULL, 'Equipo no compatible con software requerido', 'María González', CURRENT_TIMESTAMP),
('Patricia Silva', 'Instructora de Multimedia', 12, 'Grabación de material audiovisual para curso virtual', 'Media', 'Aprobado', CURRENT_DATE + INTERVAL '8 days', 'Carlos Rodríguez', CURRENT_TIMESTAMP),
('Roberto Díaz', 'Instructor de Redes', 7, 'Configuración de estación de trabajo para laboratorio de redes', 'Leve', 'Pendiente', CURRENT_DATE + INTERVAL '12 days');

-- =============================================================================
-- 9. DATOS DE EJEMPLO - MOVIMIENTOS
-- =============================================================================
INSERT INTO asset_movements (asset_id, movement_type, to_person, reason, authorized_by, notes) VALUES
(3, 'ASSIGNMENT', 'Juan Pérez - Instructor', 'Asignación para desarrollo de materiales del curso', 'María González', 'Equipo en excelente estado, incluye cargador y maletín'),
(12, 'ASSIGNMENT', 'Patricia Silva - Instructora', 'Proyecto de grabación de contenidos', 'Carlos Rodríguez', 'Incluye tarjeta SD de 64GB y trípode');

-- =============================================================================
-- 10. VISTAS PARA CUENTADANTE
-- =============================================================================
CREATE OR REPLACE VIEW v_requests_complete AS
SELECT 
    r.id AS request_id,
    r.request_date,
    r.applicant_name,
    r.applicant_position,
    r.reason,
    r.priority,
    r.status,
    r.approved_by,
    r.approval_date,
    r.rejection_reason,
    r.rejected_by,
    r.expected_return_date,
    r.actual_return_date,
    r.notes,
    a.id AS asset_id,
    a.name AS asset_name,
    a.serial_number AS asset_serial,
    a.inventory_number AS asset_inventory,
    a.brand AS asset_brand,
    a.model AS asset_model,
    a.category AS asset_category,
    a.location AS asset_location,
    a.status AS asset_status,
    a.condition AS asset_condition
FROM requests r
JOIN assets a ON r.asset_id = a.id;

CREATE OR REPLACE VIEW v_assets_available AS
SELECT 
    id,
    name,
    serial_number,
    inventory_number,
    brand,
    model,
    category,
    location,
    condition,
    purchase_price,
    current_value,
    CASE 
        WHEN warranty_expiry IS NULL THEN 'Sin Garantía'
        WHEN warranty_expiry < CURRENT_DATE THEN 'Vencida'
        WHEN warranty_expiry < CURRENT_DATE + INTERVAL '30 days' THEN 'Por Vencer'
        ELSE 'Vigente'
    END AS warranty_status,
    warranty_expiry
FROM assets
WHERE status = 'Available';

CREATE OR REPLACE VIEW v_assets_assigned AS
SELECT 
    id,
    name,
    serial_number,
    inventory_number,
    brand,
    model,
    category,
    location,
    assigned_to,
    assignment_date,
    expected_return_date,
    CASE 
        WHEN expected_return_date < CURRENT_DATE THEN 'Vencido'
        WHEN expected_return_date < CURRENT_DATE + INTERVAL '7 days' THEN 'Por Vencer'
        ELSE 'En Tiempo'
    END AS return_status
FROM assets
WHERE status = 'Assigned';

-- =============================================================================
-- 11. FUNCIONES PARA CUENTADANTE
-- =============================================================================
CREATE OR REPLACE FUNCTION approve_request(
    request_id INTEGER,
    cuentadante_name VARCHAR(255),
    notes_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    asset_id_var INTEGER;
    applicant_name_var VARCHAR(255);
BEGIN
    -- Obtener información de la solicitud
    SELECT asset_id, applicant_name INTO asset_id_var, applicant_name_var
    FROM requests 
    WHERE id = request_id AND status = 'Pendiente';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar que el bien esté disponible
    IF NOT EXISTS (SELECT 1 FROM assets WHERE id = asset_id_var AND status = 'Available') THEN
        RETURN FALSE;
    END IF;
    
    -- Aprobar la solicitud
    UPDATE requests 
    SET status = 'Aprobado',
        approved_by = cuentadante_name,
        approval_date = CURRENT_TIMESTAMP,
        notes = notes_text
    WHERE id = request_id;
    
    -- Asignar el bien
    UPDATE assets 
    SET status = 'Assigned',
        assigned_to = applicant_name_var,
        assignment_date = CURRENT_TIMESTAMP,
        expected_return_date = (SELECT expected_return_date FROM requests WHERE id = request_id)
    WHERE id = asset_id_var;
    
    -- Registrar el movimiento
    INSERT INTO asset_movements (asset_id, movement_type, to_person, reason, authorized_by, notes)
    VALUES (asset_id_var, 'ASSIGNMENT', applicant_name_var, 
            'Solicitud aprobada #' || request_id, cuentadante_name, notes_text);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reject_request(
    request_id INTEGER,
    cuentadante_name VARCHAR(255),
    rejection_reason_text TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE requests 
    SET status = 'Rechazado',
        rejected_by = cuentadante_name,
        rejection_date = CURRENT_TIMESTAMP,
        rejection_reason = rejection_reason_text
    WHERE id = request_id AND status = 'Pendiente';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION return_asset(
    asset_id_param INTEGER,
    cuentadante_name VARCHAR(255),
    return_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    assigned_person VARCHAR(255);
BEGIN
    -- Obtener información del bien asignado
    SELECT assigned_to INTO assigned_person
    FROM assets 
    WHERE id = asset_id_param AND status = 'Assigned';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Marcar como disponible
    UPDATE assets 
    SET status = 'Available',
        assigned_to = NULL,
        assignment_date = NULL,
        expected_return_date = NULL
    WHERE id = asset_id_param;
    
    -- Actualizar solicitud si existe
    UPDATE requests 
    SET actual_return_date = CURRENT_DATE
    WHERE asset_id = asset_id_param AND status = 'Aprobado' AND actual_return_date IS NULL;
    
    -- Registrar el movimiento
    INSERT INTO asset_movements (asset_id, movement_type, from_person, reason, authorized_by, notes)
    VALUES (asset_id_param, 'RETURN', assigned_person, 
            'Devolución de bien', cuentadante_name, return_notes);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 12. CONSULTAS DE VERIFICACIÓN
-- =============================================================================
SELECT 'Usuarios (Cuentadantes): ' || COUNT(*) AS resultado FROM users
UNION ALL
SELECT 'Bienes registrados: ' || COUNT(*) FROM assets
UNION ALL
SELECT 'Solicitudes creadas: ' || COUNT(*) FROM requests
UNION ALL
SELECT 'Bienes disponibles: ' || COUNT(*) FROM assets WHERE status = 'Available'
UNION ALL
SELECT 'Bienes asignados: ' || COUNT(*) FROM assets WHERE status = 'Assigned';

-- =============================================================================
-- 13. RESUMEN FINAL
-- =============================================================================
SELECT 'Sistema Cuentadante instalado correctamente' AS ESTADO_DE_INSTALACION;
SELECT 'Bienes disponibles para asignación: ' || COUNT(*) AS BIENES_DISPONIBLES FROM assets WHERE status = 'Available';
SELECT 'Solicitudes pendientes de aprobación: ' || COUNT(*) AS SOLICITUDES_PENDIENTES FROM requests WHERE status = 'Pendiente';
SELECT 'Valor total del inventario: $' || ROUND(SUM(current_value), 2) AS VALOR_TOTAL_INVENTARIO FROM assets;

-- =============================================================================
-- INSTALACIÓN COMPLETADA - VERSIÓN CUENTADANTE
-- =============================================================================
SELECT 'Sistema simplificado para Cuentadante. Listo para gestión de bienes.' AS MENSAJE_FINAL;