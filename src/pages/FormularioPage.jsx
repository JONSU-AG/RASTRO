import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Calculator,
  Atom,
  Compass,
  Zap,
  Info,
  Copy,
  Check,
  Star,
  Printer,
  Sparkles,
  AlertTriangle,
  Grid,
  ListFilter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  FlaskConical,
  Pi,
  Activity,
  Flame
} from 'lucide-react';

// ==========================================
// DATASET CANÓNICO DE FÓRMULAS PREUNIVERSITARIAS
// ==========================================
const FORMULAS_CANONICAS = [
  // --- FÍSICA ---
  {
    id: 'fis_ohm',
    subject: 'Física',
    topic: 'Electrodinámica',
    importance: 'Fija Frecuente',
    name: 'Ley de Ohm',
    latex: 'V = I \\cdot R',
    plain: 'V = I * R',
    desc: 'La diferencia de potencial a través de un conductor óhmico es directamente proporcional a la intensidad de corriente que circula por él.',
    despejes: [
      { name: 'Intensidad (I)', latex: 'I = \\frac{V}{R}' },
      { name: 'Resistencia (R)', latex: 'R = \\frac{V}{I}' }
    ],
    vars: [
      { symbol: 'V', name: 'Diferencia de Potencial (Voltaje)', unit: 'Voltios [V]' },
      { symbol: 'I', name: 'Intensidad de Corriente Eléctrica', unit: 'Amperios [A]' },
      { symbol: 'R', name: 'Resistencia Eléctrica', unit: 'Ohmios [\\Omega]' }
    ],
    fijaUnsa: 'En conductores óhmicos la resistencia permanece constante. En una gráfica V vs I, la pendiente de la recta representa numéricamente el valor de la resistencia R.',
    calcType: 'ohm'
  },
  {
    id: 'fis_potencia_joule',
    subject: 'Física',
    topic: 'Electrodinámica',
    importance: 'Fija Frecuente',
    name: 'Potencia Eléctrica y Efecto Joule',
    latex: 'P = V \\cdot I = I^2 R = \\frac{V^2}{R} \\quad;\\quad Q = 0.24 \\cdot I^2 R \\cdot t',
    plain: 'P = V * I = I^2 * R = V^2 / R ; Q = 0.24 * I^2 * R * t',
    desc: 'Tasa de transferencia de energía eléctrica disipada en forma de calor por unidad de tiempo a través de un elemento resistivo.',
    despejes: [
      { name: 'Corriente desde Potencia', latex: 'I = \\sqrt{\\frac{P}{R}}' },
      { name: 'Voltaje desde Potencia', latex: 'V = \\sqrt{P \\cdot R}' },
      { name: 'Energía en Joules', latex: 'E = P \\cdot t = I^2 R t' }
    ],
    vars: [
      { symbol: 'P', name: 'Potencia Eléctrica', unit: 'Watts [W]' },
      { symbol: 'Q', name: 'Calor Disipado (Efecto Joule)', unit: 'Calorías [cal]' },
      { symbol: 't', name: 'Tiempo transcurrido', unit: 'Segundos [s]' },
      { symbol: '0.24', name: 'Equivalente calorífico', unit: 'cal / Joule' }
    ],
    fijaUnsa: 'Ojo con las unidades: Si la pregunta pide calor en CALORÍAS, multiplica la energía en Joules por 0.24. Si te piden energía en Joules, simplemente calcula E = P * t.',
    calcType: 'potencia'
  },
  {
    id: 'fis_pouillet',
    subject: 'Física',
    topic: 'Electrodinámica',
    importance: 'Alta Probabilidad',
    name: 'Resistencia de un Conductor (Ley de Pouillet)',
    latex: 'R = \\rho \\cdot \\frac{L}{A}',
    plain: 'R = rho * (L / A)',
    desc: 'La resistencia de un conductor homogéneo depende de la resistividad de su material, directamente de su longitud e inversamente de su área transversal.',
    despejes: [
      { name: 'Longitud del Conductor', latex: 'L = \\frac{R \\cdot A}{\\rho}' },
      { name: 'Área Transversal', latex: 'A = \\rho \\cdot \\frac{L}{R}' }
    ],
    vars: [
      { symbol: 'R', name: 'Resistencia del hilo', unit: 'Ohmios [\\Omega]' },
      { symbol: '\\rho', name: 'Resistividad eléctrica del material', unit: '\\Omega \\cdot m' },
      { symbol: 'L', name: 'Longitud del conductor', unit: 'Metros [m]' },
      { symbol: 'A', name: 'Área de la sección transversal', unit: 'Metros cuadrados [m^2]' }
    ],
    fijaUnsa: 'Clásica de UNSA: Si un alambre se estira al doble de su longitud (L\' = 2L) sin pérdida de masa, su volumen es constante, por lo que su área se reduce a la mitad (A\' = A/2). ¡Su nueva resistencia se cuadruplica (R\' = 4R)!',
    calcType: null
  },
  {
    id: 'fis_mru',
    subject: 'Física',
    topic: 'Cinemática',
    importance: 'Fija Frecuente',
    name: 'Movimiento Rectilíneo Uniforme (MRU)',
    latex: 'd = v \\cdot t \\quad;\\quad t_e = \\frac{d}{v_1 + v_2} \\quad;\\quad t_a = \\frac{d}{v_1 - v_2}',
    plain: 'd = v * t ; t_e = d / (v1 + v2) ; t_a = d / (v1 - v2)',
    desc: 'Movimiento con trayectoria recta y velocidad vectorial estrictamente constante (aceleración nula).',
    despejes: [
      { name: 'Velocidad Constante', latex: 'v = \\frac{d}{t}' },
      { name: 'Tiempo Transcurrido', latex: 't = \\frac{d}{v}' },
      { name: 'Tiempo de Encuentro', latex: 't_e = \\frac{d}{v_1 + v_2}' },
      { name: 'Tiempo de Alcance (v1 > v2)', latex: 't_a = \\frac{d}{v_1 - v_2}' }
    ],
    vars: [
      { symbol: 'd', name: 'Distancia recorrida', unit: 'Metros [m]' },
      { symbol: 'v', name: 'Rapidez constante', unit: 'm / s' },
      { symbol: 't', name: 'Tiempo de recorrido', unit: 'Segundos [s]' },
      { symbol: 't_e, t_a', name: 'Tiempos de encuentro y alcance', unit: 'Segundos [s]' }
    ],
    fijaUnsa: 'Conversión rápida obligatoria en UNSA: Para convertir km/h a m/s, multiplica por 5/18. Para pasar de m/s a km/h, multiplica por 18/5.',
    calcType: 'mru'
  },
  {
    id: 'fis_mruv',
    subject: 'Física',
    topic: 'Cinemática',
    importance: 'Fija Frecuente',
    name: 'Movimiento Variado (MRUV)',
    latex: 'v_f = v_0 \\pm a t \\quad;\\quad d = v_0 t \\pm \\frac{1}{2} a t^2 \\quad;\\quad v_f^2 = v_0^2 \\pm 2 a d',
    plain: 'vf = v0 +- a*t ; d = v0*t +- 0.5*a*t^2 ; vf^2 = v0^2 +- 2*a*d',
    desc: 'Movimiento rectilíneo con aceleración tangencial constante. La velocidad varía de forma uniforme respecto al tiempo.',
    despejes: [
      { name: 'Distancia con Velocidad Media', latex: 'd = \\left(\\frac{v_0 + v_f}{2}\\right) t' },
      { name: 'Aceleración', latex: 'a = \\frac{v_f - v_0}{t}' },
      { name: 'Distancia en el n-ésimo segundo', latex: 'd_n = v_0 \\pm \\frac{a}{2}(2n - 1)' }
    ],
    vars: [
      { symbol: 'v_0', name: 'Velocidad inicial', unit: 'm / s' },
      { symbol: 'v_f', name: 'Velocidad final', unit: 'm / s' },
      { symbol: 'a', name: 'Aceleración constante', unit: 'm / s^2' },
      { symbol: 'd', name: 'Distancia recorrida', unit: 'Metros [m]' },
      { symbol: 'd_n', name: 'Distancia en el enésimo segundo', unit: 'Metros [m]' }
    ],
    fijaUnsa: 'Convención de signos: Usa (+) si el móvil acelera (a favor de la velocidad). Usa (-) si el móvil frena o desacelera. Si parte del reposo: v0 = 0. Si se detiene: vf = 0.',
    calcType: 'mruv'
  },
  {
    id: 'fis_mvcl',
    subject: 'Física',
    topic: 'Cinemática',
    importance: 'Fija Frecuente',
    name: 'Caída Libre Vertical (MVCL)',
    latex: 'v_f = v_0 \\pm g t \\quad;\\quad h = v_0 t \\pm \\frac{1}{2} g t^2 \\quad;\\quad H_{\\max} = \\frac{v_0^2}{2g}',
    plain: 'vf = v0 +- g*t ; h = v0*t +- 0.5*g*t^2 ; Hmax = v0^2 / (2g)',
    desc: 'Movimiento vertical bajo la acción exclusiva de la gravedad terrestre, despreciando la resistencia del aire.',
    despejes: [
      { name: 'Tiempo de Subida', latex: 't_{\\text{sub}} = \\frac{v_0}{g}' },
      { name: 'Tiempo de Vuelo Total', latex: 't_{\\text{vuelo}} = \\frac{2v_0}{g}' },
      { name: 'Velocidad Final al Cuadrado', latex: 'v_f^2 = v_0^2 \\pm 2 g h' }
    ],
    vars: [
      { symbol: 'h', name: 'Altura vertical', unit: 'Metros [m]' },
      { symbol: 'g', name: 'Aceleración gravitatoria (g = 9.8 o 10)', unit: 'm / s^2' },
      { symbol: 'H_{\\max}', name: 'Altura máxima alcanzada', unit: 'Metros [m]' },
      { symbol: 't_{\\text{sub}}', name: 'Tiempo en alcanzar altura máxima', unit: 'Segundos [s]' }
    ],
    fijaUnsa: 'En la cúspide (altura máxima), la velocidad vertical instantánea es CERO (v = 0). A un mismo nivel horizontal, la rapidez de subida es exactamente igual a la rapidez de bajada.',
    calcType: null
  },
  {
    id: 'fis_mpcl',
    subject: 'Física',
    topic: 'Cinemática',
    importance: 'Alta Probabilidad',
    name: 'Movimiento Parabólico de Caída Libre (MPCL)',
    latex: 'x = (v_0 \\cos\\theta) t \\quad;\\quad y = (v_0 \\sin\\theta) t - \\frac{1}{2} g t^2 \\quad;\\quad R_{\\max} = \\frac{v_0^2 \\sin(2\\theta)}{g}',
    plain: 'x = v0*cos(theta)*t ; y = v0*sin(theta)*t - 0.5*g*t^2 ; Rmax = v0^2*sin(2*theta)/g',
    desc: 'Composición ortogonal de un MRU horizontal y un MVCL vertical sin rozamiento del aire.',
    despejes: [
      { name: 'Altura Máxima', latex: 'H_{\\max} = \\frac{(v_0 \\sin\\theta)^2}{2g}' },
      { name: 'Tiempo de Vuelo', latex: 't_{\\text{vuelo}} = \\frac{2 v_0 \\sin\\theta}{g}' },
      { name: 'Ecuación de la Trayectoria', latex: 'y = x \\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta}' }
    ],
    vars: [
      { symbol: 'v_0', name: 'Rapidez de disparo', unit: 'm / s' },
      { symbol: '\\theta', name: 'Ángulo de elevación sobre la horizontal', unit: 'Grados [^\\circ]' },
      { symbol: 'R_{\\max}', name: 'Alcance horizontal total', unit: 'Metros [m]' },
      { symbol: 'H_{\\max}', name: 'Altura máxima', unit: 'Metros [m]' }
    ],
    fijaUnsa: 'Propiedades de oro: El alcance horizontal es MÁXIMO cuando el ángulo de tiro es 45°. Dos ángulos complementarios (alfa + beta = 90°) lanzados con la misma rapidez logran el mismo alcance horizontal.',
    calcType: null
  },
  {
    id: 'fis_newton2',
    subject: 'Física',
    topic: 'Dinámica',
    importance: 'Fija Frecuente',
    name: 'Segunda Ley de Newton y Peso',
    latex: 'F_r = m \\cdot a \\quad;\\quad W = m \\cdot g',
    plain: 'Fr = m * a ; W = m * g',
    desc: 'Toda fuerza neta no equilibrada que actúa sobre un cuerpo le imprime una aceleración directamente proporcional a dicha fuerza y en su misma dirección.',
    despejes: [
      { name: 'Aceleración', latex: 'a = \\frac{F_r}{m} = \\frac{\\sum F_{\\text{favor}} - \\sum F_{\\text{contra}}}{m}' },
      { name: 'Masa Inercial', latex: 'm = \\frac{F_r}{a}' }
    ],
    vars: [
      { symbol: 'F_r', name: 'Fuerza resultante total', unit: 'Newtons [N]' },
      { symbol: 'm', name: 'Masa del cuerpo', unit: 'Kilogramos [kg]' },
      { symbol: 'a', name: 'Aceleración adquirida', unit: 'm / s^2' },
      { symbol: 'W', name: 'Fuerza de gravedad o Peso', unit: 'Newtons [N]' }
    ],
    fijaUnsa: 'La aceleración y la fuerza resultante tienen SIEMPRE la misma dirección y el mismo sentido. No confundir masa (kg, constante) con peso (N, depende de la gravedad local g).',
    calcType: 'newton'
  },
  {
    id: 'fis_rozamiento',
    subject: 'Física',
    topic: 'Dinámica',
    importance: 'Alta Probabilidad',
    name: 'Fuerza de Rozamiento (Fricción)',
    latex: 'f_s^{\\max} = \\mu_s \\cdot N \\quad;\\quad f_k = \\mu_k \\cdot N \\quad;\\quad (\\mu_s > \\mu_k)',
    plain: 'fs_max = mu_s * N ; fk = mu_k * N',
    desc: 'Fuerza opositora al deslizamiento relativo entre dos superficies ásperas en contacto.',
    despejes: [
      { name: 'Coeficiente de Fricción', latex: '\\mu = \\frac{f}{N}' },
      { name: 'Fuerza Normal en plano horizontal', latex: 'N = m \\cdot g' },
      { name: 'Fuerza Normal en plano inclinado', latex: 'N = m \\cdot g \\cdot \\cos\\theta' }
    ],
    vars: [
      { symbol: 'f_s^{\\max}', name: 'Rozamiento estático máximo', unit: 'Newtons [N]' },
      { symbol: 'f_k', name: 'Rozamiento cinético (en movimiento)', unit: 'Newtons [N]' },
      { symbol: '\\mu_s, \\mu_k', name: 'Coeficientes estático y cinético', unit: 'Adimensional' },
      { symbol: 'N', name: 'Fuerza de reacción normal', unit: 'Newtons [N]' }
    ],
    fijaUnsa: 'Siempre se cumple que mu_s > mu_k. Si el bloque no resbala, la fuerza de rozamiento estático es menor o igual al máximo y se equilibra con la fuerza actuante aplicada.',
    calcType: null
  },
  {
    id: 'fis_trabajo_energia',
    subject: 'Física',
    topic: 'Trabajo y Energía',
    importance: 'Fija Frecuente',
    name: 'Trabajo Mecánico y Conservación de Energía',
    latex: 'W = F \\cdot d \\cos\\theta \\quad;\\quad E_c = \\frac{1}{2} m v^2 \\quad;\\quad E_{pg} = m g h \\quad;\\quad E_m = E_c + E_p',
    plain: 'W = F*d*cos(theta) ; Ec = 0.5*m*v^2 ; Epg = m*g*h ; Em = Ec + Ep',
    desc: 'Transformación y conservación de la energía mecánica en sistemas conservativos y disipativos.',
    despejes: [
      { name: 'Energía Elástica de Resorte', latex: 'E_{pe} = \\frac{1}{2} k x^2' },
      { name: 'Teorema del Trabajo y Energía', latex: 'W_{\\text{neto}} = \\Delta E_c = E_{c_f} - E_{c_0}' },
      { name: 'Trabajo de Fuerzas No Conservativas', latex: 'W_{f_k} = E_{m_f} - E_{m_0}' }
    ],
    vars: [
      { symbol: 'W', name: 'Trabajo mecánico', unit: 'Joules [J]' },
      { symbol: 'E_c', name: 'Energía Cinética', unit: 'Joules [J]' },
      { symbol: 'E_{pg}', name: 'Energía Potencial Gravitatoria', unit: 'Joules [J]' },
      { symbol: 'k, x', name: 'Constante elástica y deformación', unit: 'N/m, Metros [m]' }
    ],
    fijaUnsa: 'Si la fuerza aplicada es perpendicular al desplazamiento (theta = 90°), el trabajo mecánico es CERO (cos 90° = 0), como ocurre con la fuerza centrípeta o la normal en plano horizontal.',
    calcType: null
  },
  {
    id: 'fis_hidrostatica',
    subject: 'Física',
    topic: 'Hidrostática',
    importance: 'Fija Frecuente',
    name: 'Presión Hidrostática y Principio de Arquímedes',
    latex: 'P_h = \\rho_L \\cdot g \\cdot h \\quad;\\quad P_{\\text{total}} = P_{\\text{atm}} + P_h \\quad;\\quad E = \\rho_L \\cdot g \\cdot V_{\\text{sum}}',
    plain: 'Ph = rho * g * h ; Ptotal = Patm + Ph ; E = rho * g * Vsum',
    desc: 'Leyes que rigen los fluidos incompresibles en reposo, presión a profundidad y fuerza de flotación.',
    despejes: [
      { name: 'Profundidad desde Presión', latex: 'h = \\frac{P_h}{\\rho_L \\cdot g}' },
      { name: 'Volumen Sumergido en Flotación', latex: '\\frac{V_{\\text{sum}}}{V_{\\text{total}}} = \\frac{\\rho_{\\text{cuerpo}}}{\\rho_L}' },
      { name: 'Prensa Hidráulica (Pascal)', latex: '\\frac{F_1}{A_1} = \\frac{F_2}{A_2}' }
    ],
    vars: [
      { symbol: 'P_h', name: 'Presión hidrostática pura', unit: 'Pascales [Pa]' },
      { symbol: '\\rho_L', name: 'Densidad del líquido (Agua = 1000)', unit: 'kg / m^3' },
      { symbol: 'E', name: 'Empuje hidrostático vertical', unit: 'Newtons [N]' },
      { symbol: 'V_{\\text{sum}}', name: 'Volumen de la fracción sumergida', unit: 'Metros cúbicos [m^3]' }
    ],
    fijaUnsa: 'Cuidado con presión total vs hidrostática: Presión total = Patm + Ph. La presión atmosférica típica a nivel del mar es 101.3 kPa (o 10^5 Pa). El empuje solo depende de la densidad del LÍQUIDO, no del cuerpo.',
    calcType: null
  },
  {
    id: 'fis_coulomb',
    subject: 'Física',
    topic: 'Electrostática',
    importance: 'Fija Frecuente',
    name: 'Ley de Coulomb y Campo Eléctrico',
    latex: 'F_e = k \\cdot \\frac{|q_1 \\cdot q_2|}{d^2} \\quad;\\quad E = k \\cdot \\frac{|Q|}{d^2} \\quad;\\quad V = k \\cdot \\frac{Q}{d}',
    plain: 'Fe = k * |q1 * q2| / d^2 ; E = k * |Q| / d^2 ; V = k * Q / d',
    desc: 'Interacción electrostática entre cargas puntuales en reposo en el vacío.',
    despejes: [
      { name: 'Fuerza sobre carga de prueba', latex: 'F_e = q_0 \\cdot E' },
      { name: 'Distancia entre Cargas', latex: 'd = \\sqrt{k \\cdot \\frac{|q_1 q_2|}{F_e}}' }
    ],
    vars: [
      { symbol: 'k', name: 'Constante electrostática (9 x 10^9)', unit: 'N \\cdot m^2 / C^2' },
      { symbol: 'q_1, q_2', name: 'Cargas eléctricas puntuales', unit: 'Coulombs [C]' },
      { symbol: 'd', name: 'Distancia de separación', unit: 'Metros [m]' },
      { symbol: 'E', name: 'Intensidad de campo eléctrico', unit: 'N / C o V / m' }
    ],
    fijaUnsa: 'La fuerza varía con el inverso del cuadrado de la distancia: si duplicas la distancia de separación (2d), la fuerza se divide entre cuatro (F/4). Convierte microcoulombs a Coulombs: 1 microC = 10^-6 C.',
    calcType: null
  },

  // --- QUÍMICA ---
  {
    id: 'qui_gases_ideales',
    subject: 'Química',
    topic: 'Gases Ideales',
    importance: 'Fija Frecuente',
    name: 'Ecuación Universal de los Gases Ideales',
    latex: 'P \\cdot V = n \\cdot R \\cdot T \\quad;\\quad P \\cdot \\bar{M} = \\rho \\cdot R \\cdot T',
    plain: 'P * V = n * R * T ; P * M_molar = rho * R * T',
    desc: 'Relación termodinámica de estado para sustancias gaseosas en régimen ideal a bajas presiones y altas temperaturas.',
    despejes: [
      { name: 'Moles de Gas (n)', latex: 'n = \\frac{P \\cdot V}{R \\cdot T} = \\frac{m}{\\bar{M}}' },
      { name: 'Masa Molar del Gas', latex: '\\bar{M} = \\frac{m \\cdot R \\cdot T}{P \\cdot V}' },
      { name: 'Densidad del Gas', latex: '\\rho = \\frac{P \\cdot \\bar{M}}{R \\cdot T}' }
    ],
    vars: [
      { symbol: 'P', name: 'Presión absoluta del gas', unit: 'atm o mmHg' },
      { symbol: 'V', name: 'Volumen del recipiente', unit: 'Litros [L]' },
      { symbol: 'n', name: 'Cantidad de sustancia en moles', unit: 'Moles [mol]' },
      { symbol: 'R', name: 'Constante (0.082 si atm, 62.4 si mmHg)', unit: 'atm\\cdot L / (mol\\cdot K)' },
      { symbol: 'T', name: 'Temperatura absoluta (T = °C + 273)', unit: 'Kelvin [K]' }
    ],
    fijaUnsa: '¡La temperatura SIEMPRE va en Kelvin (K = °C + 273)! En Condiciones Normales (C.N.: P = 1 atm, T = 0 °C = 273 K), 1 mol de CUALQUIER gas ideal ocupa exactamente 22.4 Litros.',
    calcType: 'gas'
  },
  {
    id: 'qui_ley_combinada',
    subject: 'Química',
    topic: 'Gases Ideales',
    importance: 'Fija Frecuente',
    name: 'Ley General de los Gases (Combinada)',
    latex: '\\frac{P_1 \\cdot V_1}{T_1} = \\frac{P_2 \\cdot V_2}{T_2}',
    plain: '(P1 * V1) / T1 = (P2 * V2) / T2',
    desc: 'Transformación de masa constante de gas ideal entre dos estados de equilibrio termodinámico.',
    despejes: [
      { name: 'Boyle-Mariotte (T = cte)', latex: 'P_1 \\cdot V_1 = P_2 \\cdot V_2' },
      { name: 'Charles (P = cte)', latex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}' },
      { name: 'Gay-Lussac (V = cte)', latex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}' }
    ],
    vars: [
      { symbol: 'P_1, P_2', name: 'Presiones inicial y final', unit: 'atm o mmHg' },
      { symbol: 'V_1, V_2', name: 'Volúmenes inicial y final', unit: 'Litros o mL' },
      { symbol: 'T_1, T_2', name: 'Temperaturas absolutas', unit: 'Kelvin [K]' }
    ],
    fijaUnsa: 'Mnemotecnia clásica para los tres procesos restringidos: "Boyle es T-onto (T=cte), Charles P-ato (P=cte), Gay-Lussac V-iejo (V=cte)".',
    calcType: null
  },
  {
    id: 'qui_molaridad_normalidad',
    subject: 'Química',
    topic: 'Soluciones Químicas',
    importance: 'Fija Frecuente',
    name: 'Molaridad, Normalidad y Relación Directa',
    latex: 'M = \\frac{n_{\\text{soluto}}}{V_{\\text{sol}}(L)} = \\frac{m_{\\text{sto}}}{\\bar{M} \\cdot V_{(L)}} \\quad;\\quad N = M \\cdot \\theta',
    plain: 'M = n / V_litros ; N = M * theta ; M = (10 * D * %P) / MasaMolar',
    desc: 'Unidades químicas de concentración que cuantifican la proporción de soluto disuelto en una solución acuosa.',
    despejes: [
      { name: 'Relación con Densidad y Pureza', latex: 'M = \\frac{10 \\cdot D \\cdot \\%P}{\\bar{M}}' },
      { name: 'Masa de Soluto', latex: 'm_{\\text{sto}} = M \\cdot \\bar{M} \\cdot V_{(L)}' }
    ],
    vars: [
      { symbol: 'M', name: 'Molaridad de la solución', unit: 'mol / L o M' },
      { symbol: 'N', name: 'Normalidad de la solución', unit: 'Eq-g / L o N' },
      { symbol: '\\theta', name: 'Parámetro de valencia del compuesto', unit: 'Adimensional' },
      { symbol: 'D', name: 'Densidad de la solución', unit: 'g / mL' },
      { symbol: '\\%P', name: 'Porcentaje en masa de soluto', unit: '%' }
    ],
    fijaUnsa: 'Mnemotecnia "No Me Olvides": N = M * theta. Para calcular theta: En Ácidos = cantidad de H+ reemplazables. En Hidróxidos = cantidad de OH-. En Sales = carga total del catión metálico.',
    calcType: null
  },
  {
    id: 'qui_dilucion',
    subject: 'Química',
    topic: 'Soluciones Químicas',
    importance: 'Alta Probabilidad',
    name: 'Dilución y Neutralización de Soluciones',
    latex: 'C_1 \\cdot V_1 = C_2 \\cdot V_2 \\quad;\\quad N_{\\text{ácido}} \\cdot V_{\\text{ácido}} = N_{\\text{base}} \\cdot V_{\\text{base}}',
    plain: 'C1 * V1 = C2 * V2 ; Nacido * Vacido = Nbase * Vbase',
    desc: 'Conservación de los moles de soluto al añadir disolvente, y balance de equivalentes gramo en reacciones de neutralización.',
    despejes: [
      { name: 'Concentración de Mezcla', latex: 'C_{\\text{mezcla}} = \\frac{C_1 V_1 + C_2 V_2}{V_1 + V_2}' },
      { name: 'Volumen de Agua Añadido', latex: 'V_{\\text{agua}} = V_2 - V_1' }
    ],
    vars: [
      { symbol: 'C_1, C_2', name: 'Concentraciones inicial y final', unit: 'M o N' },
      { symbol: 'V_1, V_2', name: 'Volúmenes de solución', unit: 'mL o L' }
    ],
    fijaUnsa: 'En dilución, la cantidad de soluto puro NO varía, únicamente aumenta el volumen de solvente (agua). En neutralización se requiere que los reactivos estén expresados en Normalidad (N).',
    calcType: null
  },
  {
    id: 'qui_atomo',
    subject: 'Química',
    topic: 'Estructura Atómica',
    importance: 'Fija Frecuente',
    name: 'Número de Masa, Carga y Regla del PEZ',
    latex: 'A = Z + n^0 \\quad;\\quad q = Z - e^- \\quad;\\quad (\\text{Átomo Neutro: } Z = p^+ = e^-)',
    plain: 'A = Z + n ; q = Z - e ; En neutro: Z = p = e',
    desc: 'Relación cuantitativa entre las partículas subatómicas fundamentales en núcleos atómicos y especies iónicas.',
    despejes: [
      { name: 'Neutrones', latex: 'n^0 = A - Z' },
      { name: 'Electrones en un Ión', latex: 'e^- = Z - q' }
    ],
    vars: [
      { symbol: 'A', name: 'Número de masa (nucleones fundamentales)', unit: 'Entero' },
      { symbol: 'Z', name: 'Número atómico (carga nuclear / protones)', unit: 'Entero' },
      { symbol: 'n^0', name: 'Cantidad de neutrones en el núcleo', unit: 'Entero' },
      { symbol: 'q', name: 'Carga neta (catión +, anión -)', unit: 'Entero' }
    ],
    fijaUnsa: 'Catión (+): perdió electrones, por tanto e- = Z - carga. Anión (-): ganó electrones, por tanto e- = Z + |carga|. ¡El número de protones Z jamás cambia en procesos químicos!',
    calcType: null
  },
  {
    id: 'qui_ph',
    subject: 'Química',
    topic: 'Ácidos y Bases',
    importance: 'Alta Probabilidad',
    name: 'Potencial de Hidrógeno (pH y pOH)',
    latex: 'pH = -\\log[H^+] \\quad;\\quad pOH = -\\log[OH^-] \\quad;\\quad pH + pOH = 14',
    plain: 'pH = -log[H+] ; pOH = -log[OH-] ; pH + pOH = 14',
    desc: 'Escala logarítmica que mide la acidez o basicidad de una solución acuosa a 25 °C.',
    despejes: [
      { name: 'Concentración de H+', latex: '[H^+] = 10^{-pH}' },
      { name: 'Concentración de OH-', latex: '[OH^-] = 10^{-pOH}' },
      { name: 'Producto Iónico del Agua', latex: '[H^+][OH^-] = 10^{-14}' }
    ],
    vars: [
      { symbol: 'pH', name: 'Potencial de hidrógeno (0 a 14)', unit: 'Adimensional' },
      { symbol: '[H^+]', name: 'Concentración molar de protones', unit: 'mol / L' },
      { symbol: '[OH^-]', name: 'Concentración molar de hidroxilos', unit: 'mol / L' }
    ],
    fijaUnsa: 'A 25 °C: Solución ácida tiene pH < 7. Solución neutra tiene pH = 7. Solución alcalina o básica tiene pH > 7. Si [H+] = 10^-3 M, entonces el pH es 3 y su pOH es 11.',
    calcType: null
  },

  // --- ÁLGEBRA ---
  {
    id: 'alg_productos_notables',
    subject: 'Álgebra',
    topic: 'Productos Notables',
    importance: 'Fija Frecuente',
    name: 'Identidades Fundamentales y Legendre',
    latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2 \\quad;\\quad (a+b)^2 + (a-b)^2 = 2(a^2 + b^2)',
    plain: '(a +- b)^2 = a^2 +- 2ab + b^2 ; (a+b)^2 + (a-b)^2 = 2(a^2 + b^2)',
    desc: 'Multiplicaciones algebraicas con forma canónica prefijada que se escriben directamente sin efectuar paso a paso.',
    despejes: [
      { name: 'Segunda de Legendre', latex: '(a+b)^2 - (a-b)^2 = 4ab' },
      { name: 'Diferencia de Cuadrados', latex: '(a+b)(a-b) = a^2 - b^2' },
      { name: 'Suma de Cubos', latex: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2)' },
      { name: 'Diferencia de Cubos', latex: 'a^3 - b^3 = (a-b)(a^2 + ab + b^2)' }
    ],
    vars: [
      { symbol: 'a, b', name: 'Términos algebraicos cualesquiera', unit: 'Polinomio' },
      { symbol: '4ab', name: 'Resultado de la resta de cuadrados de suma y diferencia', unit: 'Identidad' }
    ],
    fijaUnsa: 'Condicional de oro CEPREUNSA: Si a + b + c = 0, se cumple automáticamente que a^3 + b^3 + c^3 = 3abc, y que a^2 + b^2 + c^2 = -2(ab + bc + ca). ¡Aparece en 4 de cada 5 exámenes!',
    calcType: null
  },
  {
    id: 'alg_cuadratica',
    subject: 'Álgebra',
    topic: 'Ecuaciones Cuadráticas',
    importance: 'Fija Frecuente',
    name: 'Fórmula Cuadrática y Teorema de Cardano',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad;\\quad \\Delta = b^2 - 4ac',
    plain: 'x = (-b +- sqrt(b^2 - 4ac)) / (2a) ; Delta = b^2 - 4ac',
    desc: 'Resolución de ecuaciones de segundo grado de la forma ax² + bx + c = 0 (a ≠ 0) y relaciones entre sus raíces.',
    despejes: [
      { name: 'Suma de Raíces (Cardano)', latex: 'x_1 + x_2 = -\\frac{b}{a}' },
      { name: 'Producto de Raíces (Cardano)', latex: 'x_1 \\cdot x_2 = \\frac{c}{a}' },
      { name: 'Diferencia de Raíces', latex: '|x_1 - x_2| = \\frac{\\sqrt{\\Delta}}{|a|}' },
      { name: 'Reconstrucción de la Ecuación', latex: 'x^2 - Sx + P = 0' }
    ],
    vars: [
      { symbol: 'a, b, c', name: 'Coeficientes de ax^2 + bx + c = 0', unit: 'Reales' },
      { symbol: '\\Delta', name: 'Discriminante (b^2 - 4ac)', unit: 'Real' },
      { symbol: 'x_1, x_2', name: 'Raíces o soluciones de la ecuación', unit: 'Complejos' }
    ],
    fijaUnsa: 'Naturaleza de raíces: Si Delta > 0 hay 2 raíces reales y diferentes. Si Delta = 0 hay raíz real doble (Trinomio Cuadrado Perfecto). Si Delta < 0 las raíces son números complejos conjugados.',
    calcType: 'cuadratica'
  },
  {
    id: 'alg_exponentes',
    subject: 'Álgebra',
    topic: 'Teoría de Exponentes',
    importance: 'Fija Frecuente',
    name: 'Leyes de Exponentes y Radicales',
    latex: 'a^m \\cdot a^n = a^{m+n} \\quad;\\quad \\frac{a^m}{a^n} = a^{m-n} \\quad;\\quad (a^m)^n = a^{m \\cdot n} \\quad;\\quad \\sqrt[n]{a^m} = a^{\\frac{m}{n}}',
    plain: 'a^m * a^n = a^(m+n) ; a^m / a^n = a^(m-n) ; (a^m)^n = a^(m*n) ; sqrt[n](a^m) = a^(m/n)',
    desc: 'Propiedades operacionales fundamentales que rigen la potenciación y radicación en el cuerpo de los números reales.',
    despejes: [
      { name: 'Exponente Negativo', latex: 'a^{-n} = \\frac{1}{a^n} \\quad (a \\ne 0)' },
      { name: 'Exponente Cero', latex: 'a^0 = 1 \\quad (a \\ne 0)' },
      { name: 'Radical de un Producto', latex: '\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}' }
    ],
    vars: [
      { symbol: 'a, b', name: 'Bases no nulas', unit: 'Reales' },
      { symbol: 'm, n', name: 'Exponentes e índices radicales', unit: 'Enteros / Racionales' }
    ],
    fijaUnsa: 'Trampa recurrente: (a^m)^n NO es igual a a^(m^n). En potencia de potencia con paréntesis se multiplican: (x^3)^4 = x^12. En exponente de exponente en cadena: x^(3^4) = x^81.',
    calcType: null
  },
  {
    id: 'alg_logaritmos',
    subject: 'Álgebra',
    topic: 'Logaritmos',
    importance: 'Fija Frecuente',
    name: 'Propiedades Fundamentales de Logaritmos',
    latex: '\\log_b(A \\cdot B) = \\log_b A + \\log_b B \\quad;\\quad \\log_b\\left(\\frac{A}{B}\\right) = \\log_b A - \\log_b B',
    plain: 'log_b(A*B) = log_b(A) + log_b(B) ; log_b(A/B) = log_b(A) - log_b(B)',
    desc: 'Función inversa de la exponencial que calcula el exponente al que debe elevarse la base b para obtener el argumento A.',
    despejes: [
      { name: 'Regla del Sombrero (Potencia)', latex: '\\log_b(A^n) = n \\log_b A' },
      { name: 'Cambio de Base', latex: '\\log_b A = \\frac{\\log_c A}{\\log_c b}' },
      { name: 'Regla de la Cadena', latex: '\\log_b a \\cdot \\log_c b \\cdot \\log_d c = \\log_d a' },
      { name: 'Exponente Fraccionario en Base y Argumento', latex: '\\log_{b^m}(A^n) = \\frac{n}{m} \\log_b A' }
    ],
    vars: [
      { symbol: 'b', name: 'Base del logaritmo (b > 0, b ≠ 1)', unit: 'Real' },
      { symbol: 'A, B', name: 'Argumentos del logaritmo (A > 0, B > 0)', unit: 'Reales Positivos' }
    ],
    fijaUnsa: 'Condición de existencia indispensable en exámenes: Para que log_b(A) exista en R, el argumento debe ser estrictamente positivo (A > 0) y la base debe ser positiva y diferente de 1 (b > 0, b ≠ 1).',
    calcType: null
  },
  {
    id: 'alg_progresiones',
    subject: 'Álgebra',
    topic: 'Progresiones',
    importance: 'Alta Probabilidad',
    name: 'Progresiones Aritméticas y Geométricas',
    latex: 'a_n = a_1 + (n-1)d \\quad;\\quad S_n = \\frac{n(a_1 + a_n)}{2} \\quad;\\quad t_n = t_1 \\cdot q^{n-1}',
    plain: 'an = a1 + (n-1)*d ; Sn = n*(a1+an)/2 ; tn = t1 * q^(n-1)',
    desc: 'Sucesiones ordenadas de números con razón constante por adición (P.A.) o por multiplicación (P.G.).',
    despejes: [
      { name: 'Suma de Términos P.G. Finita', latex: 'S_n = \\frac{t_1 (q^n - 1)}{q - 1}' },
      { name: 'Suma Límite P.G. Infinita (|q| < 1)', latex: 'S_\\infty = \\frac{t_1}{1 - q}' },
      { name: 'Razón Aritmética', latex: 'd = \\frac{a_n - a_1}{n - 1}' }
    ],
    vars: [
      { symbol: 'a_1, t_1', name: 'Primer término de la progresión', unit: 'Real' },
      { symbol: 'd, q', name: 'Razones aritmética y geométrica', unit: 'Reales' },
      { symbol: 'n', name: 'Cantidad total de términos', unit: 'Entero Positivo' },
      { symbol: 'S_\\infty', name: 'Suma infinita decreciente convergente', unit: 'Real' }
    ],
    fijaUnsa: 'En CEPREUNSA la suma de progresiones geométricas infinitas decrecientes (|q| < 1) siempre se evalúa con S_infinito = t1 / (1 - q). Nunca intentes sumar término a término.',
    calcType: null
  },

  // --- ARITMÉTICA ---
  {
    id: 'ari_porcentajes',
    subject: 'Aritmética',
    topic: 'Tanto por Ciento',
    importance: 'Fija Frecuente',
    name: 'Aplicaciones Comerciales del Porcentaje',
    latex: 'P_v = P_c + G \\quad;\\quad P_v = P_c - P \\quad;\\quad P_v = P_f - D',
    plain: 'Pv = Pc + G ; Pv = Pc - P ; Pv = Pf - D',
    desc: 'Ecuaciones rectoras del comercio que relacionan precio de venta, costo, ganancia bruta, pérdida y descuento al cliente.',
    despejes: [
      { name: 'Ganancia Neta', latex: 'G_N = G_B - \\text{Gastos}' },
      { name: 'Descuento Único para d1 y d2', latex: 'D_u = \\left(1 - \\frac{100 - d_1}{100} \\cdot \\frac{100 - d_2}{100}\\right) \\cdot 100\\%' },
      { name: 'Aumento Único para a1 y a2', latex: 'A_u = \\left(\\frac{100 + a_1}{100} \\cdot \\frac{100 + a_2}{100} - 1\\right) \\cdot 100\\%' }
    ],
    vars: [
      { symbol: 'P_v', name: 'Precio de venta final al público', unit: 'Soles [S/.]' },
      { symbol: 'P_c', name: 'Precio de costo del comerciante', unit: 'Soles [S/.]' },
      { symbol: 'P_f', name: 'Precio fijado o precio de lista', unit: 'Soles [S/.]' },
      { symbol: 'G, P, D', name: 'Ganancia, pérdida y descuento', unit: 'Soles o %' }
    ],
    fijaUnsa: 'Regla canónica de examen: Salvo que el enunciado diga explícitamente lo contrario, la ganancia (G) o pérdida (P) siempre se calcula como un porcentaje del PRECIO DE COSTO (Pc). El descuento (D) siempre se calcula sobre el PRECIO FIJADO (Pf).',
    calcType: 'comercio'
  },
  {
    id: 'ari_promedios',
    subject: 'Aritmética',
    topic: 'Promedios',
    importance: 'Fija Frecuente',
    name: 'Promedios (Aritmético, Geométrico y Armónico)',
    latex: 'MA = \\frac{a + b}{2} \\quad;\\quad MG = \\sqrt{a \\cdot b} \\quad;\\quad MH = \\frac{2ab}{a + b}',
    plain: 'MA = (a+b)/2 ; MG = sqrt(a*b) ; MH = 2ab / (a+b)',
    desc: 'Medidas de tendencia central que representan a un conjunto de cantidades positivas.',
    despejes: [
      { name: 'Desigualdad Fundamental', latex: 'MA \\ge MG \\ge MH' },
      { name: 'Relación para 2 Cantidades', latex: 'MA \\cdot MH = (MG)^2' },
      { name: 'Diferencia de Cuadrados', latex: '(a - b)^2 = 4(MA + MG)(MA - MG)' }
    ],
    vars: [
      { symbol: 'MA', name: 'Media Aritmética (Promedio simple)', unit: 'Magnitud' },
      { symbol: 'MG', name: 'Media Geométrica (Para razones/tasas)', unit: 'Magnitud' },
      { symbol: 'MH', name: 'Media Armónica (Para velocidades/tiempos)', unit: 'Magnitud' }
    ],
    fijaUnsa: 'Para cantidades diferentes positivas se cumple estrictamente MA > MG > MH. Solo si todas las cantidades son exactamente iguales se cumple que MA = MG = MH.',
    calcType: null
  },
  {
    id: 'ari_interes',
    subject: 'Aritmética',
    topic: 'Regla de Interés',
    importance: 'Fija Frecuente',
    name: 'Interés Simple y Monto Compuesto',
    latex: 'I = \\frac{C \\cdot r \\cdot t}{B} \\quad;\\quad M = C + I \\quad;\\quad M = C\\left(1 + \\frac{r}{100}\\right)^t',
    plain: 'I = (C * r * t) / B ; M = C + I ; M = C*(1 + r/100)^t',
    desc: 'Rédito generado por un capital prestado o invertido a una tasa porcentual durante determinado periodo.',
    despejes: [
      { name: 'Base si t está en Años', latex: 'B = 100' },
      { name: 'Base si t está en Meses', latex: 'B = 1200' },
      { name: 'Base si t está en Días comerciales', latex: 'B = 36000' }
    ],
    vars: [
      { symbol: 'I', name: 'Interés simple generado', unit: 'Soles [S/.]' },
      { symbol: 'C', name: 'Capital inicial depositado', unit: 'Soles [S/.]' },
      { symbol: 'r', name: 'Tasa porcentual anual (rédito)', unit: '% anual' },
      { symbol: 't', name: 'Tiempo que dura la imposición', unit: 'Años / Meses / Días' },
      { symbol: 'M', name: 'Monto final total (Capital + Interés)', unit: 'Soles [S/.]' }
    ],
    fijaUnsa: '¡La tasa de interés r% y el tiempo t deben estar en la misma unidad! Si la tasa es mensual, multiplícala por 12 para convertirla en anual. En interés comercial el mes tiene 30 días y el año 360 días.',
    calcType: null
  },
  {
    id: 'ari_regla3',
    subject: 'Aritmética',
    topic: 'Magnitudes Proporcionales',
    importance: 'Alta Probabilidad',
    name: 'Regla de Tres Compuesta (Método de Causa-Efecto)',
    latex: '\\frac{(\\text{Causa}) \\cdot (\\text{Circunstancia})}{(\\text{Efecto})} = \\text{Constante}',
    plain: '(Causa * Circunstancia) / Efecto = Cte',
    desc: 'Método sistemático para resolver problemas de magnitudes múltiples directamente e inversamente proporcionales.',
    despejes: [
      { name: 'Fórmula Expandida', latex: '\\frac{\\text{Obreros} \\cdot \\text{Rendimiento} \\cdot \\text{Días} \\cdot \\text{Horas/d}}{\\text{Obra} \\cdot \\text{Dificultad}} = \\text{Cte}' }
    ],
    vars: [
      { symbol: '\\text{Causa}', name: 'Agentes que realizan el trabajo (obreros, máquinas)', unit: 'Cantidad' },
      { symbol: '\\text{Circunstancia}', name: 'Condiciones de tiempo (días, horas por día, ritmo)', unit: 'Tiempo' },
      { symbol: '\\text{Efecto}', name: 'Resultado del trabajo (obra, zanja, dificultad)', unit: 'Dimensiones' }
    ],
    fijaUnsa: 'Mnemotecnia infalible para no equivocarse con magnitudes directas o inversas: Siempre coloca en el numerador a quienes trabajan y el tiempo, y en el denominador la obra construida y la dificultad.',
    calcType: null
  },
  {
    id: 'ari_mcd_mcm',
    subject: 'Aritmética',
    topic: 'Teoría de Números',
    importance: 'Alta Probabilidad',
    name: 'Propiedad Fundamental de MCD y MCM',
    latex: 'A \\cdot B = \\text{MCD}(A, B) \\cdot \\text{MCM}(A, B)',
    plain: 'A * B = MCD(A, B) * MCM(A, B)',
    desc: 'Propiedad exclusiva para dos números enteros positivos que relaciona su producto con sus divisores y múltiplos comunes.',
    despejes: [
      { name: 'Descomposición Canónica con Factores PESI', latex: 'A = d \\cdot p \\quad;\\quad B = d \\cdot q \\quad (d = \\text{MCD}, p \\text{ y } q \\text{ son PESI})' },
      { name: 'MCM con Factores PESI', latex: '\\text{MCM} = d \\cdot p \\cdot q' }
    ],
    vars: [
      { symbol: 'A, B', name: 'Dos números enteros positivos', unit: 'Enteros' },
      { symbol: '\\text{MCD}', name: 'Máximo Común Divisor', unit: 'Entero' },
      { symbol: '\\text{MCM}', name: 'Mínimo Común Múltiplo', unit: 'Entero' },
      { symbol: 'p, q', name: 'Cofactores primos entre sí (PESI)', unit: 'Enteros' }
    ],
    fijaUnsa: 'Esta fórmula SOLO es válida para 2 números. Si dos números son PESI (primos entre sí), su MCD es 1 y su MCM es directamente el producto de ambos números (A * B).',
    calcType: null
  },

  // --- GEOMETRÍA ---
  {
    id: 'geo_metricas',
    subject: 'Geometría',
    topic: 'Relaciones Métricas',
    importance: 'Fija Frecuente',
    name: 'Relaciones Métricas en Triángulo Rectángulo',
    latex: 'a^2 + b^2 = c^2 \\quad;\\quad h^2 = m \\cdot n \\quad;\\quad a^2 = c \\cdot m \\quad;\\quad a \\cdot b = c \\cdot h',
    plain: 'a^2 + b^2 = c^2 ; h^2 = m*n ; a^2 = c*m ; a*b = c*h ; 1/h^2 = 1/a^2 + 1/b^2',
    desc: 'Teoremas canónicos entre los catetos, hipotenusa, altura y proyecciones ortogonales en un triángulo rectángulo.',
    despejes: [
      { name: 'Inversa de las Alturas', latex: '\\frac{1}{h^2} = \\frac{1}{a^2} + \\frac{1}{b^2}' },
      { name: 'Suma de Proyecciones', latex: 'c = m + n' },
      { name: 'Cateto Opuesto al Cuadrado', latex: 'b^2 = c \\cdot n' }
    ],
    vars: [
      { symbol: 'c', name: 'Hipotenusa del triángulo', unit: 'Unidades [u]' },
      { symbol: 'a, b', name: 'Catetos', unit: 'Unidades [u]' },
      { symbol: 'h', name: 'Altura relativa a la hipotenusa', unit: 'Unidades [u]' },
      { symbol: 'm, n', name: 'Proyecciones ortogonales de los catetos a y b', unit: 'Unidades [u]' }
    ],
    fijaUnsa: 'Teorema de la inversa de alturas: 1/h^2 = 1/a^2 + 1/b^2. ¡Es la favorita de la UNSA para evitar despejes algebraicos largos con raíces cuadradas!',
    calcType: null
  },
  {
    id: 'geo_heron_areas',
    subject: 'Geometría',
    topic: 'Áreas de Regiones Planas',
    importance: 'Fija Frecuente',
    name: 'Fórmula de Herón y Áreas Triangulares',
    latex: 'A = \\frac{b \\cdot h}{2} \\quad;\\quad A = \\sqrt{p(p-a)(p-b)(p-c)} \\quad;\\quad A_{\\text{equilátero}} = \\frac{L^2 \\sqrt{3}}{4}',
    plain: 'A = (b*h)/2 ; A = sqrt(p*(p-a)*(p-b)*(p-c)) ; A_eq = (L^2 * sqrt(3)) / 4',
    desc: 'Cálculo del área de regiones triangulares con base y altura, en función de sus tres lados (Herón) o lado equilátero.',
    despejes: [
      { name: 'Semiperímetro (p)', latex: 'p = \\frac{a + b + c}{2}' },
      { name: 'Con Inradio (r)', latex: 'A = p \\cdot r' },
      { name: 'Con Circunradio (R)', latex: 'A = \\frac{a \\cdot b \\cdot c}{4R}' },
      { name: 'Fórmula Trigonométrica', latex: 'A = \\frac{a \\cdot b \\cdot \\sin\\theta}{2}' }
    ],
    vars: [
      { symbol: 'a, b, c', name: 'Longitudes de los tres lados', unit: 'Unidades [u]' },
      { symbol: 'p', name: 'Semiperímetro del triángulo', unit: 'Unidades [u]' },
      { symbol: 'L', name: 'Lado del triángulo equilátero', unit: 'Unidades [u]' },
      { symbol: 'r, R', name: 'Inradio y Circunradio', unit: 'Unidades [u]' }
    ],
    fijaUnsa: 'Teorema de Poncelet en triángulo rectángulo: La suma de catetos es igual a la hipotenusa más el doble del inradio (a + b = c + 2r).',
    calcType: 'heron'
  },
  {
    id: 'geo_circulo',
    subject: 'Geometría',
    topic: 'Áreas Circulares',
    importance: 'Fija Frecuente',
    name: 'Áreas de Regiones Circulares',
    latex: 'A = \\pi R^2 \\quad;\\quad L_{\\text{circ}} = 2\\pi R \\quad;\\quad A_{\\text{sector}} = \\frac{\\pi R^2 \\theta^\\circ}{360^\\circ}',
    plain: 'A = pi * R^2 ; L = 2*pi*R ; A_sector = (pi * R^2 * theta) / 360',
    desc: 'Determinación de superficies del círculo completo, sector circular, corona y trapecio circular.',
    despejes: [
      { name: 'Corona Circular', latex: 'A_{\\text{corona}} = \\pi (R^2 - r^2)' },
      { name: 'Sector Circular con Ángulo en Radianes', latex: 'A_{\\text{sector}} = \\frac{1}{2} \\theta_{\\text{rad}} R^2' },
      { name: 'Longitud de Arco Circular', latex: 'L_{\\text{arco}} = \\theta_{\\text{rad}} \\cdot R' }
    ],
    vars: [
      { symbol: 'R', name: 'Radio mayor del círculo', unit: 'Unidades [u]' },
      { symbol: 'r', name: 'Radio menor de la corona concéntrica', unit: 'Unidades [u]' },
      { symbol: '\\theta^\\circ', name: 'Ángulo central en grados sexagesimales', unit: 'Grados [^\\circ]' },
      { symbol: '\\pi', name: 'Constante geométrica (\\approx 3.14159)', unit: 'Adimensional' }
    ],
    fijaUnsa: 'Si te dan una cuerda AB tangente a la circunferencia menor en una corona circular, el área de la corona se calcula directamente como: A = pi * (AB / 2)^2.',
    calcType: null
  },
  {
    id: 'geo_espacio',
    subject: 'Geometría',
    topic: 'Geometría del Espacio',
    importance: 'Alta Probabilidad',
    name: 'Volúmenes de Cuerpos Redondos y Sólidos',
    latex: 'V_{\\text{cilindro}} = \\pi R^2 h \\quad;\\quad V_{\\text{cono}} = \\frac{1}{3}\\pi R^2 h \\quad;\\quad V_{\\text{esfera}} = \\frac{4}{3}\\pi R^3',
    plain: 'V_cilindro = pi*R^2*h ; V_cono = (1/3)*pi*R^2*h ; V_esfera = (4/3)*pi*R^3 ; A_esfera = 4*pi*R^2',
    desc: 'Medida del espacio tridimensional ocupado por prismas, cilindros, conos y esferas.',
    despejes: [
      { name: 'Área Superficial de la Esfera', latex: 'A_{\\text{esfera}} = 4\\pi R^2' },
      { name: 'Área Lateral del Cono', latex: 'A_{\\text{lat cono}} = \\pi R g \\quad (g^2 = R^2 + h^2)' },
      { name: 'Volumen de Pirámide Regular', latex: 'V_{\\text{pirámide}} = \\frac{1}{3} A_{\\text{base}} \\cdot h' }
    ],
    vars: [
      { symbol: 'R', name: 'Radio de la base o de la esfera', unit: 'Unidades [u]' },
      { symbol: 'h', name: 'Altura perpendicular del sólido', unit: 'Unidades [u]' },
      { symbol: 'g', name: 'Generatriz del cono', unit: 'Unidades [u]' }
    ],
    fijaUnsa: 'Relación histórica de Arquímedes: Para un cono, una semiesfera y un cilindro con el mismo radio y altura (h = R), sus volúmenes están exactamente en la proporción 1 : 2 : 3.',
    calcType: null
  },

  // --- TRIGONOMETRÍA ---
  {
    id: 'tri_sistemas',
    subject: 'Trigonometría',
    topic: 'Sistemas Angulares',
    importance: 'Fija Frecuente',
    name: 'Relación Canónica entre Sistemas Angulares',
    latex: '\\frac{S}{180} = \\frac{C}{200} = \\frac{R}{\\pi} \\implies S = 9k \\quad;\\quad C = 10k \\quad;\\quad R = \\frac{\\pi k}{20}',
    plain: 'S/180 = C/200 = R/pi ==> S = 9k, C = 10k, R = (pi*k)/20',
    desc: 'Equivalencia cuantitativa entre los sistemas sexagesimal (inglés), centesimal (francés) y radial (internacional).',
    despejes: [
      { name: 'Diferencia Directa', latex: 'C - S = k' },
      { name: 'Suma Directa', latex: 'C + S = 19k' },
      { name: 'Relación Simplificada S y C', latex: '\\frac{S}{9} = \\frac{C}{10}' }
    ],
    vars: [
      { symbol: 'S', name: 'Número de grados sexagesimales', unit: 'Grados [^\\circ]' },
      { symbol: 'C', name: 'Número de grados centesimales', unit: 'Grados [^g]' },
      { symbol: 'R', name: 'Número de radianes', unit: 'Radianes [rad]' },
      { symbol: 'k', name: 'Factor constante de escala', unit: 'Constante' }
    ],
    fijaUnsa: 'Regla de oro: En cualquier ejercicio de simplificación algebraica con S, C y R, reemplaza directamente: S = 9k, C = 10k y R = (pi * k) / 20. ¡La constante k siempre se simplificará!',
    calcType: 'angular'
  },
  {
    id: 'tri_identidades',
    subject: 'Trigonometría',
    topic: 'Identidades Fundamentales',
    importance: 'Fija Frecuente',
    name: 'Identidades Pitagóricas, Recíprocas y Auxiliares',
    latex: '\\sin^2 x + \\cos^2 x = 1 \\quad;\\quad 1 + \\tan^2 x = \\sec^2 x \\quad;\\quad 1 + \\cot^2 x = \\csc^2 x',
    plain: 'sin^2(x) + cos^2(x) = 1 ; 1 + tan^2(x) = sec^2(x) ; 1 + cot^2(x) = csc^2(x)',
    desc: 'Igualdades trigonométricas válidas para todo valor admisible del ángulo x.',
    despejes: [
      { name: 'Identidad Auxiliar Producto', latex: '\\sec^2 x + \\csc^2 x = \\sec^2 x \\cdot \\csc^2 x' },
      { name: 'Suma Tangente y Cotangente', latex: '\\tan x + \\cot x = \\sec x \\cdot \\csc x' },
      { name: 'Cuarta Potencia', latex: '\\sin^4 x + \\cos^4 x = 1 - 2\\sin^2 x \\cos^2 x' },
      { name: 'Sexta Potencia', latex: '\\sin^6 x + \\cos^6 x = 1 - 3\\sin^2 x \\cos^2 x' }
    ],
    vars: [
      { symbol: 'x', name: 'Ángulo trigonométrico cualquiera', unit: 'rad o °' },
      { symbol: '\\sin, \\cos, \\tan', name: 'Razones trigonométricas directas', unit: 'Adimensional' }
    ],
    fijaUnsa: 'Propiedad clave en CEPREUNSA: Si sec(x) + tan(x) = p, entonces automáticamente sec(x) - tan(x) = 1/p. Igualmente: csc(x) + cot(x) = m ==> csc(x) - cot(x) = 1/m.',
    calcType: null
  },
  {
    id: 'tri_compuestos',
    subject: 'Trigonometría',
    topic: 'Ángulos Compuestos',
    importance: 'Fija Frecuente',
    name: 'Razones Trigonométricas de Ángulos Compuestos',
    latex: '\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B \\quad;\\quad \\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B',
    plain: 'sin(A +- B) = sinA*cosB +- cosA*sinB ; cos(A +- B) = cosA*cosB -+ sinA*sinB',
    desc: 'Desarrollo analítico de razones para la suma o diferencia de dos ángulos independientes.',
    despejes: [
      { name: 'Tangente de la Suma y Diferencia', latex: '\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A \\tan B}' },
      { name: 'Producto Senos', latex: '\\sin(A+B)\\sin(A-B) = \\sin^2 A - \\sin^2 B' },
      { name: 'Identidades de Legendre Trigonométricas', latex: '\\sin^2(A+B) + \\cos^2(A+B) = 1' }
    ],
    vars: [
      { symbol: 'A, B', name: 'Ángulos independientes', unit: 'Grados o Rad' }
    ],
    fijaUnsa: 'Cuidado con los signos del coseno: cos(A + B) tiene signo MENOS en el centro (cosA cosB - sinA sinB). Y cos(A - B) tiene signo MÁS. ¡El 30% de los errores en examen provienen de este cambio de signo!',
    calcType: null
  },
  {
    id: 'tri_doble',
    subject: 'Trigonometría',
    topic: 'Ángulo Doble',
    importance: 'Fija Frecuente',
    name: 'Ángulo Doble y Fórmulas de Degradación',
    latex: '\\sin 2x = 2\\sin x \\cos x \\quad;\\quad \\cos 2x = \\cos^2 x - \\sin^2 x = 1 - 2\\sin^2 x = 2\\cos^2 x - 1',
    plain: 'sin(2x) = 2*sin(x)*cos(x) ; cos(2x) = cos^2(x) - sin^2(x)',
    desc: 'Expresión de las razones trigonométricas del arco duplo en términos de las funciones del arco simple.',
    despejes: [
      { name: 'Degradación de Seno Cuadrado', latex: '2\\sin^2 x = 1 - \\cos 2x' },
      { name: 'Degradación de Coseno Cuadrado', latex: '2\\cos^2 x = 1 + \\cos 2x' },
      { name: 'Tangente del Doble', latex: '\\tan 2x = \\frac{2\\tan x}{1 - \\tan^2 x}' }
    ],
    vars: [
      { symbol: 'x', name: 'Arco o ángulo simple', unit: 'rad o °' },
      { symbol: '2x', name: 'Arco o ángulo doble', unit: 'rad o °' }
    ],
    fijaUnsa: 'Las fórmulas de degradación (2 sin^2 x = 1 - cos 2x) son indispensables en la UNSA para simplificar expresiones bajo radicales y eliminar exponentes pares de senos y cosenos.',
    calcType: null
  },
  {
    id: 'tri_ley_senos_cosenos',
    subject: 'Trigonometría',
    topic: 'Triángulos Oblicuángulos',
    importance: 'Fija Frecuente',
    name: 'Ley de Senos y Ley de Cosenos',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R \\quad;\\quad a^2 = b^2 + c^2 - 2bc \\cos A',
    plain: 'a/sin(A) = b/sin(B) = c/sin(C) = 2R ; a^2 = b^2 + c^2 - 2bc*cos(A)',
    desc: 'Teoremas fundamentales para la resolución métrica de cualquier triángulo oblicuángulo.',
    despejes: [
      { name: 'Coseno de un Ángulo Despejado', latex: '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}' },
      { name: 'Área Trigonométrica', latex: '\\text{Área} = \\frac{a \\cdot b \\cdot \\sin C}{2}' }
    ],
    vars: [
      { symbol: 'a, b, c', name: 'Lados del triángulo oblicuángulo', unit: 'Unidades [u]' },
      { symbol: 'A, B, C', name: 'Ángulos opuestos respectivos', unit: 'Grados [^\\circ]' },
      { symbol: 'R', name: 'Radio de la circunferencia circunscrita', unit: 'Unidades [u]' }
    ],
    fijaUnsa: '¿Cuándo usar cuál? Usa Ley de Senos cuando conozcas un lado y su ángulo opuesto más cualquier otro dato. Usa Ley de Cosenos cuando conozcas dos lados y el ángulo comprendido entre ellos, o los tres lados del triángulo.',
    calcType: null
  }
];

// ==========================================
// CONFIGURACIÓN DE COLORES Y TEMAS POR MATERIA
// ==========================================
const SUBJECT_THEMES = {
  'Todos': {
    name: 'Todos',
    icon: Atom,
    primary: '#38BDF8',
    secondary: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    bgBadge: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
    glow: 'rgba(56, 189, 248, 0.25)'
  },
  'Física': {
    name: 'Física',
    icon: Zap,
    primary: '#38BDF8',
    secondary: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    bgBadge: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.4)',
    glow: 'rgba(56, 189, 248, 0.3)'
  },
  'Química': {
    name: 'Química',
    icon: FlaskConical,
    primary: '#10B981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    bgBadge: 'rgba(16, 185, 129, 0.14)',
    border: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.3)'
  },
  'Álgebra': {
    name: 'Álgebra',
    icon: Activity,
    primary: '#A855F7',
    secondary: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    bgBadge: 'rgba(168, 85, 247, 0.14)',
    border: 'rgba(168, 85, 247, 0.4)',
    glow: 'rgba(168, 85, 247, 0.3)'
  },
  'Aritmética': {
    name: 'Aritmética',
    icon: Calculator,
    primary: '#F59E0B',
    secondary: '#D97706',
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    bgBadge: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.4)',
    glow: 'rgba(245, 158, 11, 0.3)'
  },
  'Geometría': {
    name: 'Geometría',
    icon: Compass,
    primary: '#F43F5E',
    secondary: '#E11D48',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)',
    bgBadge: 'rgba(244, 63, 94, 0.14)',
    border: 'rgba(244, 63, 94, 0.4)',
    glow: 'rgba(244, 63, 94, 0.3)'
  },
  'Trigonometría': {
    name: 'Trigonometría',
    icon: Pi,
    primary: '#06B6D4',
    secondary: '#0891B2',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
    bgBadge: 'rgba(6, 182, 212, 0.14)',
    border: 'rgba(6, 182, 212, 0.4)',
    glow: 'rgba(6, 182, 212, 0.3)'
  }
};

// ==========================================
// HELPER PARA RENDERIZAR KATEX DE FORMA SEGURA
// ==========================================
const renderMath = (latexStr, displayMode = true) => {
  if (!latexStr) return null;
  try {
    const html = katex.renderToString(latexStr, {
      displayMode,
      throwOnError: false
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (e) {
    return <code style={{ fontFamily: 'monospace', color: '#FDE047' }}>{latexStr}</code>;
  }
};

// ==========================================
// SUBCOMPONENTE DE MINI-CALCULADORA OPERACIONAL
// ==========================================
const MiniCalculator = ({ type, themeColor }) => {
  // Estados para cada tipo
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleCalc = () => {
    try {
      if (type === 'ohm') {
        const v = parseFloat(inputs.v);
        const i = parseFloat(inputs.i);
        const r = parseFloat(inputs.r);
        if (!isNaN(i) && !isNaN(r)) {
          setResult({ label: 'Voltaje (V)', val: (i * r).toFixed(2), unit: 'V' });
        } else if (!isNaN(v) && !isNaN(r) && r !== 0) {
          setResult({ label: 'Corriente (I)', val: (v / r).toFixed(2), unit: 'A' });
        } else if (!isNaN(v) && !isNaN(i) && i !== 0) {
          setResult({ label: 'Resistencia (R)', val: (v / i).toFixed(2), unit: 'Ω' });
        }
      } else if (type === 'mru') {
        const d = parseFloat(inputs.d);
        const v = parseFloat(inputs.v);
        const t = parseFloat(inputs.t);
        if (!isNaN(v) && !isNaN(t)) {
          setResult({ label: 'Distancia (d)', val: (v * t).toFixed(2), unit: 'm' });
        } else if (!isNaN(d) && !isNaN(t) && t !== 0) {
          setResult({ label: 'Velocidad (v)', val: (d / t).toFixed(2), unit: 'm/s' });
        } else if (!isNaN(d) && !isNaN(v) && v !== 0) {
          setResult({ label: 'Tiempo (t)', val: (d / v).toFixed(2), unit: 's' });
        }
      } else if (type === 'newton') {
        const m = parseFloat(inputs.m);
        const a = parseFloat(inputs.a);
        const f = parseFloat(inputs.f);
        if (!isNaN(m) && !isNaN(a)) {
          setResult({ label: 'Fuerza Neta (Fr)', val: (m * a).toFixed(2), unit: 'N' });
        } else if (!isNaN(f) && !isNaN(m) && m !== 0) {
          setResult({ label: 'Aceleración (a)', val: (f / m).toFixed(2), unit: 'm/s²' });
        } else if (!isNaN(f) && !isNaN(a) && a !== 0) {
          setResult({ label: 'Masa (m)', val: (f / a).toFixed(2), unit: 'kg' });
        }
      } else if (type === 'cuadratica') {
        const a = parseFloat(inputs.a);
        const b = parseFloat(inputs.b);
        const c = parseFloat(inputs.c);
        if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) {
          const delta = b * b - 4 * a * c;
          if (delta > 0) {
            const x1 = (-b + Math.sqrt(delta)) / (2 * a);
            const x2 = (-b - Math.sqrt(delta)) / (2 * a);
            setResult({
              label: 'Δ = ' + delta.toFixed(2) + ' (Reales y distintas)',
              val: `x₁ = ${x1.toFixed(2)}  |  x₂ = ${x2.toFixed(2)}`,
              unit: ''
            });
          } else if (delta === 0) {
            const x = -b / (2 * a);
            setResult({ label: 'Δ = 0 (Raíz doble real)', val: `x₁ = x₂ = ${x.toFixed(2)}`, unit: '' });
          } else {
            const real = (-b / (2 * a)).toFixed(2);
            const imag = (Math.sqrt(-delta) / (2 * a)).toFixed(2);
            setResult({
              label: 'Δ < 0 (Complejas conjugadas)',
              val: `${real} ± ${imag} i`,
              unit: ''
            });
          }
        }
      } else if (type === 'gas') {
        const p = parseFloat(inputs.p);
        const v = parseFloat(inputs.v);
        const n = parseFloat(inputs.n);
        const tC = parseFloat(inputs.tC);
        const T = !isNaN(tC) ? tC + 273 : NaN;
        const R = 0.082;
        if (!isNaN(n) && !isNaN(T) && !isNaN(v) && v !== 0) {
          const pCalc = (n * R * T) / v;
          setResult({ label: 'Presión calculada', val: pCalc.toFixed(2), unit: 'atm' });
        } else if (!isNaN(p) && !isNaN(n) && !isNaN(T) && p !== 0) {
          const vCalc = (n * R * T) / p;
          setResult({ label: 'Volumen calculado', val: vCalc.toFixed(2), unit: 'L' });
        } else if (!isNaN(p) && !isNaN(v) && !isNaN(T) && T !== 0) {
          const nCalc = (p * v) / (R * T);
          setResult({ label: 'Moles calculados', val: nCalc.toFixed(3), unit: 'mol' });
        }
      } else if (type === 'heron') {
        const a = parseFloat(inputs.a);
        const b = parseFloat(inputs.b);
        const c = parseFloat(inputs.c);
        if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
          const p = (a + b + c) / 2;
          const radicando = p * (p - a) * (p - b) * (p - c);
          if (radicando > 0) {
            const area = Math.sqrt(radicando);
            setResult({ label: `Semiperímetro p = ${p.toFixed(2)} u`, val: `Área = ${area.toFixed(2)}`, unit: 'u²' });
          } else {
            setResult({ label: 'Error geométrico', val: 'Lados no forman triángulo', unit: '' });
          }
        }
      } else if (type === 'comercio') {
        const pc = parseFloat(inputs.pc);
        const pct = parseFloat(inputs.pct);
        if (!isNaN(pc) && !isNaN(pct)) {
          const g = pc * (pct / 100);
          const pv = pc + g;
          setResult({ label: `Ganancia = S/. ${g.toFixed(2)}`, val: `Precio de Venta (Pv) = S/. ${pv.toFixed(2)}`, unit: '' });
        }
      } else if (type === 'angular') {
        const s = parseFloat(inputs.s);
        if (!isNaN(s)) {
          const c = (s * 10) / 9;
          const rPi = (s / 180).toFixed(3);
          setResult({ label: `Centesimales: ${c.toFixed(2)}ᵍ`, val: `Radianes: ${rPi} π rad`, unit: '' });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '14px',
        borderRadius: '14px',
        background: 'rgba(2, 6, 23, 0.75)',
        border: `1px dashed ${themeColor}40`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, color: themeColor }}>
        <Calculator size={14} />
        <span>SIMULADOR / CALCULADORA OPERACIONAL EN VIVO</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {type === 'ohm' && (
          <>
            <input
              type="number"
              placeholder="V (Voltios)"
              value={inputs.v || ''}
              onChange={e => setInputs({ ...inputs, v: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="I (Amperios)"
              value={inputs.i || ''}
              onChange={e => setInputs({ ...inputs, i: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="R (Ohmios)"
              value={inputs.r || ''}
              onChange={e => setInputs({ ...inputs, r: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'mru' && (
          <>
            <input
              type="number"
              placeholder="d (metros)"
              value={inputs.d || ''}
              onChange={e => setInputs({ ...inputs, d: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="v (m/s)"
              value={inputs.v || ''}
              onChange={e => setInputs({ ...inputs, v: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="t (segundos)"
              value={inputs.t || ''}
              onChange={e => setInputs({ ...inputs, t: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'newton' && (
          <>
            <input
              type="number"
              placeholder="Fr (Newtons)"
              value={inputs.f || ''}
              onChange={e => setInputs({ ...inputs, f: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="m (kg)"
              value={inputs.m || ''}
              onChange={e => setInputs({ ...inputs, m: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="a (m/s²)"
              value={inputs.a || ''}
              onChange={e => setInputs({ ...inputs, a: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'cuadratica' && (
          <>
            <input
              type="number"
              placeholder="a (coef x²)"
              value={inputs.a || ''}
              onChange={e => setInputs({ ...inputs, a: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="b (coef x)"
              value={inputs.b || ''}
              onChange={e => setInputs({ ...inputs, b: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="c (término ind.)"
              value={inputs.c || ''}
              onChange={e => setInputs({ ...inputs, c: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'gas' && (
          <>
            <input
              type="number"
              placeholder="P (atm)"
              value={inputs.p || ''}
              onChange={e => setInputs({ ...inputs, p: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="V (Litros)"
              value={inputs.v || ''}
              onChange={e => setInputs({ ...inputs, v: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="n (moles)"
              value={inputs.n || ''}
              onChange={e => setInputs({ ...inputs, n: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="T (°Celsius)"
              value={inputs.tC || ''}
              onChange={e => setInputs({ ...inputs, tC: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'heron' && (
          <>
            <input
              type="number"
              placeholder="Lado a"
              value={inputs.a || ''}
              onChange={e => setInputs({ ...inputs, a: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="Lado b"
              value={inputs.b || ''}
              onChange={e => setInputs({ ...inputs, b: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="Lado c"
              value={inputs.c || ''}
              onChange={e => setInputs({ ...inputs, c: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'comercio' && (
          <>
            <input
              type="number"
              placeholder="Precio Costo S/."
              value={inputs.pc || ''}
              onChange={e => setInputs({ ...inputs, pc: e.target.value })}
              className="formula-calc-input"
            />
            <input
              type="number"
              placeholder="% Ganancia (ej: 25)"
              value={inputs.pct || ''}
              onChange={e => setInputs({ ...inputs, pct: e.target.value })}
              className="formula-calc-input"
            />
          </>
        )}

        {type === 'angular' && (
          <input
            type="number"
            placeholder="Grados Sexagesimales S (°)"
            value={inputs.s || ''}
            onChange={e => setInputs({ ...inputs, s: e.target.value })}
            className="formula-calc-input"
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleCalc}
          style={{
            padding: '7px 16px',
            borderRadius: '10px',
            background: themeColor,
            color: '#0F172A',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: `0 2px 10px ${themeColor}40`
          }}
        >
          Calcular Resultado
        </button>

        {result && (
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: themeColor }}>{result.label}:</span>
            <span style={{ color: '#FDE047', background: 'rgba(253, 224, 71, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
              {result.val} {result.unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL: FORMULARIOPAGE
// ==========================================
export const FormularioPage = () => {
  const navigate = useNavigate();

  // Estados de control
  const [selectedSubject, setSelectedSubject] = useState('Todos');
  const [selectedTopic, setSelectedTopic] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('detallado'); // 'detallado' | 'bolsillo' | 'favoritas'
  const [activeCalcId, setActiveCalcId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('rastro_formulas_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Guardar favoritos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rastro_formulas_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Extraer lista de temas dinámicos según materia seleccionada
  const availableTopics = useMemo(() => {
    const list = ['Todos'];
    FORMULAS_CANONICAS.forEach(f => {
      if (selectedSubject === 'Todos' || f.subject === selectedSubject) {
        if (!list.includes(f.topic)) {
          list.push(f.topic);
        }
      }
    });
    return list;
  }, [selectedSubject]);

  // Si cambia la materia y el tema no existe en ella, resetear a 'Todos'
  useEffect(() => {
    if (!availableTopics.includes(selectedTopic)) {
      setSelectedTopic('Todos');
    }
  }, [selectedSubject, availableTopics, selectedTopic]);

  // Filtrado reactivo de fórmulas
  const filteredFormulas = useMemo(() => {
    return FORMULAS_CANONICAS.filter(item => {
      // Filtro modo favoritas
      if (viewMode === 'favoritas' && !favorites.includes(item.id)) {
        return false;
      }

      // Filtro materia
      const matchSubject = selectedSubject === 'Todos' || item.subject === selectedSubject;

      // Filtro tema
      const matchTopic = selectedTopic === 'Todos' || item.topic === selectedTopic;

      // Filtro buscador
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.latex.toLowerCase().includes(q) ||
        item.plain.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.fijaUnsa && item.fijaUnsa.toLowerCase().includes(q)) ||
        (item.vars && item.vars.some(v => v.name.toLowerCase().includes(q) || v.symbol.toLowerCase().includes(q)));

      return matchSubject && matchTopic && matchSearch;
    });
  }, [selectedSubject, selectedTopic, searchQuery, viewMode, favorites]);

  // Conteo por materia
  const countsBySubject = useMemo(() => {
    const map = { 'Todos': FORMULAS_CANONICAS.length };
    FORMULAS_CANONICAS.forEach(f => {
      map[f.subject] = (map[f.subject] || 0) + 1;
    });
    return map;
  }, []);

  const currentTheme = SUBJECT_THEMES[selectedSubject] || SUBJECT_THEMES['Todos'];

  return (
    <div
      className="formulario-master-container"
      style={{
        minHeight: '100vh',
        background: '#0B132B',
        color: '#F8FAFC',
        padding: '0 16px 120px',
        boxSizing: 'border-box'
      }}
    >
      {/* Estilos CSS Scoped para Calculadora y Modo Impresión */}
      <style>{`
        .formula-calc-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(15, 23, 42, 0.9);
          color: #F8FAFC;
          font-size: 0.8rem;
          font-weight: 600;
          box-sizing: border-box;
          outline: none;
        }
        .formula-calc-input:focus {
          border-color: #38BDF8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
        }
        @media print {
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          .no-print, nav, header, .liquid-navbar, button {
            display: none !important;
          }
          .formulario-master-container {
            padding: 0 !important;
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          .formula-card-print {
            border: 1px solid #CCCCCC !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* TOP BAR CON NAVEGACIÓN */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/cursos')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#F8FAFC',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Volver a Cursos
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrint}
              title="Imprimir Ficha de Fórmulas para Repaso Offline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#E2E8F0',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span className="hide-mobile">Imprimir Ficha</span>
            </button>

            <span
              style={{
                fontSize: '0.80rem',
                fontWeight: 800,
                color: currentTheme.primary,
                background: currentTheme.bgBadge,
                border: `1px solid ${currentTheme.border}`,
                padding: '6px 12px',
                borderRadius: '10px'
              }}
            >
              {filteredFormulas.length} Fórmulas Activas
            </span>
          </div>
        </div>

        {/* HERO HEADER: BLUEPRINT CIENTÍFICO DE ALTA FIDELIDAD */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '26px',
            position: 'relative',
            padding: '24px 20px',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 19, 43, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Malla milimétrica tenue de fondo */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38BDF8',
              fontSize: '0.74rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={14} /> COMPENDIO OFICIAL PREUNIVERSITARIO • BANCO UNSA
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Formulario Canónico de Ciencias & Matemáticas
          </h1>

          <p
            style={{
              fontSize: '0.92rem',
              color: '#94A3B8',
              maxWidth: '680px',
              margin: '0 auto 20px',
              lineHeight: 1.55
            }}
          >
            Formato oficial con tipografía matemática <strong style={{ color: '#F8FAFC' }}>KaTeX (LaTeX)</strong>, despejes operacionales de admisión, glosario S.I., trampas de examen y calculadoras en vivo.
          </p>

          {/* BUSCADOR REACTIVO ULTRA NÍTIDO */}
          <div style={{ position: 'relative', maxWidth: '540px', margin: '0 auto' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#38BDF8'
              }}
            />
            <input
              type="text"
              placeholder="Buscar por teorema, variable o ley (ej: Ohm, Herón, MRU, Gases, Cardano)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 48px',
                borderRadius: '16px',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                background: 'rgba(2, 6, 23, 0.9)',
                color: '#FFFFFF',
                fontSize: '0.92rem',
                fontWeight: 600,
                boxSizing: 'border-box',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.6)',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* SELECTOR DE MODO DE VISUALIZACIÓN */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '4px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('detallado')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: viewMode === 'detallado' ? 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)' : 'transparent',
                color: viewMode === 'detallado' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={14} /> Modo Estudio Detallado
            </button>

            <button
              type="button"
              onClick={() => setViewMode('bolsillo')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: viewMode === 'bolsillo' ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' : 'transparent',
                color: viewMode === 'bolsillo' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Grid size={14} /> Ficha de Bolsillo (Rápida)
            </button>

            <button
              type="button"
              onClick={() => setViewMode('favoritas')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: viewMode === 'favoritas' ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' : 'transparent',
                color: viewMode === 'favoritas' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Star size={14} fill={viewMode === 'favoritas' ? '#FFFFFF' : 'none'} /> Mis Guardadas ({favorites.length})
            </button>
          </div>
        </div>

        {/* SELECTOR DE MATERIAS (PILLS CIENTÍFICAS) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '16px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {Object.keys(SUBJECT_THEMES).map(subj => {
            const isSelected = selectedSubject === subj;
            const theme = SUBJECT_THEMES[subj];
            const Icon = theme.icon;
            const count = countsBySubject[subj] || 0;

            return (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 16px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${theme.primary}` : '1.5px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? theme.bgBadge : 'rgba(15, 23, 42, 0.7)',
                  color: isSelected ? theme.primary : '#94A3B8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? `0 4px 14px ${theme.glow}` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} color={isSelected ? theme.primary : '#64748B'} />
                <span>{subj}</span>
                <span
                  style={{
                    fontSize: '0.70rem',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    background: isSelected ? theme.primary : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#0F172A' : '#94A3B8',
                    fontWeight: 900
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUBFILTRO DE TEMAS ESPECÍFICOS */}
        {availableTopics.length > 2 && (
          <div
            className="no-print"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '24px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
              Tema:
            </span>
            {availableTopics.map(topic => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '10px',
                    border: isSelected ? `1px solid ${currentTheme.primary}` : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? currentTheme.primary : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#0F172A' : '#94A3B8',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        )}

        {/* ESTADO VACÍO */}
        {filteredFormulas.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '500px',
              margin: '30px auto'
            }}
          >
            <AlertTriangle size={36} color="#F59E0B" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: '#F8FAFC' }}>
              {viewMode === 'favoritas' ? 'No tienes fórmulas guardadas aún' : 'No se encontraron fórmulas'}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.86rem', margin: 0 }}>
              {viewMode === 'favoritas'
                ? 'Presiona el ícono de la estrella ⭐ en cualquier fórmula para agregarla a tu repaso personal.'
                : `No encontramos coincidencias para "${searchQuery}". Prueba buscando con otro término.`}
            </p>
          </div>
        )}

        {/* RENDERIZADO: MODO 1 - PIZARRA CIENTÍFICA DETALLADA */}
        {viewMode === 'detallado' && filteredFormulas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {filteredFormulas.map(item => {
              const theme = SUBJECT_THEMES[item.subject] || SUBJECT_THEMES['Todos'];
              const isFav = favorites.includes(item.id);
              const isCalcOpen = activeCalcId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="formula-card-print"
                  style={{
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
                    border: `1.5px solid ${theme.border}`,
                    borderRadius: '22px',
                    padding: '22px 24px',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Trama sutil */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `radial-gradient(${theme.primary}12 1px, transparent 1px)`,
                      backgroundSize: '18px 18px',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Header de la tarjeta */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '10px',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '8px',
                            background: theme.bgBadge,
                            color: theme.primary,
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.subject}
                        </span>

                        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>
                          • {item.topic}
                        </span>

                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#F87171',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Flame size={11} /> {item.importance}
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.28rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Acciones: Guardar y Copiar */}
                    <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        title={isFav ? 'Quitar de favoritas' : 'Guardar en favoritas'}
                        style={{
                          background: isFav ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          border: isFav ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          padding: '7px 10px',
                          color: isFav ? '#FBBF24' : '#94A3B8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}
                      >
                        <Star size={14} fill={isFav ? '#FBBF24' : 'none'} />
                        <span className="hide-mobile">{isFav ? 'Guardada' : 'Guardar'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.latex)}
                        title="Copiar código LaTeX oficial"
                        style={{
                          background: copiedId === item.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          border: copiedId === item.id ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          padding: '7px 10px',
                          color: copiedId === item.id ? '#34D399' : '#94A3B8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}
                      >
                        {copiedId === item.id ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                        <span>{copiedId === item.id ? '¡Copiada!' : 'LaTeX'}</span>
                      </button>
                    </div>
                  </div>

                  {/* NIVEL 1: PIZARRA MATEMÁTICA PRINCIPAL CON KATEX */}
                  <div
                    style={{
                      background: 'rgba(2, 6, 23, 0.9)',
                      border: `1.5px solid ${theme.border}`,
                      borderRadius: '16px',
                      padding: '18px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxShadow: `0 4px 24px ${theme.glow}, inset 0 0 20px rgba(0, 0, 0, 0.7)`,
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
                        color: theme.primary,
                        margin: '6px 0',
                        overflowX: 'auto',
                        maxWidth: '100%',
                        padding: '4px 0',
                        filter: `drop-shadow(0 0 10px ${theme.glow})`
                      }}
                    >
                      {renderMath(item.latex, true)}
                    </div>

                    {item.desc && (
                      <p
                        style={{
                          margin: '8px 0 0 0',
                          fontSize: '0.84rem',
                          color: '#94A3B8',
                          lineHeight: 1.5,
                          maxWidth: '92%'
                        }}
                      >
                        {item.desc}
                      </p>
                    )}
                  </div>

                  {/* NIVEL 2: DESPEJES OPERACIONALES DE EXAMEN */}
                  {item.despejes && item.despejes.length > 0 && (
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 900,
                          color: '#C084FC',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={13} color="#C084FC" />
                        <span>NIVEL 2 • DESPEJES OPERACIONALES EVALUADOS EN ADMISIÓN</span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '8px'
                        }}
                      >
                        {item.despejes.map((despeje, dIdx) => (
                          <div
                            key={dIdx}
                            style={{
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(192, 132, 252, 0.25)',
                              borderRadius: '12px',
                              padding: '10px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', color: '#E2E8F0', fontWeight: 800 }}>
                              {despeje.name}
                            </div>
                            <div
                              style={{
                                fontSize: '1.05rem',
                                color: '#E9D5FF',
                                overflowX: 'auto',
                                padding: '2px 0'
                              }}
                            >
                              {renderMath(despeje.latex, false)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NIVEL 3: GLOSARIO DE VARIABLES Y UNIDADES S.I. */}
                  {item.vars && item.vars.length > 0 && (
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 900,
                          color: '#34D399',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <BookOpen size={13} color="#34D399" />
                        <span>NIVEL 3 • NOMENCLATURA DE VARIABLES Y UNIDADES (S.I.)</span>
                      </div>

                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.22)',
                          borderRadius: '14px',
                          padding: '12px 16px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '8px'
                        }}
                      >
                        {item.vars.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '8px',
                              fontSize: '0.80rem'
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'KaTeX_Math', 'Cambria Math', serif",
                                fontWeight: 900,
                                color: '#6EE7B7',
                                fontSize: '0.98rem'
                              }}
                            >
                              {renderMath(v.symbol, false)}:
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{v.name}</span>
                              {v.unit && (
                                <span style={{ color: '#94A3B8', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                                  [{v.unit}]
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NIVEL 4: CLAVE FIJA CEPREUNSA / OJO CON LA TRAMPA */}
                  {item.fijaUnsa && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1.5px solid rgba(239, 68, 68, 0.35)',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div
                          style={{
                            fontSize: '0.70rem',
                            fontWeight: 900,
                            color: '#F87171',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            marginBottom: '3px'
                          }}
                        >
                          CLAVE FIJA CEPREUNSA (TRAMPA FRECUENTE DE ADMISIÓN)
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#FEE2E2', lineHeight: 1.5, fontWeight: 500 }}>
                          {item.fijaUnsa}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TOGGLE CALCULADORA OPERACIONAL */}
                  {item.calcType && (
                    <div className="no-print" style={{ position: 'relative', zIndex: 2 }}>
                      <button
                        type="button"
                        onClick={() => setActiveCalcId(isCalcOpen ? null : item.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: `1px solid ${theme.primary}40`,
                          background: isCalcOpen ? `${theme.primary}20` : 'rgba(255, 255, 255, 0.04)',
                          color: isCalcOpen ? theme.primary : '#E2E8F0',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <Calculator size={15} color={theme.primary} />
                          <span>Calculadora Operacional en Vivo (Probar con Valores)</span>
                        </div>
                        {isCalcOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isCalcOpen && (
                        <MiniCalculator type={item.calcType} themeColor={theme.primary} />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* RENDERIZADO: MODO 2 - FICHA DE BOLSILLO (LAMINATED CHEATSHEET) */}
        {viewMode === 'bolsillo' && filteredFormulas.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: '14px'
            }}
          >
            {filteredFormulas.map(item => {
              const theme = SUBJECT_THEMES[item.subject] || SUBJECT_THEMES['Todos'];
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="formula-card-print"
                  style={{
                    background: 'rgba(15, 23, 42, 0.92)',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: theme.bgBadge,
                          color: theme.primary
                        }}
                      >
                        {item.subject}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>
                        {item.topic}
                      </span>
                    </div>

                    <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star size={13} fill={isFav ? '#F59E0B' : 'none'} color={isFav ? '#F59E0B' : '#64748B'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.latex)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === item.id ? '#10B981' : '#64748B' }}
                      >
                        {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {item.name}
                  </h4>

                  {/* Fórmula KaTeX Compacta */}
                  <div
                    style={{
                      background: 'rgba(2, 6, 23, 0.85)',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontSize: '1.15rem',
                      color: theme.primary,
                      overflowX: 'auto'
                    }}
                  >
                    {renderMath(item.latex, true)}
                  </div>

                  {/* Atajo rápido */}
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', lineHeight: 1.4 }}>
                    <strong style={{ color: '#E2E8F0' }}>Clave rápida: </strong>
                    {item.fijaUnsa.slice(0, 120)}...
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RENDERIZADO: MODO 3 - FAVORITAS (REPASO PERSONAL) */}
        {viewMode === 'favoritas' && filteredFormulas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FDE047',
                fontSize: '0.84rem',
                fontWeight: 700
              }}
            >
              <span>⭐ Estás visualizando tu colección personal de fórmulas guardadas ({filteredFormulas.length})</span>
              <button
                type="button"
                onClick={() => setFavorites([])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F87171',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Vaciar Guardadas
              </button>
            </div>

            {filteredFormulas.map(item => {
              const theme = SUBJECT_THEMES[item.subject] || SUBJECT_THEMES['Todos'];
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(10, 15, 30, 0.98))',
                    border: `1.5px solid ${theme.border}`,
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: theme.primary, fontWeight: 900 }}>
                        {item.subject} • {item.topic}
                      </span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '1.2rem', color: '#FFFFFF' }}>
                        {item.name}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #F59E0B',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        color: '#FBBF24',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '0.74rem'
                      }}
                    >
                      ⭐ Quitar
                    </button>
                  </div>

                  <div
                    style={{
                      background: 'rgba(2, 6, 23, 0.9)',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '14px',
                      padding: '14px',
                      textAlign: 'center',
                      fontSize: '1.35rem',
                      color: theme.primary,
                      overflowX: 'auto'
                    }}
                  >
                    {renderMath(item.latex, true)}
                  </div>

                  {item.fijaUnsa && (
                    <div style={{ fontSize: '0.80rem', color: '#FEE2E2', background: 'rgba(239, 68, 68, 0.12)', padding: '10px 14px', borderRadius: '10px' }}>
                      <strong>Dato clave: </strong> {item.fijaUnsa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioPage;
