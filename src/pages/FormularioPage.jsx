import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, Calculator, Atom, Compass, Layers, Zap, Info } from 'lucide-react';

const FORMULAS_DATA = [
  // --- FÍSICA ---
  {
    id: 'fis_ohm',
    subject: 'Física',
    topic: 'Electrodinámica',
    name: 'Ley de Ohm',
    formula: 'V = I · R',
    vars: [
      { symbol: 'V', desc: 'Diferencia de potencial o voltaje', unit: 'Voltios (V)' },
      { symbol: 'I', desc: 'Intensidad de corriente eléctrica', unit: 'Amperios (A)' },
      { symbol: 'R', desc: 'Resistencia eléctrica', unit: 'Ohmios (Ω)' }
    ],
    note: 'La corriente que circula por un conductor es directamente proporcional a la tensión e inversamente proporcional a la resistencia.'
  },
  {
    id: 'fis_potencia_electrica',
    subject: 'Física',
    topic: 'Electrodinámica',
    name: 'Potencia Eléctrica y Efecto Joule',
    formula: 'P = V · I = I² · R = V² / R',
    vars: [
      { symbol: 'P', desc: 'Potencia eléctrica disipada o suministrada', unit: 'Watts (W)' },
      { symbol: 'Q', desc: 'Calor disipado (Joule): Q = 0.24 · I² · R · t', unit: 'Calorías (cal)' }
    ],
    note: 'Para calcular el calor desprendido en calorías por efecto Joule, se multiplica la energía en Joules por el equivalente calorífico 0.24 cal/J.'
  },
  {
    id: 'fis_pouillet',
    subject: 'Física',
    topic: 'Electrodinámica',
    name: 'Resistencia de un Conductor (Ley de Pouillet)',
    formula: 'R = ρ · (L / A)',
    vars: [
      { symbol: 'ρ', desc: 'Resistividad eléctrica del material', unit: 'Ω · m' },
      { symbol: 'L', desc: 'Longitud del conductor', unit: 'Metros (m)' },
      { symbol: 'A', desc: 'Área de la sección transversal', unit: 'Metros cuadrados (m²)' }
    ],
    note: 'Si un cable se estira al doble manteniendo su volumen constante, su longitud se duplica y su área se reduce a la mitad, por lo que su nueva resistencia se cuadruplica.'
  },
  {
    id: 'fis_mru',
    subject: 'Física',
    topic: 'Cinemática',
    name: 'Movimiento Rectilíneo Uniforme (MRU)',
    formula: 'd = v · t',
    vars: [
      { symbol: 'd', desc: 'Distancia recorrida', unit: 'Metros (m)' },
      { symbol: 'v', desc: 'Velocidad constante', unit: 'm/s' },
      { symbol: 't', desc: 'Tiempo transcurrido', unit: 'Segundos (s)' }
    ],
    note: 'Tiempo de encuentro: Te = d / (v1 + v2). Tiempo de alcance: Ta = d / (v1 - v2), con v1 > v2.'
  },
  {
    id: 'fis_mruv',
    subject: 'Física',
    topic: 'Cinemática',
    name: 'Movimiento Rectilíneo Uniformemente Variado (MRUV)',
    formula: 'Vf = Vi ± a · t  |  d = Vi · t ± (1/2) · a · t²  |  Vf² = Vi² ± 2 · a · d',
    vars: [
      { symbol: 'Vi', desc: 'Velocidad inicial', unit: 'm/s' },
      { symbol: 'Vf', desc: 'Velocidad final', unit: 'm/s' },
      { symbol: 'a', desc: 'Aceleración constante', unit: 'm/s²' },
      { symbol: 'd', desc: 'Distancia recorrida: d = [(Vi + Vf)/2] · t', unit: 'Metros (m)' }
    ],
    note: 'Usar signo (+) si el movimiento es acelerado y (-) si es retardado o desacelerado.'
  },
  {
    id: 'fis_caida_libre',
    subject: 'Física',
    topic: 'Cinemática',
    name: 'Movimiento Vertical de Caída Libre (MVCL)',
    formula: 'Vf = Vi ± g · t  |  h = Vi · t ± (1/2) · g · t²  |  Vf² = Vi² ± 2 · g · h',
    vars: [
      { symbol: 'h', desc: 'Altura alcanzada o descendida', unit: 'Metros (m)' },
      { symbol: 'g', desc: 'Aceleración de la gravedad (UNSA suele usar 9.8 m/s² o 10 m/s²)', unit: 'm/s²' },
      { symbol: 'Hmax', desc: 'Altura máxima: Hmax = Vi² / (2 · g)', unit: 'Metros (m)' },
      { symbol: 'Tsub', desc: 'Tiempo de subida: Tsub = Vi / g', unit: 'Segundos (s)' }
    ],
    note: 'En el punto más alto de la trayectoria la velocidad vertical instantánea es cero (V = 0).'
  },
  {
    id: 'fis_newton2',
    subject: 'Física',
    topic: 'Dinámica',
    name: 'Segunda Ley de Newton',
    formula: 'Fr = m · a',
    vars: [
      { symbol: 'Fr', desc: 'Fuerza resultante (∑F a favor - ∑F en contra)', unit: 'Newtons (N)' },
      { symbol: 'm', desc: 'Masa del cuerpo', unit: 'Kilogramos (kg)' },
      { symbol: 'a', desc: 'Aceleración adquirida', unit: 'm/s²' }
    ],
    note: 'El peso de un cuerpo es una fuerza gravitatoria dada por W = m · g.'
  },
  {
    id: 'fis_trabajo_energia',
    subject: 'Física',
    topic: 'Trabajo y Energía',
    name: 'Energía Mecánica y Trabajo',
    formula: 'W = F · d · cos(θ)  |  Ec = (1/2) · m · v²  |  Epg = m · g · h',
    vars: [
      { symbol: 'W', desc: 'Trabajo mecánico', unit: 'Joules (J)' },
      { symbol: 'Ec', desc: 'Energía Cinética', unit: 'Joules (J)' },
      { symbol: 'Epg', desc: 'Energía Potencial Gravitatoria', unit: 'Joules (J)' },
      { symbol: 'Epe', desc: 'Energía Potencial Elástica: (1/2) · k · x²', unit: 'Joules (J)' }
    ],
    note: 'En ausencia de fuerzas disipativas (rozamiento), la energía mecánica total se conserva: Em_inicial = Em_final.'
  },
  {
    id: 'fis_hidrostatica',
    subject: 'Física',
    topic: 'Hidrostática',
    name: 'Presión Hidrostática y Principio de Arquímedes',
    formula: 'Ph = ρ_liq · g · h  |  E = ρ_liq · g · V_sumergido',
    vars: [
      { symbol: 'Ph', desc: 'Presión hidrostática a una profundidad h', unit: 'Pascales (Pa)' },
      { symbol: 'E', desc: 'Fuerza de empuje vertical ascendente', unit: 'Newtons (N)' },
      { symbol: 'ρ_liq', desc: 'Densidad del líquido (Agua = 1000 kg/m³)', unit: 'kg/m³' },
      { symbol: 'V_sum', desc: 'Volumen de la porción sumergida del cuerpo', unit: 'm³' }
    ],
    note: 'Presión total o absoluta: P_total = P_atmosférica + Ph. (Patm al nivel del mar ≈ 101.3 kPa o 10⁵ Pa).'
  },
  {
    id: 'fis_coulomb',
    subject: 'Física',
    topic: 'Electrostática',
    name: 'Ley de Coulomb y Campo Eléctrico',
    formula: 'Fe = k · |q1 · q2| / d²  |  E = k · |Q| / d²',
    vars: [
      { symbol: 'k', desc: 'Constante electrostática en el vacío = 9 × 10⁹', unit: 'N · m² / C²' },
      { symbol: 'q', desc: 'Carga eléctrica puntual', unit: 'Coulombs (C)' },
      { symbol: 'd', desc: 'Distancia de separación', unit: 'Metros (m)' },
      { symbol: 'V', desc: 'Potencial eléctrico: V = k · Q / d', unit: 'Voltios (V)' }
    ],
    note: 'Cargas de igual signo se repelen; cargas de signos contrarios se atraen.'
  },

  // --- QUÍMICA ---
  {
    id: 'qui_gases_ideales',
    subject: 'Química',
    topic: 'Estado Gaseoso',
    name: 'Ecuación Universal de los Gases Ideales',
    formula: 'P · V = n · R · T',
    vars: [
      { symbol: 'P', desc: 'Presión absoluta', unit: 'atm o mmHg' },
      { symbol: 'V', desc: 'Volumen del recipiente', unit: 'Litros (L)' },
      { symbol: 'n', desc: 'Número de moles (n = masa / MasaMolar)', unit: 'mol' },
      { symbol: 'R', desc: 'Constante: R = 0.082 (si P está en atm) o 62.4 (si P está en mmHg)', unit: 'atm·L / (mol·K)' },
      { symbol: 'T', desc: 'Temperatura absoluta (T = °C + 273)', unit: 'Kelvin (K)' }
    ],
    note: 'En Condiciones Normales (C.N.: P = 1 atm, T = 0 °C = 273 K), 1 mol de cualquier gas ideal ocupa un volumen molar de 22.4 Litros.'
  },
  {
    id: 'qui_molaridad',
    subject: 'Química',
    topic: 'Soluciones',
    name: 'Molaridad y Normalidad',
    formula: 'M = n_soluto / V_solución(L)  |  N = M · θ',
    vars: [
      { symbol: 'M', desc: 'Concentración molar', unit: 'mol / L' },
      { symbol: 'N', desc: 'Concentración normal', unit: 'Eq-g / L' },
      { symbol: 'θ', desc: 'Parámetro de carga (Ácidos: #H⁺ | Hidróxidos: #OH⁻ | Sales: carga del catión)', unit: 'adimensional' }
    ],
    note: 'Fórmula rápida con densidad y pureza: M = (10 · Densidad · %Pureza) / MasaMolar.'
  },
  {
    id: 'qui_dilucion',
    subject: 'Química',
    topic: 'Soluciones',
    name: 'Ley de Dilución de Soluciones',
    formula: 'C1 · V1 = C2 · V2',
    vars: [
      { symbol: 'C1, C2', desc: 'Concentraciones inicial y final (Molaridad o Normalidad)', unit: 'M o N' },
      { symbol: 'V1, V2', desc: 'Volúmenes inicial y final de la solución', unit: 'mL o L' }
    ],
    note: 'Al agregar solvente (agua), la cantidad de soluto permanece constante; solo cambia el volumen total.'
  },
  {
    id: 'qui_atomo',
    subject: 'Química',
    topic: 'Estructura Atómica',
    name: 'Número de Masa y Carga Nuclear',
    formula: 'A = Z + n°  |  q = Z - e⁻',
    vars: [
      { symbol: 'A', desc: 'Número de masa (nucleones fundamentales)', unit: 'entero' },
      { symbol: 'Z', desc: 'Número atómico (protones en el núcleo)', unit: 'entero' },
      { symbol: 'n°', desc: 'Cantidad de neutrones', unit: 'entero' },
      { symbol: 'e⁻', desc: 'Electrones del átomo o ión', unit: 'entero' }
    ],
    note: 'En un átomo neutro: Z = p⁺ = e⁻ (regla del PEZ).'
  },

  // --- ÁLGEBRA ---
  {
    id: 'alg_productos_notables',
    subject: 'Álgebra',
    topic: 'Productos Notables',
    name: 'Identidades Fundamentales y Legendre',
    formula: '(a ± b)² = a² ± 2ab + b²  |  (a + b)(a - b) = a² - b²  |  (a + b)² + (a - b)² = 2(a² + b²)',
    vars: [
      { symbol: 'Legendre 2', desc: '(a + b)² - (a - b)² = 4ab', unit: 'identidad' },
      { symbol: 'Suma Cubos', desc: 'a³ + b³ = (a + b)(a² - ab + b²)', unit: 'identidad' },
      { symbol: 'Dif Cubos', desc: 'a³ - b³ = (a - b)(a² + ab + b²)', unit: 'identidad' }
    ],
    note: 'Condicional clave: Si a + b + c = 0, entonces a³ + b³ + c³ = 3abc y a² + b² + c² = -2(ab + bc + ac).'
  },
  {
    id: 'alg_cuadratica',
    subject: 'Álgebra',
    topic: 'Ecuaciones de 2do Grado',
    name: 'Fórmula General y Teorema de Cardano',
    formula: 'x = [-b ± √(b² - 4ac)] / (2a)  |  Δ = b² - 4ac',
    vars: [
      { symbol: 'Δ > 0', desc: 'Raíces reales y diferentes', unit: 'propiedad' },
      { symbol: 'Δ = 0', desc: 'Raíces reales e iguales (raíz doble / trinomio cuadrado perfecto)', unit: 'propiedad' },
      { symbol: 'Δ < 0', desc: 'Raíces complejas conjugadas', unit: 'propiedad' },
      { symbol: 'Suma raíces', desc: 'x1 + x2 = -b / a', unit: 'Cardano' },
      { symbol: 'Prod raíces', desc: 'x1 · x2 = c / a', unit: 'Cardano' }
    ],
    note: 'Reconstrucción de ecuación cuadrática conociendo raíces: x² - (Suma)x + (Producto) = 0.'
  },
  {
    id: 'alg_logaritmos',
    subject: 'Álgebra',
    topic: 'Logaritmos',
    name: 'Propiedades Fundamentales de Logaritmos',
    formula: 'log_b(A · B) = log_b(A) + log_b(B)  |  log_b(A / B) = log_b(A) - log_b(B)',
    vars: [
      { symbol: 'Potencia', desc: 'log_b(Aⁿ) = n · log_b(A)', unit: 'propiedad' },
      { symbol: 'Cambio base', desc: 'log_b(A) = log_c(A) / log_c(b)', unit: 'propiedad' },
      { symbol: 'Regla cadena', desc: 'log_b(a) · log_c(b) · log_d(c) = log_d(a)', unit: 'propiedad' }
    ],
    note: 'Condición de existencia: El argumento debe ser positivo (A > 0) y la base debe ser positiva y distinta de 1 (b > 0, b ≠ 1).'
  },

  // --- ARITMÉTICA ---
  {
    id: 'ari_porcentajes',
    subject: 'Aritmética',
    topic: 'Tanto por Ciento',
    name: 'Aplicaciones Comerciales del Porcentaje',
    formula: 'Pv = Pc + G  |  Pv = Pc - P  |  Pv = Pf - D',
    vars: [
      { symbol: 'Pv', desc: 'Precio de venta al público', unit: 'Moneda' },
      { symbol: 'Pc', desc: 'Precio de costo del artículo', unit: 'Moneda' },
      { symbol: 'G', desc: 'Ganancia (generalmente % del precio de costo)', unit: 'Moneda' },
      { symbol: 'P', desc: 'Pérdida (generalmente % del precio de costo)', unit: 'Moneda' },
      { symbol: 'Pf', desc: 'Precio fijado o precio de lista', unit: 'Moneda' },
      { symbol: 'D', desc: 'Descuento o rebaja otorgada (generalmente % del Pf)', unit: 'Moneda' }
    ],
    note: 'Ganancia neta = Ganancia bruta - Gastos.'
  },
  {
    id: 'ari_promedios',
    subject: 'Aritmética',
    topic: 'Promedios',
    name: 'Promedios Aritmético, Geométrico y Armónico',
    formula: 'MA = (a + b) / 2  |  MG = √(a · b)  |  MH = 2ab / (a + b)',
    vars: [
      { symbol: 'Propiedad', desc: 'Para números positivos no iguales: MA > MG > MH', unit: 'desigualdad' },
      { symbol: 'Para 2 cant.', desc: 'MA · MH = (MG)²', unit: 'relación' },
      { symbol: 'Diferencia', desc: '(a - b)² = 4(MA + MG)(MA - MG)', unit: 'relación' }
    ],
    note: 'Si todas las cantidades son iguales, entonces MA = MG = MH.'
  },

  // --- GEOMETRÍA ---
  {
    id: 'geo_pitagoras_metricas',
    subject: 'Geometría',
    topic: 'Relaciones Métricas',
    name: 'Relaciones Métricas en Triángulo Rectángulo',
    formula: 'a² + b² = c²  |  h² = m · n  |  a² = c · m  |  a · b = c · h',
    vars: [
      { symbol: 'c', desc: 'Hipotenusa del triángulo', unit: 'unidades' },
      { symbol: 'a, b', desc: 'Catetos', unit: 'unidades' },
      { symbol: 'h', desc: 'Altura relativa a la hipotenusa', unit: 'unidades' },
      { symbol: 'm, n', desc: 'Proyecciones de los catetos sobre la hipotenusa (c = m + n)', unit: 'unidades' }
    ],
    note: 'Inversa de alturas: 1/h² = 1/a² + 1/b².'
  },
  {
    id: 'geo_areas',
    subject: 'Geometría',
    topic: 'Áreas de Regiones Planas',
    name: 'Fórmulas de Áreas Triangulares y Circulares',
    formula: 'A_triang = (b · h) / 2  |  Fórmula de Herón: √[p(p-a)(p-b)(p-c)]  |  A_circ = π · R²',
    vars: [
      { symbol: 'p', desc: 'Semiperímetro del triángulo: p = (a + b + c) / 2', unit: 'unidades' },
      { symbol: 'R', desc: 'Radio del círculo', unit: 'unidades' },
      { symbol: 'Sector circular', desc: 'A = (π · R² · θ) / 360°', unit: 'unidades²' }
    ],
    note: 'Área de triángulo equilátero de lado L: A = (L² · √3) / 4.'
  },

  // --- TRIGONOMETRÍA ---
  {
    id: 'tri_sistemas',
    subject: 'Trigonometría',
    topic: 'Sistemas Angulares',
    name: 'Relación entre Sistemas Sexagesimal, Centesimal y Radial',
    formula: 'S / 180 = C / 200 = R / π  ==>  S = 9k, C = 10k, R = (π · k) / 20',
    vars: [
      { symbol: 'S', desc: 'Número de grados sexagesimales (°)', unit: 'grados' },
      { symbol: 'C', desc: 'Número de grados centesimales (g)', unit: 'grados' },
      { symbol: 'R', desc: 'Número de radianes (rad)', unit: 'radianes' },
      { symbol: 'k', desc: 'Constante proporcional', unit: 'constante' }
    ],
    note: 'Para simplificar expresiones numéricas angulares, reemplazar directamente S = 9k y C = 10k.'
  },
  {
    id: 'tri_pitagoricas',
    subject: 'Trigonometría',
    topic: 'Identidades Fundamentales',
    name: 'Identidades Pitagóricas y Recíprocas',
    formula: 'sen²(x) + cos²(x) = 1  |  1 + tan²(x) = sec²(x)  |  1 + cot²(x) = csc²(x)',
    vars: [
      { symbol: 'Recíprocas', desc: 'sen(x) · csc(x) = 1  |  cos(x) · sec(x) = 1  |  tan(x) · cot(x) = 1', unit: 'identidades' },
      { symbol: 'Cociente', desc: 'tan(x) = sen(x) / cos(x)  |  cot(x) = cos(x) / sen(x)', unit: 'identidades' }
    ],
    note: 'Identidad auxiliar útil: sec²(x) + csc²(x) = sec²(x) · csc²(x).'
  },
  {
    id: 'tri_compuestos_doble',
    subject: 'Trigonometría',
    topic: 'Ángulos Compuestos y Doble',
    name: 'Ángulos Compuestos y Ángulo Doble',
    formula: 'sen(A ± B) = senA·cosB ± cosA·senB  |  cos(A ± B) = cosA·cosB ∓ senA·senB',
    vars: [
      { symbol: 'sen(2x)', desc: '2 · sen(x) · cos(x)', unit: 'identidad' },
      { symbol: 'cos(2x)', desc: 'cos²(x) - sen²(x) = 2cos²(x) - 1 = 1 - 2sen²(x)', unit: 'identidad' },
      { symbol: 'tan(2x)', desc: '[2 · tan(x)] / [1 - tan²(x)]', unit: 'identidad' }
    ],
    note: 'Fórmulas de degradación de exponente: 2 · sen²(x) = 1 - cos(2x)  |  2 · cos²(x) = 1 + cos(2x).'
  }
];

const SUBJECT_COLORS = {
  'Todos': { color: '#007AFF', bg: 'rgba(0, 122, 255, 0.12)', border: 'rgba(0, 122, 255, 0.35)' },
  'Física': { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.35)' },
  'Química': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)' },
  'Álgebra': { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.35)' },
  'Aritmética': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)' },
  'Geometría': { color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.35)' },
  'Trigonometría': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)' }
};

export const FormularioPage = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const subjectsList = ['Todos', 'Física', 'Química', 'Álgebra', 'Aritmética', 'Geometría', 'Trigonometría'];

  const filteredFormulas = useMemo(() => {
    return FORMULAS_DATA.filter(item => {
      const matchSubject = selectedSubject === 'Todos' || item.subject === selectedSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        (item.note && item.note.toLowerCase().includes(q)) ||
        (item.vars && item.vars.some(v => v.desc.toLowerCase().includes(q) || v.symbol.toLowerCase().includes(q)));

      return matchSubject && matchSearch;
    });
  }, [selectedSubject, searchQuery]);

  return (
    <div className="page-container" style={{ padding: '0 20px 100px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
      {/* Top Bar with Single Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--card-border)', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/cursos')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '14px',
            border: '1.5px solid var(--card-border)',
            background: 'var(--card-bg)',
            color: 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={17} /> Volver a Cursos
        </button>

        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
          {filteredFormulas.length} fórmulas disponibles
        </span>
      </div>

      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Formulario de Ciencias y Matemáticas
        </h1>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.5 }}>
          Fórmulas esenciales, leyes fundamentales y equivalencias para tu preparación al examen de admisión CEPREUNSA.
        </p>

        {/* Buscador de fórmulas */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '20px auto 0' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar fórmula (ej: Ley de Ohm, MRU, Molaridad, Herón)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '16px',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontSize: '0.92rem',
              fontWeight: 600,
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
            }}
          />
        </div>
      </div>

      {/* Selector de Materias (Píldoras) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '22px', WebkitOverflowScrolling: 'touch' }}>
        {subjectsList.map(subj => {
          const isSelected = selectedSubject === subj;
          const conf = SUBJECT_COLORS[subj] || SUBJECT_COLORS['Todos'];
          return (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${conf.color}` : '1.5px solid var(--card-border)',
                background: isSelected ? conf.bg : 'var(--card-bg)',
                color: isSelected ? conf.color : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 4px 12px ${conf.color}25` : 'none'
              }}
            >
              {subj}
            </button>
          );
        })}
      </div>

      {/* Grid de Fórmulas */}
      {filteredFormulas.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', borderRadius: '24px', textAlign: 'center', maxWidth: '460px', margin: '0 auto' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            No se encontraron fórmulas que coincidan con "{searchQuery}".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFormulas.map((item) => {
            const conf = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS['Todos'];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ios-glass-card"
                style={{
                  padding: '20px 24px',
                  borderRadius: '22px',
                  border: `1.5px solid ${conf.border}`,
                  background: 'var(--card-bg)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header card: Subject & Topic */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: conf.bg,
                      color: conf.color,
                      fontSize: '0.74rem',
                      fontWeight: 800
                    }}>
                      {item.subject}
                    </span>
                    <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {item.topic}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    CEPREUNSA
                  </span>
                </div>

                {/* Name */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
                  {item.name}
                </h3>

                {/* Formula Highlight Box */}
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(120, 120, 128, 0.07)',
                  border: '1.5px solid var(--card-border)',
                  fontFamily: 'monospace',
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  fontWeight: 900,
                  color: conf.color,
                  letterSpacing: '0.5px',
                  overflowX: 'auto'
                }}>
                  {item.formula}
                </div>

                {/* Variables list */}
                {item.vars && item.vars.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-secondary)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Significado de variables:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '6px' }}>
                      {item.vars.map((v, vIdx) => (
                        <div key={vIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(120,120,128,0.05)', padding: '5px 10px', borderRadius: '10px' }}>
                          <strong style={{ color: conf.color, minWidth: '32px' }}>{v.symbol}:</strong>
                          <span style={{ color: 'var(--text-main)' }}>{v.desc}</span>
                          {v.unit && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>[{v.unit}]</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical note */}
                {item.note && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    fontSize: '0.80rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.45
                  }}>
                    <Info size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#D97706' }}>Nota clave: </strong>
                      {item.note}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormularioPage;
