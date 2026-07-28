-- =============================================
-- SCHEMA PARA RENTACAR DEL EJE — SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- Tabla de vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  descripcion TEXT NOT NULL,
  placa TEXT UNIQUE NOT NULL,
  color TEXT,
  categoria TEXT,
  propietario TEXT,
  numero_poliza TEXT,
  vencimiento_poliza DATE,
  numero_soat TEXT,
  vencimiento_soat DATE,
  precio_dia NUMERIC DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  numero_reserva TEXT UNIQUE NOT NULL,
  vehiculo_id BIGINT NOT NULL REFERENCES vehiculos(id),
  nombre_cliente TEXT NOT NULL,
  tipo_documento TEXT,
  numero_documento TEXT,
  residencia TEXT,
  telefono_cliente TEXT,
  email_cliente TEXT,
  licencia_numero TEXT,
  licencia_vencimiento DATE,
  fecha_inicio DATE NOT NULL,
  hora_inicio TEXT,
  lugar_inicio TEXT,
  fecha_fin DATE NOT NULL,
  hora_fin TEXT,
  lugar_fin TEXT,
  dias INTEGER DEFAULT 1,
  tarifa_dia NUMERIC DEFAULT 0,
  deducible NUMERIC DEFAULT 0,
  servicios_adicionales NUMERIC DEFAULT 0,
  desc_adicionales TEXT,
  valor_total NUMERIC DEFAULT 0,
  metodo_pago TEXT,
  estado_pago TEXT DEFAULT 'Pendiente',
  km_inicial TEXT,
  nivel_combustible TEXT,
  observaciones TEXT,
  representante TEXT,
  cargo_representante TEXT,
  estado TEXT DEFAULT 'activa',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_reservas_vehiculo ON reservas(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_reservas_fechas ON reservas(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_vehiculos_activo ON vehiculos(activo);

-- =============================================
-- RLS: Solo usuarios autenticados pueden acceder
-- =============================================

ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Vehiculos: lectura y escritura solo para autenticados
CREATE POLICY "vehiculos_select" ON vehiculos FOR SELECT TO authenticated USING (true);
CREATE POLICY "vehiculos_insert" ON vehiculos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "vehiculos_update" ON vehiculos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Reservas: lectura y escritura solo para autenticados
CREATE POLICY "reservas_select" ON reservas FOR SELECT TO authenticated USING (true);
CREATE POLICY "reservas_insert" ON reservas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "reservas_update" ON reservas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Funcion para validar cruce de fechas
CREATE OR REPLACE FUNCTION check_reserva_overlap(
  p_vehiculo_id BIGINT,
  p_fecha_inicio DATE,
  p_fecha_fin DATE,
  p_exclude_id BIGINT DEFAULT NULL
) RETURNS TABLE(id BIGINT, numero_reserva TEXT, fecha_inicio DATE, fecha_fin DATE)
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT r.id, r.numero_reserva, r.fecha_inicio, r.fecha_fin
  FROM reservas r
  WHERE r.vehiculo_id = p_vehiculo_id
    AND r.estado = 'activa'
    AND r.fecha_inicio <= p_fecha_fin
    AND r.fecha_fin >= p_fecha_inicio
    AND (p_exclude_id IS NULL OR r.id != p_exclude_id)
  LIMIT 1;
$$;
