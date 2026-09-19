# -*- coding: utf-8 -*-
"""
BASE DE DATOS CANÓNICA DE FÓRMULAS, TEOREMAS Y LEYES FORMALES DE LA UNSA
Estructura pedagógica rigurosa solicitada por el estudiante:
1. Teorema / Fórmula Fundamental (La más simple y reconocible inmediatamente).
2. Despejes Operacionales y Fórmulas Derivadas evaluadas en CEPREUNSA.
3. Glosario Tipográfico de Variables y Unidades S.I.
4. Clave Fija de Examen y Trampas Habituales de Conversión.
"""

FORMULAS_CATALOG = {
    # ==================== FÍSICA ====================
    "analisis_dimensional": {
        "teorema_nombre": "Principio de Homogeneidad Dimensional (Ley de Fourier)",
        "formula_latex": "[A] = [B] + [C] \\implies [A] = [B] = [C]",
        "formula_simple": "[A] = [B] = [C]",
        "descripcion": "Si una ecuación física es dimensionalmente correcta, todos sus términos sumandos deben tener exactamente la misma fórmula dimensional.",
        "despejes": [
            {"nombre": "Ecuación de la Fuerza", "latex": "[F] = M \\cdot L \\cdot T^{-2}"},
            {"nombre": "Ecuación del Trabajo y Energía", "latex": "[W] = [E] = M \\cdot L^2 \\cdot T^{-2}"},
            {"nombre": "Ecuación de la Presión", "latex": "[P] = M \\cdot L^{-1} \\cdot T^{-2}"},
            {"nombre": "Ecuación de la Potencia", "latex": "[Pot] = M \\cdot L^2 \\cdot T^{-3}"},
            {"nombre": "Constante Adimensional", "latex": "[\\text{número}] = [\\sin\\theta] = [\\log x] = 1"}
        ],
        "variables": [
            {"simbolo": "M", "nombre": "Masa fundamental", "unidad": "Kilogramo [kg]"},
            {"simbolo": "L", "nombre": "Longitud fundamental", "unidad": "Metro [m]"},
            {"simbolo": "T", "nombre": "Tiempo fundamental", "unidad": "Segundo [s]"},
            {"simbolo": "\\theta", "nombre": "Temperatura termodinámica", "unidad": "Kelvin [K]"}
        ],
        "fija_unsa": "¡Fija en Admisión! Todo exponente y todo argumento de función trigonométrica o logarítmica es estrictamente ADIMENSIONAL (su dimensión es 1). Igualar el exponente a 1 para despejar la incógnita dimensional."
    },
    "vectores": {
        "teorema_nombre": "Ley de Cosenos Vectorial (Método del Paralelogramo)",
        "formula_latex": "R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta}",
        "formula_simple": "R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta}",
        "descripcion": "Permite calcular el módulo del vector resultante de dos vectores coplanares que forman un ángulo θ entre sí.",
        "despejes": [
            {"nombre": "Resultante Máxima (θ = 0°)", "latex": "R_{\\max} = A + B"},
            {"nombre": "Resultante Mínima (θ = 180°)", "latex": "R_{\\min} = |A - B|"},
            {"nombre": "Vectores Perpendiculares (θ = 90°)", "latex": "R = \\sqrt{A^2 + B^2}"},
            {"nombre": "Vectores Iguales a 120° (A = B, θ = 120°)", "latex": "R = A = B"},
            {"nombre": "Vector Diferencia", "latex": "D = \\sqrt{A^2 + B^2 - 2AB\\cos\\theta}"}
        ],
        "variables": [
            {"simbolo": "R", "nombre": "Módulo del vector resultante", "unidad": "Unidades [u] o Newtons [N]"},
            {"simbolo": "A, B", "nombre": "Módulos de los vectores componentes", "unidad": "Unidades [u] o Newtons [N]"},
            {"simbolo": "\\theta", "nombre": "Ángulo entre los vectores", "unidad": "Grados sexagesimales [°]"}
        ],
        "fija_unsa": "Si R_max = 16 y R_min = 4, suma ambas ecuaciones: 2A = 20 → A = 10 y B = 6. Para 90°, aplica Pitágoras directo: R = √(10² + 6²) = √136 = 2√34."
    },
    "cinematica_mru": {
        "teorema_nombre": "Ecuación Fundamental del Movimiento Rectilíneo Uniforme (MRU)",
        "formula_latex": "d = v \\cdot t",
        "formula_simple": "d = v \\cdot t",
        "descripcion": "En el MRU la velocidad se mantiene estrictamente constante en módulo, dirección y sentido, recorriendo distancias iguales en tiempos iguales.",
        "despejes": [
            {"nombre": "Despeje de Velocidad", "latex": "v = \\frac{d}{t}"},
            {"nombre": "Despeje de Tiempo", "latex": "t = \\frac{d}{v}"},
            {"nombre": "Tiempo de Encuentro", "latex": "t_e = \\frac{d}{v_A + v_B}"},
            {"nombre": "Tiempo de Alcance", "latex": "t_a = \\frac{d}{v_A - v_B} \\quad (v_A > v_B)"},
            {"nombre": "Conversión km/h a m/s", "latex": "1\\text{ km/h} \\times \\frac{5}{18} = 1\\text{ m/s}"}
        ],
        "variables": [
            {"simbolo": "d", "nombre": "Distancia o desplazamiento", "unidad": "Metro [m]"},
            {"simbolo": "v", "nombre": "Velocidad constante", "unidad": "Metro por segundo [m/s]"},
            {"simbolo": "t", "nombre": "Intervalo de tiempo", "unidad": "Segundo [s]"}
        ],
        "fija_unsa": "Para pasar de km/h a m/s multiplica por 5/18 (ejemplo: 72 km/h × 5/18 = 20 m/s). Para pasar de m/s a km/h multiplica por 18/5."
    },
    "cinematica_mruv": {
        "teorema_nombre": "Ecuaciones Horarias del MRUV y Caída Libre",
        "formula_latex": "v_f = v_0 \\pm a \\cdot t",
        "formula_simple": "v_f = v_0 \\pm a \\cdot t",
        "descripcion": "Rige el movimiento de partículas bajo aceleración lineal constante. El signo (+) indica movimiento acelerado y el (-) desacelerado.",
        "despejes": [
            {"nombre": "Distancia en función del tiempo", "latex": "d = v_0 \\cdot t \\pm \\frac{1}{2} a \\cdot t^2"},
            {"nombre": "Velocidad final independiente del tiempo", "latex": "v_f^2 = v_0^2 \\pm 2 a \\cdot d"},
            {"nombre": "Distancia con velocidad media", "latex": "d = \\left(\\frac{v_0 + v_f}{2}\\right) t"},
            {"nombre": "Distancia en el n-ésimo segundo", "latex": "d_n = v_0 \\pm \\frac{1}{2} a (2n - 1)"},
            {"nombre": "Altura máxima en Caída Libre", "latex": "h_{\\max} = \\frac{v_0^2}{2g}, \\quad t_{\\text{subida}} = \\frac{v_0}{g}"}
        ],
        "variables": [
            {"simbolo": "v_0", "nombre": "Velocidad inicial", "unidad": "Metro por segundo [m/s]"},
            {"simbolo": "v_f", "nombre": "Velocidad final", "unidad": "Metro por segundo [m/s]"},
            {"simbolo": "a", "nombre": "Aceleración lineal", "unidad": "Metro por segundo al cuadrado [m/s²]"},
            {"simbolo": "d, h", "nombre": "Distancia o Altura vertical", "unidad": "Metro [m]"},
            {"simbolo": "g", "nombre": "Aceleración de la gravedad", "unidad": "g \\approx 9.8\\text{ m/s}^2 \\text{ o } 10\\text{ m/s}^2"}
        ],
        "fija_unsa": "En caída libre, en el punto más alto la velocidad es CERO (v_f = 0). El tiempo de subida es idéntico al tiempo de bajada para un mismo nivel horizontal de referencia."
    },
    "parabolico": {
        "teorema_nombre": "Composición de Galileo para el Movimiento Parabólico",
        "formula_latex": "x(t) = (v_0\\cos\\theta) t, \\quad y(t) = (v_0\\sin\\theta) t - \\frac{1}{2}gt^2",
        "formula_simple": "x = v_x \\cdot t, \\quad y = v_{0y} \\cdot t - \\frac{1}{2}gt^2",
        "descripcion": "El tiro parabólico es la combinación simultánea e independiente de un MRU horizontal y un MVCL vertical.",
        "despejes": [
            {"nombre": "Tiempo de Vuelo Total", "latex": "t_v = \\frac{2 v_0 \\sin\\theta}{g}"},
            {"nombre": "Altura Máxima Alcanzada", "latex": "H_{\\max} = \\frac{(v_0 \\sin\\theta)^2}{2g}"},
            {"nombre": "Alcance Horizontal Máximo", "latex": "L_{\\max} = \\frac{v_0^2 \\sin(2\\theta)}{g}"},
            {"nombre": "Ángulo de Alcance Máximo", "latex": "\\theta = 45^\\circ \\implies L_{\\max} = 4 H_{\\max}"}
        ],
        "variables": [
            {"simbolo": "v_0", "nombre": "Rapidez inicial de disparo", "unidad": "Metro por segundo [m/s]"},
            {"simbolo": "\\theta", "nombre": "Ángulo de elevación o tiro", "unidad": "Grados [°]"},
            {"simbolo": "H_{\\max}", "nombre": "Altura máxima", "unidad": "Metro [m]"},
            {"simbolo": "L", "nombre": "Alcance horizontal", "unidad": "Metro [m]"}
        ],
        "fija_unsa": "Relación mnemotécnica de oro en UNSA: Tan(θ) = 4·H_max / L. Si dos proyectiles se lanzan con ángulos complementarios (α + β = 90°) y misma rapidez, ¡tienen el mismo alcance horizontal!"
    },
    "estatica": {
        "teorema_nombre": "Condiciones de Equilibrio Mecánico (Primera y Segunda Ley)",
        "formula_latex": "\\sum \\vec{F} = 0, \\quad \\sum \\vec{M}_O = 0",
        "formula_simple": "\\Sigma F_x = 0, \\quad \\Sigma F_y = 0, \\quad \\Sigma M_O = 0",
        "descripcion": "Un cuerpo rígido está en equilibrio estático si la suma vectorial de todas las fuerzas y la suma de momentos respecto a cualquier punto son nulas.",
        "despejes": [
            {"nombre": "Momento de una Fuerza (Torque)", "latex": "M_O = \\pm F \\cdot d"},
            {"nombre": "Teorema de Lamy (3 fuerzas concurrentes)", "latex": "\\frac{F_1}{\\sin\\alpha} = \\frac{F_2}{\\sin\\beta} = \\frac{F_3}{\\sin\\gamma}"},
            {"nombre": "Fuerza Elástica (Ley de Hooke)", "latex": "F_e = k \\cdot x"},
            {"nombre": "Peso de un Cuerpo", "latex": "P = m \\cdot g"}
        ],
        "variables": [
            {"simbolo": "F", "nombre": "Fuerza aplicada", "unidad": "Newton [N]"},
            {"simbolo": "d", "nombre": "Brazo de palanca (distancia perpendicular)", "unidad": "Metro [m]"},
            {"simbolo": "M_O", "nombre": "Momento de torsión o torque", "unidad": "Newton-metro [N·m]"},
            {"simbolo": "k", "nombre": "Constante elástica del resorte", "unidad": "Newton por metro [N/m]"}
        ],
        "fija_unsa": "Signo del momento: Giro antihorario = Positivo (+), Giro horario = Negativo (-). Si la línea de acción de la fuerza pasa por el centro de giro O, el momento es CERO."
    },
    "dinamica": {
        "teorema_nombre": "Segunda Ley de Newton (Ecuación Fundamental de la Dinámica)",
        "formula_latex": "\\vec{F}_{\\text{res}} = m \\cdot \\vec{a}",
        "formula_simple": "F = m \\cdot a",
        "descripcion": "La aceleración que adquiere un cuerpo es directamente proporcional a la fuerza resultante neta e inversamente proporcional a su masa inercial.",
        "despejes": [
            {"nombre": "Aceleración del sistema", "latex": "a = \\frac{\\sum F_{\\text{a favor}} - \\sum F_{\\text{en contra}}}{m_{\\text{total}}}"},
            {"nombre": "Fuerza de Rozamiento Cinético", "latex": "f_k = \\mu_k \\cdot N"},
            {"nombre": "Fuerza de Rozamiento Estático Máximo", "latex": "f_{s\\max} = \\mu_s \\cdot N"},
            {"nombre": "Fuerza Centrípeta en Dinámica Circular", "latex": "F_c = m \\cdot a_c = m \\frac{v^2}{R} = m \\omega^2 R"}
        ],
        "variables": [
            {"simbolo": "F_{\\text{res}}", "nombre": "Fuerza resultante o neta", "unidad": "Newton [N]"},
            {"simbolo": "m", "nombre": "Masa inercial", "unidad": "Kilogramo [kg]"},
            {"simbolo": "a", "nombre": "Aceleración lineal", "unidad": "Metro por segundo al cuadrado [m/s²]"},
            {"simbolo": "\\mu_k, \\mu_s", "nombre": "Coeficientes de rozamiento", "unidad": "Adimensional (\\mu_s > \\mu_k)"},
            {"simbolo": "N", "nombre": "Fuerza Normal del piso", "unidad": "Newton [N]"}
        ],
        "fija_unsa": "Siempre μ_s (estático) es mayor que μ_k (cinético). En un plano inclinado sin rozamiento con ángulo θ, la aceleración de bajada es a = g · sen(θ), independiente de la masa."
    },
    "trabajo_energia": {
        "teorema_nombre": "Teorema del Trabajo y la Energía y Conservación de la Energía Mecánica",
        "formula_latex": "W_{\\text{neto}} = \\Delta E_c = E_{cf} - E_{c0}, \\quad E_{m1} = E_{m2}",
        "formula_simple": "W = F \\cdot d \\cdot \\cos\\theta, \\quad E_m = E_c + E_p",
        "descripcion": "El trabajo mecánico realizado por la fuerza neta equivale a la variación de energía cinética. En ausencia de fuerzas disipativas (rozamiento), la energía mecánica se conserva.",
        "despejes": [
            {"nombre": "Energía Cinética", "latex": "E_c = \\frac{1}{2} m \\cdot v^2"},
            {"nombre": "Energía Potencial Gravitatoria", "latex": "E_{pg} = m \\cdot g \\cdot h"},
            {"nombre": "Energía Potencial Elástica", "latex": "E_{pe} = \\frac{1}{2} k \\cdot x^2"},
            {"nombre": "Potencia Mecánica", "latex": "P = \\frac{W}{t} = F \\cdot v"},
            {"nombre": "Eficiencia o Rendimiento", "latex": "\\eta = \\frac{P_{\\text{útil}}}{P_{\\text{entregada}}} \\times 100\\%"}
        ],
        "variables": [
            {"simbolo": "W", "nombre": "Trabajo mecánico", "unidad": "Joule [J] = N·m"},
            {"simbolo": "E_c, E_p", "nombre": "Energía cinética y potencial", "unidad": "Joule [J]"},
            {"simbolo": "P", "nombre": "Potencia desarrollada", "unidad": "Watt [W] = J/s"},
            {"simbolo": "\\eta", "nombre": "Eficiencia de máquina", "unidad": "Porcentaje [%]"}
        ],
        "fija_unsa": "Si la fuerza es perpendicular al desplazamiento (θ = 90°, cos 90° = 0), ¡el trabajo mecánico es CERO! La fuerza centrípeta y la fuerza normal no realizan trabajo mecánico."
    },
    "hidrostatica": {
        "teorema_nombre": "Principio de Pascal y Principio de Arquímedes (Fluidos)",
        "formula_latex": "P_{\\text{hid}} = \\rho \\cdot g \\cdot h, \\quad E = \\rho_{\\text{líq}} \\cdot g \\cdot V_{\\text{sum}}",
        "formula_simple": "P = \\frac{F}{A}, \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2}",
        "descripcion": "La presión hidrostática aumenta linealmente con la profundidad. Todo cuerpo sumergido experimenta un empuje vertical hacia arriba igual al peso del volumen de líquido desalojado.",
        "despejes": [
            {"nombre": "Presión Absoluta o Total", "latex": "P_{\\text{total}} = P_{\\text{atm}} + \\rho \\cdot g \\cdot h"},
            {"nombre": "Prensa Hidráulica (Pascal)", "latex": "\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_2 = F_1 \\left(\\frac{R_2}{R_1}\\right)^2"},
            {"nombre": "Peso Aparente", "latex": "P_{\\text{aparente}} = P_{\\text{real}} - E"},
            {"nombre": "Densidad y Peso Específico", "latex": "\\rho = \\frac{m}{V}, \\quad \\gamma = \\rho \\cdot g = \\frac{P}{V}"}
        ],
        "variables": [
            {"simbolo": "P", "nombre": "Presión", "unidad": "Pascal [Pa] = N/m²"},
            {"simbolo": "\\rho", "nombre": "Densidad del líquido", "unidad": "kg/m³ (Agua: 1000 kg/m³)"},
            {"simbolo": "E", "nombre": "Fuerza de Empuje de Arquímedes", "unidad": "Newton [N]"},
            {"simbolo": "V_{\\text{sum}}", "nombre": "Volumen de la parte sumergida", "unidad": "Metro cúbico [m³]"}
        ],
        "fija_unsa": "En prensas hidráulicas, si el radio del pistón se duplica (r2 = 2·r1), el área se cuadruplica (A2 = 4·A1) y la fuerza resultante F2 se multiplica por 4."
    },
    "calorimetria": {
        "teorema_nombre": "Ecuación Fundamental del Calor Sensible y Ley de Equilibrio Térmico",
        "formula_latex": "Q = m \\cdot C_e \\cdot \\Delta T, \\quad \\sum Q_{\\text{ganado}} + \\sum Q_{\\text{perdido}} = 0",
        "formula_simple": "Q = m \\cdot C_e \\cdot (T_f - T_0)",
        "descripcion": "Calcula el calor necesario para variar la temperatura de una sustancia sin cambio de estado. En un calorímetro ideal adiabático, el calor ganado iguala al calor perdido.",
        "despejes": [
            {"nombre": "Calor Latente de Cambio de Fase", "latex": "Q_{\\text{fase}} = m \\cdot L"},
            {"nombre": "Fusión del Hielo (a 0 °C)", "latex": "L_f = 80\\text{ cal/g}"},
            {"nombre": "Vaporización del Agua (a 100 °C)", "latex": "L_v = 540\\text{ cal/g}"},
            {"nombre": "Capacidad Calorífica", "latex": "C = m \\cdot C_e = \\frac{Q}{\\Delta T}"},
            {"nombre": "Temperatura de Equilibrio de 2 masas iguales de agua", "latex": "T_e = \\frac{T_1 + T_2}{2}"}
        ],
        "variables": [
            {"simbolo": "Q", "nombre": "Cantidad de calor", "unidad": "Caloría [cal] o Joule [J] (1 cal = 4.186 J)"},
            {"simbolo": "C_e", "nombre": "Calor específico del material", "unidad": "cal/(g·°C) (Agua = 1.0, Hielo = 0.5)"},
            {"simbolo": "\\Delta T", "nombre": "Variación de temperatura", "unidad": "°C o K"},
            {"simbolo": "L", "nombre": "Calor latente de transformación", "unidad": "cal/g"}
        ],
        "fija_unsa": "Durante el cambio de fase (hielo a agua a 0 °C o agua a vapor a 100 °C), ¡la temperatura se mantiene ESTRICTAMENTE CONSTANTE! Usa Q = m·L, nunca apliques m·Ce·ΔT en el cambio de fase."
    },
    "electrostatica": {
        "teorema_nombre": "Ley de Coulomb y Campo Eléctrico",
        "formula_latex": "F = \\frac{k \\cdot |q_1 \\cdot q_2|}{d^2}, \\quad E = \\frac{F}{q} = \\frac{k \\cdot |Q|}{d^2}",
        "formula_simple": "F = \\frac{k \\cdot q_1 \\cdot q_2}{d^2}",
        "descripcion": "La fuerza electrostática entre dos cargas puntuales es directamente proporcional al producto de sus cargas e inversamente proporcional al cuadrado de la distancia que las separa.",
        "despejes": [
            {"nombre": "Potencial Eléctrico Puntual", "latex": "V = \\frac{k \\cdot Q}{d}"},
            {"nombre": "Energía Potencial Electrostática", "latex": "E_{pe} = \\frac{k \\cdot q_1 \\cdot q_2}{d}"},
            {"nombre": "Trabajo de la Fuerza Eléctrica", "latex": "W_{A \\to B} = q (V_A - V_B)"},
            {"nombre": "Relación entre Campo y Potencial en campo uniforme", "latex": "V = E \\cdot d"}
        ],
        "variables": [
            {"simbolo": "k", "nombre": "Constante electrostática en el vacío", "unidad": "9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2"},
            {"simbolo": "q_1, q_2", "nombre": "Cargas eléctricas", "unidad": "Coulomb [C] (1 \\mu\\text{C} = 10^{-6}\\text{ C})"},
            {"simbolo": "d", "nombre": "Distancia de separación", "unidad": "Metro [m]"},
            {"simbolo": "E", "nombre": "Intensidad de campo eléctrico", "unidad": "N/C o V/m"},
            {"simbolo": "V", "nombre": "Potencial eléctrico", "unidad": "Volt [V] = J/C"}
        ],
        "fija_unsa": "Cuidado con los microcoulombs (μC = 10⁻⁶ C) y centímetros a metros (10 cm = 0.1 m = 10⁻¹ m). Al elevar la distancia al cuadrado, (10⁻¹)² = 10⁻² m²."
    },
    "electrocinetica": {
        "teorema_nombre": "Ley de Ohm y Potencia Eléctrica (Efecto Joule)",
        "formula_latex": "V = I \\cdot R, \\quad P = V \\cdot I = I^2 R = \\frac{V^2}{R}",
        "formula_simple": "V = I \\cdot R",
        "descripcion": "La diferencia de potencial aplicada a un conductor óhmico es directamente proporcional a la intensidad de corriente que circula por él.",
        "despejes": [
            {"nombre": "Resistencias en Serie", "latex": "R_{\\text{eq}} = R_1 + R_2 + R_3 + \\dots"},
            {"nombre": "Resistencias en Paralelo (2 resistores)", "latex": "R_{\\text{eq}} = \\frac{R_1 \\cdot R_2}{R_1 + R_2}"},
            {"nombre": "Ley de Pouillet (Resistencia de un alambre)", "latex": "R = \\rho \\frac{L}{A}"},
            {"nombre": "Leyes de Kirchhoff (Nudos y Mallas)", "latex": "\\sum I_{\\text{entran}} = \\sum I_{\\text{salen}}, \\quad \\sum \\varepsilon = \\sum (I \\cdot R)"}
        ],
        "variables": [
            {"simbolo": "V", "nombre": "Voltaje o tensión eléctrica", "unidad": "Volt [V]"},
            {"simbolo": "I", "nombre": "Intensidad de corriente eléctrica", "unidad": "Ampere [A] = C/s"},
            {"simbolo": "R", "nombre": "Resistencia eléctrica", "unidad": "Ohm [\\Omega]"},
            {"simbolo": "P", "nombre": "Potencia eléctrica disipada", "unidad": "Watt [W]"}
        ],
        "fija_unsa": "En resistores idénticos en paralelo, si tienes 'n' resistores de valor R, el equivalente es R/n. En serie la corriente I es la misma; en paralelo el voltaje V es el mismo para todos."
    },
    "optica_ondas": {
        "teorema_nombre": "Ecuación de Descartes para Lentes y Espejos y Ley de Snell",
        "formula_latex": "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}, \\quad n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
        "formula_simple": "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}, \\quad v = \\lambda \\cdot f",
        "descripcion": "Relaciona la distancia focal con la distancia del objeto y de la imagen en óptica geométrica. La ley de Snell cuantifica la refracción lumínica.",
        "despejes": [
            {"nombre": "Aumento Óptico Lineal", "latex": "M = -\\frac{d_i}{d_o} = \\frac{H_i}{H_o}"},
            {"nombre": "Velocidad de Propagación de Onda", "latex": "v = \\lambda \\cdot f = \\frac{\\lambda}{T}"},
            {"nombre": "Índice de Refracción", "latex": "n = \\frac{c}{v} \\quad (c = 3 \\times 10^8\\text{ m/s})"},
            {"nombre": "Energía de un Fotón (Planck)", "latex": "E = h \\cdot f = \\frac{h \\cdot c}{\\lambda}"}
        ],
        "variables": [
            {"simbolo": "f", "nombre": "Distancia focal de lente/espejo", "unidad": "Metro [m] o cm (Positiva: Cóncavo/Convergente)"},
            {"simbolo": "d_o, d_i", "nombre": "Distancia objeto e imagen", "unidad": "Metro [m] o cm"},
            {"simbolo": "\\lambda", "nombre": "Longitud de onda", "unidad": "Metro [m] o nanómetros [nm]"},
            {"simbolo": "f_o", "nombre": "Frecuencia de onda", "unidad": "Hertz [Hz] = 1/s"}
        ],
        "fija_unsa": "Regla de signos: Si d_i es positivo (+), la imagen es REAL e INVERTIDA. Si d_i es negativo (-), la imagen es VIRTUAL y DERECHA. Para espejos planos, la imagen siempre es virtual y simétrica (d_i = -d_o)."
    },

    # ==================== MATEMÁTICA Y ÁLGEBRA ====================
    "productos_notables": {
        "teorema_nombre": "Productos Notables e Identidades Algebraicas Fundamentales",
        "formula_latex": "(a + b)^2 = a^2 + 2ab + b^2, \\quad a^2 - b^2 = (a - b)(a + b)",
        "formula_simple": "(a + b)^2 = a^2 + 2ab + b^2",
        "descripcion": "Multiplicaciones algebraicas con forma canónica prefijada cuyo resultado se escribe de forma directa sin necesidad de efectuar la distributiva término a término.",
        "despejes": [
            {"nombre": "Identidades de Legendre", "latex": "(a+b)^2 + (a-b)^2 = 2(a^2 + b^2), \\quad (a+b)^2 - (a-b)^2 = 4ab"},
            {"nombre": "Binomio al Cubo (Forma Cauchy)", "latex": "(a+b)^3 = a^3 + b^3 + 3ab(a+b)"},
            {"nombre": "Suma y Diferencia de Cubos", "latex": "a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)"},
            {"nombre": "Trinomio al Cuadrado", "latex": "(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ac)"},
            {"nombre": "Condicional si a + b + c = 0", "latex": "a^3 + b^3 + c^3 = 3abc"}
        ],
        "variables": [
            {"simbolo": "a, b, c", "nombre": "Variables reales o términos polinómicos", "unidad": "Escalares en \\mathbb{R}"},
            {"simbolo": "ab", "nombre": "Producto cruzado", "unidad": "Escalar"}
        ],
        "fija_unsa": "Si en un problema de admisión te dicen: x + 1/x = 3, y te piden x² + 1/x², eleva al cuadrado: (x + 1/x)² = x² + 2 + 1/x² = 9 → x² + 1/x² = 7."
    },
    "ecuacion_cuadratica": {
        "teorema_nombre": "Fórmula General de la Ecuación Cuadrática y Teorema de Cardano-Viète",
        "formula_latex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\quad \\Delta = b^2 - 4ac",
        "formula_simple": "a x^2 + b x + c = 0 \\implies x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}",
        "descripcion": "Determina las raíces de cualquier ecuación polinómica de segundo grado en función de sus coeficientes a, b y c.",
        "despejes": [
            {"nombre": "Suma de Raíces (Cardano)", "latex": "x_1 + x_2 = -\\frac{b}{a}"},
            {"nombre": "Producto de Raíces (Cardano)", "latex": "x_1 \\cdot x_2 = \\frac{c}{a}"},
            {"nombre": "Diferencia de Raíces", "latex": "|x_1 - x_2| = \\frac{\\sqrt{\\Delta}}{|a|}"},
            {"nombre": "Análisis del Discriminante", "latex": "\\Delta > 0 \\text{ (Reales y dif.)}, \\quad \\Delta = 0 \\text{ (Reales e iguales)}, \\quad \\Delta < 0 \\text{ (Complejas)}" }
        ],
        "variables": [
            {"simbolo": "a, b, c", "nombre": "Coeficientes reales (a \\neq 0)", "unidad": "Escalares"},
            {"simbolo": "\\Delta", "nombre": "Discriminante", "unidad": "\\Delta = b^2 - 4ac"},
            {"simbolo": "x_1, x_2", "nombre": "Raíces o soluciones de la ecuación", "unidad": "Valores en \\mathbb{R} o \\mathbb{C}"}
        ],
        "fija_unsa": "Si te dicen que la ecuación cuadrática tiene 'raíces simétricas' u 'opuestas': x1 + x2 = 0 → b = 0. Si tiene 'raíces recíprocas' o 'inversas': x1 · x2 = 1 → c = a."
    },
    "pitagoras_geometria": {
        "teorema_nombre": "Teorema de Pitágoras y Triángulos Notables",
        "formula_latex": "a^2 + b^2 = c^2",
        "formula_simple": "a^2 + b^2 = c^2",
        "descripcion": "En todo triángulo rectángulo, el cuadrado de la longitud de la hipotenusa es igual a la suma de los cuadrados de las longitudes de los catetos.",
        "despejes": [
            {"nombre": "Despeje de Cateto", "latex": "a = \\sqrt{c^2 - b^2}, \\quad b = \\sqrt{c^2 - a^2}"},
            {"nombre": "Triángulo Notable 37° y 53°", "latex": "\\text{Catetos: } 3k, 4k \\implies \\text{Hipotenusa: } 5k"},
            {"nombre": "Triángulo Notable 45° y 45°", "latex": "\\text{Catetos: } k, k \\implies \\text{Hipotenusa: } k\\sqrt{2}"},
            {"nombre": "Triángulo Notable 30° y 60°", "latex": "\\text{Catetos: } k, k\\sqrt{3} \\implies \\text{Hipotenusa: } 2k"},
            {"nombre": "Relaciones Métricas en Triángulo Rectángulo", "latex": "h^2 = m \\cdot n, \\quad a \\cdot b = c \\cdot h, \\quad a^2 = c \\cdot m"}
        ],
        "variables": [
            {"simbolo": "a, b", "nombre": "Catetos del triángulo rectángulo", "unidad": "Metro [m] o unidades [u]"},
            {"simbolo": "c", "nombre": "Hipotenusa", "unidad": "Metro [m] o unidades [u]"},
            {"simbolo": "h", "nombre": "Altura relativa a la hipotenusa", "unidad": "Metro [m]"},
            {"simbolo": "m, n", "nombre": "Proyecciones de los catetos sobre la hipotenusa", "unidad": "Metro [m]"}
        ],
        "fija_unsa": "En el triángulo 37°-53°, frente a 37° siempre se opone el cateto menor 3k, frente a 53° el cateto 4k, y la hipotenusa 5k. Teorema de Poncelet: a + b = c + 2r (r = inradio)."
    },
    "trigonometria_identidades": {
        "teorema_nombre": "Identidades Trigonométricas Fundamentales y Ley de Senos/Cosenos",
        "formula_latex": "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}",
        "formula_simple": "\\sin^2\\theta + \\cos^2\\theta = 1",
        "descripcion": "Ecuaciones angulares universalmente válidas para cualquier valor admisible del ángulo θ. Base de toda simplificación trigonométrica.",
        "despejes": [
            {"nombre": "Identidades Secante y Cosecante", "latex": "1 + \\tan^2\\theta = \\sec^2\\theta, \\quad 1 + \\cot^2\\theta = \\csc^2\\theta"},
            {"nombre": "Identidades Recíprocas", "latex": "\\sin\\theta \\cdot \\csc\\theta = 1, \\quad \\cos\\theta \\cdot \\sec\\theta = 1, \\quad \\tan\\theta \\cdot \\cot\\theta = 1"},
            {"nombre": "Arco Doble", "latex": "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta, \\quad \\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta"},
            {"nombre": "Ley de Senos", "latex": "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R"},
            {"nombre": "Ley de Cosenos", "latex": "a^2 = b^2 + c^2 - 2bc\\cos A"}
        ],
        "variables": [
            {"simbolo": "\\theta", "nombre": "Medida angular", "unidad": "Radianes [rad] o grados sexagesimales [°]"},
            {"simbolo": "a, b, c", "nombre": "Lados de un triángulo oblicuángulo", "unidad": "Unidades métricas"},
            {"simbolo": "R", "nombre": "Circunradio de la circunferencia circunscrita", "unidad": "Metro [m]"}
        ],
        "fija_unsa": "Conversión angular clave: S/180 = C/200 = R/π o S/9 = C/10. Si te piden S y C, usa S = 9k y C = 10k para simplificar cualquier expresión algebraica en segundos."
    },
    "logaritmos": {
        "teorema_nombre": "Definición y Propiedades Operativas de los Logaritmos",
        "formula_latex": "\\log_b(x) = y \\iff b^y = x \\quad (b > 0, b \\neq 1, x > 0)",
        "formula_simple": "\\log_b(x) = y \\iff b^y = x",
        "descripcion": "El logaritmo de un número es el exponente al que debe elevarse la base para obtener dicho número positivo.",
        "despejes": [
            {"nombre": "Logaritmo de un Producto", "latex": "\\log_b(M \\cdot N) = \\log_b M + \\log_b N"},
            {"nombre": "Logaritmo de un Cociente", "latex": "\\log_b\\left(\\frac{M}{N}\\right) = \\log_b M - \\log_b N"},
            {"nombre": "Regla del Sombrero (Potencia)", "latex": "\\log_b(M^k) = k \\cdot \\log_b M"},
            {"nombre": "Cambio de Base", "latex": "\\log_b A = \\frac{\\log_c A}{\\log_c b}"},
            {"nombre": "Regla de la Cadena", "latex": "\\log_b a \\cdot \\log_c b \\cdot \\log_d c = \\log_d a"}
        ],
        "variables": [
            {"simbolo": "b", "nombre": "Base del logaritmo", "unidad": "Real b > 0 y b \\neq 1"},
            {"simbolo": "x, M, N", "nombre": "Argumento o número", "unidad": "Real estrictamente positivo (> 0)"},
            {"simbolo": "y", "nombre": "Exponente o logaritmo resultante", "unidad": "Real en \\mathbb{R}"}
        ],
        "fija_unsa": "Siempre verifica el C.V.A. (Conjunto de Valores Admisibles) antes de resolver ecuaciones: el argumento DEBE ser > 0. Si una solución da argumento negativo, ¡se descarta!"
    },

    # ==================== QUÍMICA ====================
    "gases_ideales": {
        "teorema_nombre": "Ecuación Universal de los Gases Ideales y Ley General",
        "formula_latex": "P \\cdot V = n \\cdot R \\cdot T, \\quad \\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}",
        "formula_simple": "P \\cdot V = n \\cdot R \\cdot T",
        "descripcion": "Describe el estado termodinámico de una masa gaseosa en función de su presión absoluta, volumen, número de moles y temperatura absoluta en Kelvin.",
        "despejes": [
            {"nombre": "Ecuación con Densidad y Masa Molar", "latex": "P \\cdot \\bar{M} = \\rho \\cdot R \\cdot T"},
            {"nombre": "Ley de Boyle-Mariotte (T = cte)", "latex": "P_1 \\cdot V_1 = P_2 \\cdot V_2"},
            {"nombre": "Ley de Charles (P = cte)", "latex": "\\frac{V_1}{T_1} = \\frac{V_2}{T_2}"},
            {"nombre": "Ley de Gay-Lussac (V = cte)", "latex": "\\frac{P_1}{T_1} = \\frac{P_2}{T_2}"},
            {"nombre": "Volumen Molar a C.N.", "latex": "1\\text{ mol de cualquier gas a C.N.} = 22.4\\text{ L}"}
        ],
        "variables": [
            {"simbolo": "P", "nombre": "Presión del gas", "unidad": "atm o mmHg (1 atm = 760 mmHg)"},
            {"simbolo": "V", "nombre": "Volumen ocupado", "unidad": "Litro [L]"},
            {"simbolo": "n", "nombre": "Número de moles (m / M)", "unidad": "Moles [mol]"},
            {"simbolo": "R", "nombre": "Constante universal de gases", "unidad": "0.082 atm·L/(mol·K) o 62.4 mmHg·L/(mol·K)"},
            {"simbolo": "T", "nombre": "Temperatura absoluta", "unidad": "Kelvin [K] = °C + 273"}
        ],
        "fija_unsa": "¡Nunca pongas la temperatura en Celsius (°C)! En todos los problemas de gases debes sumar obligatoriamente 273 para trabajar en KELVIN (ejemplo: 27 °C = 27 + 273 = 300 K)."
    },
    "estequiometria": {
        "teorema_nombre": "Leyes Ponderales y Cálculo del Mol Químico",
        "formula_latex": "n = \\frac{m}{\\bar{M}} = \\frac{N^\\circ \\text{ moléculas}}{6.022 \\times 10^{23}} = \\frac{V_{\\text{gas a C.N.}}}{22.4\\text{ L}}",
        "formula_simple": "n = \\frac{m}{\\bar{M}}",
        "descripcion": "El mol es la unidad básica del SI que representa la cantidad de sustancia que contiene tantas entidades elementales como átomos hay en 12 g de carbono-12.",
        "despejes": [
            {"nombre": "Ley de Conservación de Lavoisier", "latex": "\\sum m_{\\text{reactivos}} = \\sum m_{\\text{productos}}"},
            {"nombre": "Porcentaje de Rendimiento", "latex": "\\%\\text{ Rendimiento} = \\frac{m_{\\text{real}}}{m_{\\text{teórico}}} \\times 100\\%"},
            {"nombre": "Pureza de la Muestra", "latex": "m_{\\text{pura}} = m_{\\text{muestra}} \\times \\frac{\\%\\text{ Pureza}}{100}"},
            {"nombre": "Cálculo del Reactivo Limitante", "latex": "\\text{Cociente R.L.} = \\frac{n_{\\text{disponible}}}{\\text{Coeficiente estequiométrico}}"}
        ],
        "variables": [
            {"simbolo": "m", "nombre": "Masa de la sustancia", "unidad": "Gramo [g]"},
            {"simbolo": "\\bar{M}", "nombre": "Masa molar molecular o atómica", "unidad": "g/mol (H=1, C=12, N=14, O=16, S=32)"},
            {"simbolo": "N_A", "nombre": "Número de Avogadro", "unidad": "6.022 \\times 10^{23} \\text{ entidades/mol}"}
        ],
        "fija_unsa": "Para identificar el Reactivo Limitante (R.L.), divide los moles de cada reactivo entre su respectivo coeficiente en la ecuación balanceada. ¡El menor valor es el reactivo limitante que manda en todos los cálculos!"
    },
    "soluciones_ph": {
        "teorema_nombre": "Concentración Molar, Potencial de Hidrógeno (pH) y Neutralización",
        "formula_latex": "M = \\frac{n_{\\text{sto}}}{V_{\\text{sol}}(\\text{L})}, \\quad \\text{pH} = -\\log[\\text{H}^+], \\quad \\text{pH} + \\text{pOH} = 14",
        "formula_simple": "\\text{pH} = -\\log[\\text{H}^+]",
        "descripcion": "Cuantifica el grado de acidez o basicidad de una solución acuosa mediante una escala logarítmica negativa basada en la concentración de protones.",
        "despejes": [
            {"nombre": "Concentración a partir del pH", "latex": "[\\text{H}^+] = 10^{-\\text{pH}}, \\quad [\\text{OH}^-] = 10^{-\\text{pOH}}"},
            {"nombre": "Dilución de Soluciones", "latex": "C_1 \\cdot V_1 = C_2 \\cdot V_2 \\quad (M_1 V_1 = M_2 V_2)"},
            {"nombre": "Mezcla de Soluciones del Mismo Soluto", "latex": "M_1 V_1 + M_2 V_2 = M_{\\text{mezcla}} (V_1 + V_2)"},
            {"nombre": "Relación entre Normalidad y Molaridad", "latex": "N = M \\cdot \\theta"},
            {"nombre": "Neutralización Ácido-Base", "latex": "N_{\\text{ácido}} \\cdot V_{\\text{ácido}} = N_{\\text{base}} \\cdot V_{\\text{base}}"}
        ],
        "variables": [
            {"simbolo": "M", "nombre": "Molaridad de la solución", "unidad": "mol/L"},
            {"simbolo": "N", "nombre": "Normalidad de la solución", "unidad": "Eq-g/L"},
            {"simbolo": "\\theta", "nombre": "Parámetro de carga (H+ en ácidos, OH- en hidróxidos)", "unidad": "Eq-g/mol"},
            {"simbolo": "\\text{pH}", "nombre": "Potencial de Hidrógeno", "unidad": "Escala adimensional de 0 a 14 a 25 °C"}
        ],
        "fija_unsa": "Si [H⁺] = 10⁻³ M, el pH = 3 (solución ácida). Si te dan [OH⁻] = 10⁻⁴ M, primero saca pOH = 4 y luego despeja pH = 14 - 4 = 10 (solución básica). ¡No confundas pH con pOH!"
    },

    # ==================== RAZ. MATEMÁTICO ====================
    "series_sucesiones": {
        "teorema_nombre": "Fórmulas Notables de Sumatorias y Progresiones",
        "formula_latex": "S_n = \\sum_{k=1}^n k = \\frac{n(n+1)}{2}, \\quad t_n = t_1 + (n - 1)r",
        "formula_simple": "S_n = \\frac{n(n+1)}{2}",
        "descripcion": "La suma de los n primeros números naturales consecutivos de Gauss. Fórmula de mayor frecuencia en el examen de admisión.",
        "despejes": [
            {"nombre": "Suma de los n primeros números pares", "latex": "2 + 4 + 6 + \\dots + 2n = n(n + 1)"},
            {"nombre": "Suma de los n primeros números impares", "latex": "1 + 3 + 5 + \\dots + (2n - 1) = n^2"},
            {"nombre": "Suma de los n primeros cuadrados", "latex": "1^2 + 2^2 + 3^2 + \\dots + n^2 = \\frac{n(n+1)(2n+1)}{6}"},
            {"nombre": "Suma de los n primeros cubos", "latex": "1^3 + 2^3 + 3^3 + \\dots + n^3 = \\left[\\frac{n(n+1)}{2}\\right]^2"},
            {"nombre": "Suma límite de Progresión Geométrica decreciente", "latex": "S_\\infty = \\frac{t_1}{1 - q} \\quad (|q| < 1)"}
        ],
        "variables": [
            {"simbolo": "n", "nombre": "Número de términos de la serie", "unidad": "Entero positivo en \\mathbb{N}"},
            {"simbolo": "t_1", "nombre": "Primer término de la progresión", "unidad": "Término inicial"},
            {"simbolo": "r, q", "nombre": "Razón aritmética o geométrica", "unidad": "Constante de cambio"}
        ],
        "fija_unsa": "En la suma de impares 1 + 3 + 5 + ... + 39: el último término es 2n - 1 = 39 → 2n = 40 → n = 20 términos. La suma total es n² = 20² = 400. ¡Nunca eleves 39 al cuadrado!"
    },

    # ==================== RAZ. LÓGICO ====================
    "logica_formal": {
        "teorema_nombre": "Leyes de Implicación Material, De Morgan y Equivalencias Notables",
        "formula_latex": "p \\to q \\equiv \\sim p \\lor q, \\quad \\sim(p \\land q) \\equiv \\sim p \\lor \\sim q",
        "formula_simple": "p \\to q \\equiv \\sim p \\lor q",
        "descripcion": "La condicional 'si p entonces q' equivale lógicamente a negar el antecedente o afirmar el consecuente. Base de todas las simplificaciones de circuitos y tablas.",
        "despejes": [
            {"nombre": "Ley de De Morgan para Disyunción", "latex": "\\sim(p \\lor q) \\equiv \\sim p \\land \\sim q"},
            {"nombre": "Ley de Contraposición (Transposición)", "latex": "p \\to q \\equiv \\sim q \\to \\sim p"},
            {"nombre": "Ley de Absorción", "latex": "p \\lor (p \\land q) \\equiv p, \\quad p \\land (p \\lor q) \\equiv p"},
            {"nombre": "Absorción con Negación", "latex": "p \\lor (\\sim p \\land q) \\equiv p \\lor q, \\quad p \\land (\\sim p \\lor q) \\equiv p \\land q"},
            {"nombre": "Doble Negación (Involución)", "latex": "\\sim(\\sim p) \\equiv p"}
        ],
        "variables": [
            {"simbolo": "p, q, r", "nombre": "Variables proposicionales", "unidad": "Valores de Verdad {V, F}"},
            {"simbolo": "\\land", "nombre": "Conjunción lógica (Y)", "unidad": "V solo si ambos son V"},
            {"simbolo": "\\lor", "nombre": "Disyunción débil (O)", "unidad": "F solo si ambos son F"},
            {"simbolo": "\\to", "nombre": "Condicional o Implicación (Si... entonces)", "unidad": "F solo si V -> F"}
        ],
        "fija_unsa": "¡Método de reducción directa! Para saber si una proposición condicional es falsa, el antecedente DEBE ser Verdadero (V) y el consecuente DEBE ser Falso (F). Aplica el método abreviado para hallar los valores en 10 segundos."
    },

    # ==================== HUMANIDADES Y CIENCIAS SOCIALES ====================
    "lenguaje_acentuacion": {
        "teorema_nombre": "Axioma Universal de la Acentuación y Regla del Hiato Acentual (Robúrico)",
        "formula_latex": "V_A + V_C' \\implies \\text{Tilde Disolvente Obligatoria} \\quad (\\text{Ej: } c-a-í-d-a, \\; t-í-o)",
        "formula_simple": "V_A + V_C' \\to \\text{Hiato Acentual (Tilde Obligatoria)}",
        "descripcion": "Cuando una vocal cerrada (i, u) lleva la mayor fuerza de voz junto a una vocal abierta (a, e, o), se destruye el diptongo y se tilda obligatoriamente sin importar las reglas generales.",
        "despejes": [
            {"nombre": "Regla SEGA General", "latex": "\\text{Sobresdrújula} > \\text{Esdrújula} > \\text{Grave (no } -n, -s, \\text{vocal)} > \\text{Aguda (termina } -n, -s, \\text{vocal)}"},
            {"nombre": "Tilde Diacrítica en Monosílabos (8 Casos RAE)", "latex": "\\text{Él, Tú, Mí, Sí, Té, Dé, Sé, Más}"},
            {"nombre": "Diptongo Creciente y Decreciente", "latex": "V_C + V_A \\text{ (Creciente)}, \\quad V_A + V_C \\text{ (Decreciente)}"},
            {"nombre": "Palabras Terminadas en -mente", "latex": "\\text{Adjetivo con tilde} + \\text{mente} = \\text{Conserva su tilde (Ej: fácil} \\to \\text{fácilmente)}"}
        ],
        "variables": [
            {"simbolo": "V_A", "nombre": "Vocal Abierta o Fuerte", "unidad": "a, e, o"},
            {"simbolo": "V_C", "nombre": "Vocal Cerrada o Débil", "unidad": "i, u"},
            {"simbolo": "V_C'", "nombre": "Vocal Cerrada Tónica (con acento)", "unidad": "Destruye diptongo"}
        ],
        "fija_unsa": "¡Trampa fija! Palabras como 'fe', 'ti', 'di', 'vi', 'fue', 'fui' NUNCA llevan tilde porque son monosílabos que no tienen gemelo de distinta función gramatical."
    },
    "biologia_genetica": {
        "teorema_nombre": "Leyes de la Herencia de Gregor Mendel y Dogma Central",
        "formula_latex": "F_1: Aa \\times Aa \\implies F_2 = 1\\,AA : 2\\,Aa : 1\\,aa \\quad (\\text{Fenotipo } 3 : 1)",
        "formula_simple": "F_2: \\text{Fenotipo } 3:1, \\quad \\text{Genotipo } 1:2:1",
        "descripcion": "Primera y Segunda Ley de Mendel. Al cruzar dos individuos heterocigotos para un carácter monohíbrido, la segregación genera una proporción fenotípica de 3 dominantes por 1 recesivo.",
        "despejes": [
            {"nombre": "Cruce de Líneas Puras (Primera Ley)", "latex": "AA \\times aa \\implies F_1 = 100\\% \\text{ Aa (Uniforme dominante)}"},
            {"nombre": "Cruce Dihíbrido de Mendel (Tercera Ley)", "latex": "AaBb \\times AaBb \\implies \\text{Fenotipos } 9 : 3 : 3 : 1"},
            {"nombre": "Dogma Central de la Biología Molecular", "latex": "\\text{ADN} \\xrightarrow{\\text{Replicación}} \\text{ADN} \\xrightarrow{\\text{Transcripción}} \\text{ARNm} \\xrightarrow{\\text{Traducción}} \\text{Proteína}"},
            {"nombre": "Ecuación de Fotosíntesis", "latex": "6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{fotones} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2"},
            {"nombre": "Respiración Celular Aeróbica", "latex": "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 36\\text{ a } 38\\text{ ATP}"}
        ],
        "variables": [
            {"simbolo": "A", "nombre": "Alelo Dominante", "unidad": "Se expresa en homocigosis y heterocigosis"},
            {"simbolo": "a", "nombre": "Alelo Recesivo", "unidad": "Se expresa únicamente en homocigosis (aa)"},
            {"simbolo": "ATP", "nombre": "Adenosín Trifosfato", "unidad": "Moneda energética celular"}
        ],
        "fija_unsa": "En la respiración celular, la Glucólisis ocurre en el CITOSOL y genera 2 ATP netos sin usar oxígeno. El Ciclo de Krebs y la Fosforilación Oxidativa ocurren en la MITOCONDRIA."
    },
    "geografia_escalas": {
        "teorema_nombre": "Ecuación de Escala Cartográfica y Gradiente Térmico",
        "formula_latex": "E = \\frac{d}{D}, \\quad \\Delta T = -0.6^\\circ\\text{C} \\text{ por cada } 100\\text{ m de ascenso}",
        "formula_simple": "E = \\frac{d}{D} \\implies D = d \\times \\text{Denominador}",
        "descripcion": "Relaciona la distancia gráfica medida en el mapa (d) con la distancia real correspondiente en el terreno (D).",
        "despejes": [
            {"nombre": "Distancia Real en el Terreno", "latex": "D = d \\cdot X \\quad (\\text{si Escala es } 1 : X)"},
            {"nombre": "Escala de la Carta Nacional del Perú", "latex": "E = 1 : 100\\,000 \\quad (1\\text{ cm en la carta} = 1\\text{ km en el terreno})"},
            {"nombre": "Escala del Mapa Oficial del Perú", "latex": "E = 1 : 1\\,000\\,000 \\quad (1\\text{ cm} = 10\\text{ km})"},
            {"nombre": "Crecimiento Vegetativo o Natural", "latex": "\\text{CV} = \\text{Tasa Bruta Natalidad} - \\text{Tasa Bruta Mortalidad}"}
        ],
        "variables": [
            {"simbolo": "d", "nombre": "Distancia en el plano o mapa", "unidad": "Centímetros [cm]"},
            {"simbolo": "D", "nombre": "Distancia real en el terreno", "unidad": "Metros [m] o Kilómetros [km] (1 km = 100,000 cm)"},
            {"simbolo": "X", "nombre": "Denominador de la escala", "unidad": "Factor de reducción adimensional"}
        ],
        "fija_unsa": "1 km equivale a 100,000 cm (5 ceros). Si la escala es 1 : 250,000 y mides 4 cm en el mapa: D = 4 × 250,000 = 1,000,000 cm. Tacha 5 ceros y tienes D = 10 km."
    },
    "civica_constitucion": {
        "teorema_nombre": "Jerarquía Normativa (Pirámide de Kelsen) y Mayorías Congresales",
        "formula_latex": "\\text{Nivel Constitucional} > \\text{Nivel Legal} > \\text{Nivel Reglamentario}",
        "formula_simple": "\\text{Constitución} > \\text{Leyes/Decretos Leg.} > \\text{Resoluciones}",
        "descripcion": "El artículo 51 de la Constitución Política del Perú consagra la supremacía de la Carta Magna sobre toda otra norma legal.",
        "despejes": [
            {"nombre": "Mayoría Calificada para Reforma Constitucional (2/3 del Congreso)", "latex": "\\text{Votos Requeridos} = \\frac{2}{3} \\times 130 = 87\\text{ votos en dos legislaturas}"},
            {"nombre": "Mayoría Absoluta del Congreso", "latex": "\\text{Mitad más uno del número legal} = \\frac{130}{2} + 1 = 66\\text{ votos}"},
            {"nombre": "Garantías Constitucionales de la Libertad Personal", "latex": "\\text{Habeas Corpus (Libertad)}, \\quad \\text{Amparo (Demás derechos)}"},
            {"nombre": "Garantías del Acceso a la Información", "latex": "\\text{Habeas Data (Información pública y honor/intimidad)}"}
        ],
        "variables": [
            {"simbolo": "130", "nombre": "Número legal de Congresistas de la República", "unidad": "Congresistas"},
            {"simbolo": "87", "nombre": "Número clave de 2/3 para elegir Defensor, TC y vacancia", "unidad": "Votos calificados"},
            {"simbolo": "66", "nombre": "Mayoría absoluta legal", "unidad": "Votos mínimos"}
        ],
        "fija_unsa": "El Hábeas Corpus protege la LIBERTAD INDIVIDUAL y la integridad física (detención arbitraria). La Acción de Amparo protege los demás derechos fundamentales (salud, educación, trabajo). ¡El Hábeas Data protege el acceso a información y autodeterminación informativa!"
    },
    "filosofia_epistemologia": {
        "teorema_nombre": "Principios Lógicos de la Ontología y Criterio de Falsabilidad (Popper)",
        "formula_latex": "\\sim(A \\land \\sim A) \\quad [\\text{No Contradicción}], \\quad A \\equiv A \\quad [\\text{Identidad}]",
        "formula_simple": "\\sim(A \\land \\sim A) \\implies \\text{Principio de No Contradicción}",
        "descripcion": "Los tres axiomas ontológicos universales formulados desde Aristóteles. En epistemología moderna, Karl Popper postula que una teoría es científica solo si es falsable.",
        "despejes": [
            {"nombre": "Principio del Tercio Excluido", "latex": "A \\lor \\sim A \\quad (\\text{Una proposición es V o F, no hay tercer estado})"},
            {"nombre": "Principio de Razón Suficiente (Leibniz)", "latex": "\\forall x, \\; \\exists R \\implies \\text{Nada ocurre sin una razón de ser}"},
            {"nombre": "Imperativo Categórico de Kant (Ética del Deber)", "latex": "\\text{Actúa solo según aquella máxima que puedas querer que sea ley universal}"},
            {"nombre": "Duda Metódica de Descartes", "latex": "\\text{Cogito, ergo sum} \\implies \\text{Pienso, luego existo}"}
        ],
        "variables": [
            {"simbolo": "A", "nombre": "Ente o proposición ontológica", "unidad": "Sujeto cognoscente / objeto"},
            {"simbolo": "\\sim A", "nombre": "Negación o contraparte", "unidad": "Oposición dialéctica"}
        ],
        "fija_unsa": "Gnoseología = Estudia el conocimiento en general (origen, posibilidad y esencia). Epistemología = Estudia exclusivamente el conocimiento CIENTÍFICO y su método de validación. ¡Pregunta clásica de confusión en Sociales!"
    },
    "psicologia_aprendizaje": {
        "teorema_nombre": "Fórmula del Cociente Intelectual (Stern) y Condicionamiento",
        "formula_latex": "\\text{CI} = \\frac{\\text{EM}}{\\text{EC}} \\times 100, \\quad \\text{E} \\to \\text{R} \\quad (\\text{Condicionamiento Clásico})",
        "formula_simple": "\\text{CI} = \\frac{\\text{Edad Mental}}{\\text{Edad Cronológica}} \\times 100",
        "descripcion": "Fórmula cuantitativa de William Stern refinada en la escala Stanford-Binet. Relaciona el rendimiento mental del individuo con su edad cronológica en años.",
        "despejes": [
            {"nombre": "Condicionamiento Clásico (Pávlov)", "latex": "\\text{Estimulo Incondicionado (EI)} \\to \\text{Respuesta Incondicionada (RI)}"},
            {"nombre": "Estímulo Condicionado (Asociación)", "latex": "\\text{Estímulo Neutro (EN)} + \\text{EI} \\xrightarrow{\\text{Apareamiento}} \\text{EC} \\to \\text{RC}"},
            {"nombre": "Condicionamiento Operante (Skinner)", "latex": "\\text{Estímulo Discriminativo} \\to \\text{Conducta} \\to \\text{Consecuencia (Refuerzo / Castigo)}"},
            {"nombre": "Refuerzo vs Castigo", "latex": "\\text{Refuerzo: Aumenta conducta; } \\quad \\text{Castigo: Disminuye conducta}"}
        ],
        "variables": [
            {"simbolo": "\\text{CI}", "nombre": "Cociente Intelectual", "unidad": "Normal promedio = 90 a 109"},
            {"simbolo": "\\text{EM}", "nombre": "Edad Mental determinada por test psicométrico", "unidad": "Meses o años"},
            {"simbolo": "\\text{EC}", "nombre": "Edad Cronológica biológica real", "unidad": "Meses o años"}
        ],
        "fija_unsa": "En el condicionamiento operante de Skinner: El Refuerzo Positivo da algo agradable; el Refuerzo Negativo QUITA algo desagradable (ambos aumentan la conducta). El Castigo disminuye la frecuencia de la conducta."
    }
}


def get_formula_for_topic(subject_name, topic_title, subcode=""):
    """
    Busca de forma inteligente la mejor coincidencia de fórmula canónica
    para cualquier subtema de los 15 cursos de la UNSA.
    """
    s_norm = subject_name.lower()
    t_norm = topic_title.lower()

    # Mapeo específico por tema o palabras clave
    if "dimensio" in t_norm:
        return FORMULAS_CATALOG["analisis_dimensional"]
    if "vector" in t_norm or "paralelog" in t_norm:
        return FORMULAS_CATALOG["vectores"]
    if "mru" in t_norm or "velocidad" in t_norm or "encuentro" in t_norm:
        return FORMULAS_CATALOG["cinematica_mru"]
    if "mruv" in t_norm or "caída libre" in t_norm or "mvcl" in t_norm or "aceleraci" in t_norm:
        return FORMULAS_CATALOG["cinematica_mruv"]
    if "paraból" in t_norm or "proyectil" in t_norm or "mcu" in t_norm or "circular" in t_norm:
        return FORMULAS_CATALOG["parabolico"]
    if "estática" in t_norm or "fuerza" in t_norm and ("equilibrio" in t_norm or "torque" in t_norm or "momento" in t_norm or "palanca" in t_norm):
        return FORMULAS_CATALOG["estatica"]
    if "dinámica" in t_norm or "newton" in t_norm or "rozamiento" in t_norm or "fricción" in t_norm:
        return FORMULAS_CATALOG["dinamica"]
    if "trabajo" in t_norm or "energía" in t_norm or "potencia" in t_norm or "cinética" in t_norm:
        return FORMULAS_CATALOG["trabajo_energia"]
    if "hidrostática" in t_norm or "fluido" in t_norm or "presión" in t_norm or "arquímedes" in t_norm or "pascal" in t_norm:
        return FORMULAS_CATALOG["hidrostatica"]
    if "calor" in t_norm or "temperatura" in t_norm or "dilataci" in t_norm or "termodinám" in t_norm:
        return FORMULAS_CATALOG["calorimetria"]
    if "electrostát" in t_norm or "coulomb" in t_norm or "carga" in t_norm and "campo" in t_norm:
        return FORMULAS_CATALOG["electrostatica"]
    if "corriente" in t_norm or "circuito" in t_norm or "ohm" in t_norm or "resistencia" in t_norm or "electrocín" in t_norm or "kirchhoff" in t_norm:
        return FORMULAS_CATALOG["electrocinetica"]
    if "óptica" in t_norm or "luz" in t_norm or "lente" in t_norm or "espejo" in t_norm or "onda" in t_norm or "snell" in t_norm:
        return FORMULAS_CATALOG["optica_ondas"]

    # MATEMÁTICA / ÁLGEBRA
    if "producto" in t_norm and "notable" in t_norm or "identidad" in t_norm and "algeb" in t_norm:
        return FORMULAS_CATALOG["productos_notables"]
    if "cuadrátic" in t_norm or "bhaskara" in t_norm or "discriminante" in t_norm or "cardano" in t_norm or "ecuacion" in t_norm and "segundo" in t_norm:
        return FORMULAS_CATALOG["ecuacion_cuadratica"]
    if "pitágora" in t_norm or "triángulo" in t_norm or "geometría" in t_norm or "cateto" in t_norm or "área" in t_norm:
        return FORMULAS_CATALOG["pitagoras_geometria"]
    if "trigono" in t_norm or "seno" in t_norm or "coseno" in t_norm or "tangente" in t_norm or "arco" in t_norm:
        return FORMULAS_CATALOG["trigonometria_identidades"]
    if "logaritmo" in t_norm or "exponencial" in t_norm or "potenciaci" in t_norm:
        return FORMULAS_CATALOG["logaritmos"]

    # QUÍMICA
    if "gas" in t_norm or "boyle" in t_norm or "charles" in t_norm:
        return FORMULAS_CATALOG["gases_ideales"]
    if "estequio" in t_norm or "mol" in t_norm or "avogadro" in t_norm or "ponderal" in t_norm or "balance" in t_norm:
        return FORMULAS_CATALOG["estequiometria"]
    if "soluci" in t_norm or "ph" in t_norm or "molaridad" in t_norm or "ácido" in t_norm or "neutraliz" in t_norm:
        return FORMULAS_CATALOG["soluciones_ph"]

    # RAZ. MATEMÁTICO / LÓGICO
    if "serie" in t_norm or "sumatoria" in t_norm or "sucesi" in t_norm or "progresi" in t_norm:
        return FORMULAS_CATALOG["series_sucesiones"]
    if "lógic" in s_norm or "proposici" in t_norm or "tabla" in t_norm and "verdad" in t_norm or "morgan" in t_norm or "inferencia" in t_norm:
        return FORMULAS_CATALOG["logica_formal"]

    # HUMANIDADES
    if "lengua" in s_norm or "acentu" in t_norm or "tilde" in t_norm or "diptongo" in t_norm or "hiato" in t_norm:
        return FORMULAS_CATALOG["lenguaje_acentuacion"]
    if "biolog" in s_norm:
        return FORMULAS_CATALOG["biologia_genetica"]
    if "geograf" in s_norm or "escala" in t_norm or "mapa" in t_norm:
        return FORMULAS_CATALOG["geografia_escalas"]
    if "cívic" in s_norm or "constituc" in t_norm or "derecho" in t_norm or "kelsen" in t_norm:
        return FORMULAS_CATALOG["civica_constitucion"]
    if "filosof" in s_norm or "epistemolog" in t_norm or "gnoseolog" in t_norm or "ética" in t_norm:
        return FORMULAS_CATALOG["filosofia_epistemologia"]
    if "psicolog" in s_norm or "aprendizaje" in t_norm or "personalidad" in t_norm or "memoria" in t_norm:
        return FORMULAS_CATALOG["psicologia_aprendizaje"]

    # Fallback por defecto según la materia
    if "físic" in s_norm:
        return FORMULAS_CATALOG["dinamica"]
    if "químic" in s_norm:
        return FORMULAS_CATALOG["estequiometria"]
    if "matem" in s_norm or "álgeb" in s_norm:
        return FORMULAS_CATALOG["productos_notables"]
    if "verbal" in s_norm:
        return FORMULAS_CATALOG["lenguaje_acentuacion"]
    if "ingl" in s_norm:
        return FORMULAS_CATALOG["lenguaje_acentuacion"]
    
    return FORMULAS_CATALOG["filosofia_epistemologia"]
