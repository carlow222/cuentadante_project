-- =============================================================================
-- SISTEMA DE GESTION DE BIENES PARA FORMACION PROFESIONAL
-- Base de datos completa para PostgreSQL
-- Ejecutar COMPLETO para instalacion desde cero
-- ADVERTENCIA: Elimina las tablas existentes. Use solo en desarrollo o con respaldo.
-- =============================================================================

-- =============================================================================
-- LIMPIEZA INICIAL
-- =============================================================================
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- 1. TABLA DE USUARIOS
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
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. TABLA DE ASIGNACIONES
-- =============================================================================
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP,
    remarks TEXT
);

-- =============================================================================
-- 4. TABLA DE SOLICITUDES
-- =============================================================================
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applicant_name VARCHAR(255) NOT NULL,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    reason TEXT,
    priority VARCHAR(50) DEFAULT 'Media',
    status_workflow JSONB DEFAULT '{"cuentadante": "Pendiente", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}',
    final_status VARCHAR(50) DEFAULT 'Pendiente',
    action_date TIMESTAMP,
    rejection_reason TEXT,
    rejected_by_role VARCHAR(50),
    expected_return_date DATE,
    actual_return_date DATE
);

-- =============================================================================
-- 5. INDICES
-- =============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_assets_serial ON assets(serial_number);
CREATE INDEX idx_assets_inventory ON assets(inventory_number);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_brand ON assets(brand);
CREATE INDEX idx_requests_status ON requests(final_status);
CREATE INDEX idx_requests_date ON requests(request_date);
CREATE INDEX idx_assignments_asset ON assignments(asset_id);
CREATE INDEX idx_assignments_user ON assignments(user_id);

-- =============================================================================
-- 6. DATOS DE EJEMPLO - USUARIOS
-- =============================================================================
INSERT INTO users (name, email, role) VALUES 
('Juan Perez', 'juan.perez@example.com', 'Admin'),
('Maria Gomez', 'maria.gomez@example.com', 'Cuentadante'),
('Carlos Lopez', 'carlos.lopez@example.com', 'Cuentadante'),
('Ana Martinez', 'ana.martinez@example.com', 'Gerente'),
('Luis Rodriguez', 'luis.rodriguez@example.com', 'Celador')
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- 7. DATOS DE EJEMPLO - BIENES
-- =============================================================================
INSERT INTO assets (name, description, serial_number, inventory_number, brand, model, category, purchase_date, warranty_expiry, purchase_price, current_value, condition, location, status) VALUES 
('Computadora de Escritorio HP', 'PC de escritorio HP Pavilion, Intel i5, 8GB RAM, 1TB HDD', '5CD2345ABC', 'INV-PC-001', 'HP', 'Pavilion Desktop', 'Computadoras', '2023-01-15', '2025-01-15', 650.00, 580.00, 'Good', 'Aula de Informatica 1', 'Available'),
('Computadora de Escritorio Dell', 'PC Dell Inspiron, Intel i3, 4GB RAM, 500GB HDD', 'BXCVRT8', 'INV-PC-002', 'Dell', 'Inspiron 3880', 'Computadoras', '2022-08-20', '2024-08-20', 480.00, 400.00, 'Good', 'Aula de Informatica 2', 'Available'),
('Laptop Lenovo ThinkPad', 'Laptop Lenovo ThinkPad E15, Intel i5, 8GB RAM, 256GB SSD', 'PF3K8M2Y', 'INV-LAP-001', 'Lenovo', 'ThinkPad E15', 'Laptops', '2023-03-10', '2025-03-10', 750.00, 680.00, 'Excellent', 'Oficina Coordinacion', 'Assigned'),
('Laptop HP Pavilion', 'Laptop HP Pavilion 15, AMD Ryzen 5, 8GB RAM, 512GB SSD', '5CD3456DEF', 'INV-LAP-002', 'HP', 'Pavilion 15', 'Laptops', '2023-02-25', '2025-02-25', 620.00, 550.00, 'Good', 'Sala de Profesores', 'Available'),
('Televisor Samsung 55"', 'Smart TV Samsung 55" 4K UHD, WiFi integrado', 'HU55AU7000FXZA', 'INV-TV-001', 'Samsung', 'UN55AU7000', 'Televisores', '2023-01-20', '2024-01-20', 480.00, 420.00, 'Excellent', 'Aula Magna', 'Available'),
('Televisor LG 43"', 'Smart TV LG 43" Full HD, WebOS', '43LM6300PUB', 'INV-TV-002', 'LG', '43LM6300', 'Televisores', '2022-11-15', '2023-11-15', 350.00, 280.00, 'Good', 'Sala de Reuniones', 'Available'),
('Monitor Samsung 24"', 'Monitor LED Samsung 24" Full HD, HDMI/VGA', 'HCJN500123', 'INV-MON-001', 'Samsung', 'F24T450FQN', 'Monitores', '2023-04-05', '2025-04-05', 180.00, 160.00, 'Excellent', 'Aula de Informatica 1', 'Available'),
('Monitor Dell 22"', 'Monitor Dell 22" LED, resolucion 1920x1080', 'CN0H7TJK13', 'INV-MON-002', 'Dell', 'E2220H', 'Monitores', '2022-12-10', '2024-12-10', 150.00, 120.00, 'Good', 'Oficina Administrativa', 'Available'),
('Proyector Epson', 'Proyector Epson PowerLite S41+, 3300 lumenes, SVGA', 'X9KL001234', 'INV-PRO-001', 'Epson', 'PowerLite S41+', 'Proyectores', '2023-02-15', '2025-02-15', 420.00, 380.00, 'Good', 'Aula de Capacitacion A', 'Available'),
('Proyector BenQ', 'Proyector BenQ MS535A, 3600 lumenes, SVGA', 'ETD185000123', 'INV-PRO-002', 'BenQ', 'MS535A', 'Proyectores', '2022-09-30', '2024-09-30', 380.00, 320.00, 'Good', 'Aula de Capacitacion B', 'Available'),
('Impresora HP LaserJet', 'Impresora HP LaserJet Pro M15w, WiFi, monocromatica', 'VNC8J67890', 'INV-IMP-001', 'HP', 'LaserJet Pro M15w', 'Impresoras', '2023-03-20', '2024-03-20', 120.00, 100.00, 'Good', 'Oficina Principal', 'Available'),
('Impresora Canon Multifuncion', 'Impresora Canon PIXMA G3110, multifuncion, tanque de tinta', 'KCKM01234567', 'INV-IMP-002', 'Canon', 'PIXMA G3110', 'Impresoras', '2022-10-12', '2023-10-12', 180.00, 140.00, 'Good', 'Secretaria Academica', 'Available'),
('Fotocopiadora Xerox', 'Fotocopiadora Xerox WorkCentre 3025, multifuncion', 'BWR123456789', 'INV-FOT-001', 'Xerox', 'WorkCentre 3025', 'Fotocopiadoras', '2022-07-18', '2024-07-18', 280.00, 220.00, 'Fair', 'Centro de Copiado', 'Maintenance'),
('Mesa de Reuniones Grande', 'Mesa de reuniones para 12 personas, madera MDF', 'MDF12P230110', 'INV-MES-001', 'Muebles Oficina', 'Ejecutiva 12P', 'Mobiliario', '2023-01-10', NULL, 450.00, 400.00, 'Good', 'Sala de Juntas', 'Available'),
('Mesa de Reuniones Mediana', 'Mesa de reuniones para 8 personas, melamina blanca', 'MEL8P221125', 'INV-MES-002', 'Muebles Oficina', 'Estandar 8P', 'Mobiliario', '2022-11-25', NULL, 320.00, 280.00, 'Good', 'Sala de Profesores', 'Available'),
('Mesa de Trabajo Individual', 'Mesa de trabajo individual con cajones, 120x60cm', 'IND120230228', 'INV-MES-003', 'Muebles Oficina', 'Individual 120', 'Mobiliario', '2023-02-28', NULL, 180.00, 160.00, 'Excellent', 'Oficina Coordinacion', 'Assigned'),
('Mesa de Computadora', 'Mesa para computadora con soporte para CPU y teclado', 'PCDESK221205', 'INV-MES-004', 'Muebles Oficina', 'PC Desk', 'Mobiliario', '2022-12-05', NULL, 120.00, 100.00, 'Good', 'Aula de Informatica 1', 'Available'),
('Silla Ejecutiva', 'Silla ejecutiva ergonomic con respaldo alto, cuero sintetico', 'EJEC230115', 'INV-SIL-001', 'Muebles Oficina', 'Ejecutiva Premium', 'Mobiliario', '2023-01-15', NULL, 220.00, 190.00, 'Good', 'Oficina Direccion', 'Available'),
('Silla de Oficina', 'Silla de oficina con ruedas, respaldo medio, tela negra', 'OFIC221020', 'INV-SIL-002', 'Muebles Oficina', 'Oficina Estandar', 'Mobiliario', '2022-10-20', NULL, 85.00, 70.00, 'Good', 'Oficina Administrativa', 'Available'),
('Silla de Capacitacion', 'Silla apilable para capacitacion, respaldo plastico', 'CAPA230312', 'INV-SIL-003', 'Muebles Oficina', 'Capacitacion', 'Mobiliario', '2023-03-12', NULL, 45.00, 40.00, 'Good', 'Aula de Capacitacion A', 'Available'),
('Pizarra Acrilica Grande', 'Pizarra acrilica blanca 120x90cm con marco de aluminio', 'PIZ120X90', 'INV-PIZ-001', 'Material Didactico', 'Acrilica 120x90', 'Didactico', '2023-02-10', NULL, 85.00, 75.00, 'Excellent', 'Aula de Capacitacion A', 'Available'),
('Pizarra Acrilica Mediana', 'Pizarra acrilica blanca 90x60cm con marco de aluminio', 'PIZ90X60', 'INV-PIZ-002', 'Material Didactico', 'Acrilica 90x60', 'Didactico', '2022-11-30', NULL, 65.00, 55.00, 'Good', 'Aula de Capacitacion B', 'Available'),
('Rotafolio con Tripode', 'Rotafolio con tripode ajustable, papel bond incluido', 'ROT230125', 'INV-ROT-001', 'Material Didactico', 'Tripode Estandar', 'Didactico', '2023-01-25', NULL, 120.00, 110.00, 'Good', 'Sala de Reuniones', 'Available'),
('Parlantes Multimedia', 'Parlantes multimedia 2.1 con subwoofer, conexion USB', '097855123456', 'INV-AUD-001', 'Logitech', 'Z313 2.1', 'Audio', '2023-03-15', '2024-03-15', 45.00, 40.00, 'Good', 'Aula de Informatica 2', 'Available'),
('Microfono Inalambrico', 'Microfono inalambrico de mano con receptor', 'SM58W789012', 'INV-MIC-001', 'Shure', 'SM58 Wireless', 'Audio', '2022-12-20', '2024-12-20', 180.00, 150.00, 'Good', 'Aula Magna', 'Available'),
('Camara Web', 'Camara web HD 1080p con microfono integrado', '1946LOGI567', 'INV-CAM-001', 'Logitech', 'C920 HD Pro', 'Video', '2023-04-01', '2025-04-01', 85.00, 75.00, 'Excellent', 'Sala de Videoconferencias', 'Available'),
('Archivador Metalico 4 Gavetas', 'Archivador metalico vertical de 4 gavetas, color gris', 'ARC4G220915', 'INV-ARC-001', 'Muebles Oficina', 'Metalico 4G', 'Mobiliario', '2022-09-15', NULL, 180.00, 150.00, 'Good', 'Archivo General', 'Available'),
('Estanteria Metalica', 'Estanteria metalica 5 niveles, 180x90x40cm', 'EST5N230205', 'INV-EST-001', 'Muebles Oficina', 'Metalica 5N', 'Mobiliario', '2023-02-05', NULL, 120.00, 110.00, 'Good', 'Almacen de Materiales', 'Available'),
('Locker Metalico', 'Locker metalico individual con cerradura', 'LOC221030', 'INV-LOC-001', 'Muebles Oficina', 'Individual', 'Mobiliario', '2022-10-30', NULL, 95.00, 80.00, 'Fair', 'Vestuario Personal', 'Available'),
('Router WiFi', 'Router WiFi TP-Link AC1200, doble banda', 'AC1200230130', 'INV-NET-001', 'TP-Link', 'Archer C6', 'Networking', '2023-01-30', '2025-01-30', 65.00, 55.00, 'Good', 'Oficina Principal', 'Available'),
('Switch de Red', 'Switch de red 8 puertos Gigabit Ethernet', 'GS308221110', 'INV-NET-002', 'Netgear', 'GS308', 'Networking', '2022-11-10', '2024-11-10', 35.00, 30.00, 'Good', 'Cuarto de Equipos', 'Available')
ON CONFLICT (serial_number) DO NOTHING;

-- =============================================================================
-- 8. DATOS DE EJEMPLO - ASIGNACIONES
-- =============================================================================
INSERT INTO assignments (asset_id, user_id, assigned_at, remarks)
SELECT 2, 2, CURRENT_TIMESTAMP, 'Asignado para trabajo remoto'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM assignments WHERE asset_id = 2 AND user_id = 2 AND returned_at IS NULL
);

-- =============================================================================
-- 9. DATOS DE EJEMPLO - SOLICITUDES
-- =============================================================================
INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Juan Perez - Instructor de Informatica', 1, 1, 'Capacitacion en ofimatica para curso de Administracion de Empresas - Grupo de 25 estudiantes', 'Importante', 'Aprobado', 
       '{"cuentadante": "Aprobado", "gerente": "Aprobado", "administrador": "Aprobado", "celador": "Aprobado"}', '2024-02-15'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Juan Perez - Instructor de Informatica' AND asset_id = 1
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Maria Rodriguez - Coordinadora Academica', 5, 1, 'Presentacion de resultados academicos en reunion con padres de familia del programa tecnico', 'Media', 'Pendiente', 
       '{"cuentadante": "Aprobado", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-01-30'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Maria Rodriguez - Coordinadora Academica' AND asset_id = 5
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Carlos Lopez - Instructor de Contabilidad', 9, 1, 'Proyeccion de material didactico para clase de Contabilidad Basica - Modulo de costos', 'Alta', 'Pendiente', 
       '{"cuentadante": "Pendiente", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-02-05'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Carlos Lopez - Instructor de Contabilidad' AND asset_id = 9
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Ana Martinez - Secretaria Academica', 11, 1, 'Impresion de certificados y diplomas para ceremonia de graduacion del semestre', 'Alta', 'Pendiente', 
       '{"cuentadante": "Pendiente", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-01-25'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Ana Martinez - Secretaria Academica' AND asset_id = 11
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Luis Rodriguez - Instructor de Sistemas', 3, 1, 'Desarrollo de material de apoyo para curso de Programacion Basica en Java', 'Media', 'Pendiente', 
       '{"cuentadante": "Aprobado", "gerente": "Aprobado", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-02-10'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Luis Rodriguez - Instructor de Sistemas' AND asset_id = 3
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Carmen Morales - Directora', 14, 1, 'Reunion de coordinacion con mesa directiva para planificacion academica 2024', 'Importante', 'Pendiente', 
       '{"cuentadante": "Pendiente", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-01-28'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Carmen Morales - Directora' AND asset_id = 14
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Roberto Silva - Instructor de Marketing', 6, 1, 'Presentacion de casos de estudio para curso de Marketing Digital y Redes Sociales', 'Media', 'Rechazado', 
       '{"cuentadante": "Aprobado", "gerente": "Rechazado", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-02-01'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Roberto Silva - Instructor de Marketing' AND asset_id = 6
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Patricia Gonzalez - Instructora de Secretariado', 4, 1, 'Preparacion de material para curso de Tecnicas de Oficina - Practicas de digitacion', 'Media', 'Aprobado', 
       '{"cuentadante": "Aprobado", "gerente": "Aprobado", "administrador": "Aprobado", "celador": "Aprobado"}', '2024-02-20'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Patricia Gonzalez - Instructora de Secretariado' AND asset_id = 4
);

INSERT INTO requests (applicant_name, asset_id, quantity, reason, priority, final_status, status_workflow, expected_return_date)
SELECT 'Miguel Torres - Instructor de Ventas', 10, 1, 'Capacitacion en tecnicas de presentacion para curso de Ventas y Atencion al Cliente', 'Media', 'Pendiente', 
       '{"cuentadante": "Aprobado", "gerente": "Pendiente", "administrador": "Pendiente", "celador": "Pendiente"}', '2024-02-12'
FROM (VALUES (1)) AS dummy
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE applicant_name = 'Miguel Torres - Instructor de Ventas' AND asset_id = 10
);

-- =============================================================================
-- 10. VISTAS
-- =============================================================================
CREATE OR REPLACE VIEW v_requests_complete AS
SELECT 
    r.id,
    r.request_date,
    r.applicant_name,
    r.quantity,
    r.reason,
    r.priority,
    r.final_status,
    r.status_workflow,
    r.expected_return_date,
    r.actual_return_date,
    a.name as asset_name,
    a.serial_number,
    a.inventory_number,
    a.brand,
    a.model,
    a.category,
    a.location,
    a.status as asset_status
FROM requests r
JOIN assets a ON r.asset_id = a.id;

CREATE OR REPLACE VIEW v_assets_status AS
SELECT 
    id,
    name,
    description,
    serial_number,
    inventory_number,
    brand,
    model,
    category,
    location,
    status,
    condition,
    purchase_price,
    current_value,
    CASE 
        WHEN warranty_expiry < CURRENT_DATE THEN 'VENCIDA'
        WHEN warranty_expiry < CURRENT_DATE + INTERVAL '30 days' THEN 'POR VENCER'
        ELSE 'VIGENTE'
    END as warranty_status,
    purchase_date,
    warranty_expiry,
    created_at
FROM assets;

-- =============================================================================
-- 11. FUNCIONES
-- =============================================================================
CREATE OR REPLACE FUNCTION get_available_assets_by_category(category_name VARCHAR)
RETURNS TABLE(
    asset_id INTEGER,
    asset_name VARCHAR,
    serial_number VARCHAR,
    inventory_number VARCHAR,
    location VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.serial_number,
        a.inventory_number,
        a.location
    FROM assets a
    WHERE a.category = category_name 
      AND a.status = 'Available';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 12. CONSULTAS DE VERIFICACION
-- =============================================================================
SELECT 'Usuarios creados: ' || COUNT(*) as resultado FROM users
UNION ALL
SELECT 'Bienes registrados: ' || COUNT(*) FROM assets
UNION ALL
SELECT 'Solicitudes creadas: ' || COUNT(*) FROM requests;

-- =============================================================================
-- 13. RESUMEN FINAL
-- =============================================================================
SELECT 'Base de datos instalada correctamente' as ESTADO_DE_INSTALACION;
SELECT 'Sistema de gestion de bienes de formacion activo' as FUNCIONALIDAD;
SELECT 'Bienes registrados: ' || COUNT(*) as INVENTARIO_TOTAL FROM assets;
SELECT 'Solicitudes registradas: ' || COUNT(*) as SOLICITUDES_SISTEMA FROM requests;
SELECT 'Valor total inventario: $' || ROUND(SUM(current_value), 2) as VALOR_TOTAL_INVENTARIO FROM assets;
-- 
=============================================================================
-- 14. ACTUALIZACIONES PARA BIENES ÚNICOS (OPCIONAL)
-- =============================================================================
-- Ejecutar solo si ya tienes una base de datos existente con columna quantity
-- Comentar estas líneas si es una instalación nueva

-- Eliminar columna quantity ya que cada bien es único
-- ALTER TABLE requests DROP COLUMN IF EXISTS quantity;

-- Verificar números de serie únicos
SELECT 
    'Números de serie verificados: ' || COUNT(DISTINCT serial_number) || ' únicos de ' || COUNT(*) || ' total' as VERIFICACION_SERIALES
FROM assets;

-- Mostrar algunos ejemplos de números de serie realistas
SELECT 
    name,
    serial_number,
    brand,
    model,
    status
FROM assets 
WHERE id <= 10
ORDER BY id;

-- =============================================================================
-- INSTALACIÓN COMPLETADA
-- =============================================================================
SELECT '✅ Sistema listo con números de serie realistas' as ESTADO_FINAL;