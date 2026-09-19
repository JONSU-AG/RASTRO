# -*- coding: utf-8 -*-
"""
COMPENDIO OFICIAL DE TEORÍA PREUNIVERSITARIA CEPREUNSA - FÍSICA
10 Semanas completas (40 subtemas oficiales) con fundamentación analítica,
ecuaciones dimensionales, vectores, cinemática, estática, dinámica, energía,
hidrostática, termodinámica, electrostática y circuitos con fórmulas KaTeX.
"""

PHYSICS_KNOWLEDGE = {
    # -------------------------------------------------------------------------
    # SEMANA 1: ANÁLISIS DIMENSIONAL Y ÁLGEBRA VECTORIAL
    # -------------------------------------------------------------------------
    "1.1": {
        "marcoteorico": (
            "El Análisis Dimensional es la rama de la física que estudia las relaciones cuantitativas entre las magnitudes físicas fundamentales "
            "y derivadas, fundamentando la validez algebraica de las leyes físicas en el Sistema Internacional de Unidades (SI).\n\n"
            "El SI establece 7 Magnitudes Fundamentales con sus dimensiones canónicas: Longitud [L] (metro, m), Masa [M] (kilogramo, kg), "
            "Tiempo [T] (segundo, s), Temperatura termodinámica [θ] (kelvin, K), Intensidad de corriente eléctrica [I] (ampere, A), "
            "Intensidad luminosa [J] (candela, cd) y Cantidad de sustancia [N] (mol, mol).\n\n"
            "Toda magnitud derivada se expresa como una ecuación monomia dimensional: [X] = L^a M^b T^c θ^d I^e J^f N^g. "
            "Las cantidades adimensionales (números puros, razones trigonométricas, logaritmos, exponentes y ángulos en radianes) "
            "poseen dimensión unitaria: [número] = 1."
        ),
        "sections": [
            {
                "heading": "🏛️ Las 7 Magnitudes Fundamentales del Sistema Internacional (SI)",
                "body": (
                    "• Longitud: [L], unidad metro (m).\n"
                    "• Masa: [M], unidad kilogramo (kg).\n"
                    "• Tiempo: [T], unidad segundo (s).\n"
                    "• Temperatura termodinámica: [θ], unidad kelvin (K).\n"
                    "• Intensidad de corriente: [I], unidad ampere (A).\n"
                    "• Intensidad luminosa: [J], unidad candela (cd).\n"
                    "• Cantidad de sustancia: [N], unidad mol (mol)."
                )
            },
            {
                "heading": "🔬 Fórmulas Dimensionales de las Principales Magnitudes Derivadas",
                "body": (
                    "• Área: [A] = L²  |  Volumen: [V] = L³  |  Densidad: [ρ] = M·L⁻³\n"
                    "• Velocidad: [v] = L·T⁻¹  |  Aceleración: [a] = L·T⁻²\n"
                    "• Fuerza / Peso / Tensión: [F] = M·L·T⁻²\n"
                    "• Trabajo / Energía / Calor / Torque: [W] = M·L²·T⁻²\n"
                    "• Potencia: [P] = M·L²·T⁻³\n"
                    "• Presión: [P] = M·L⁻¹·T⁻²  |  Frecuencia: [f] = T⁻¹\n"
                    "• Carga Eléctrica: [Q] = I·T"
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Cantidades Adimensionales",
                "body": (
                    "• Regla de los Adimensionales: [sen 30°] = 1, [log x] = 1, [π] = 1, [e^x] = 1, [45 rad] = 1.\n"
                    "• Los exponentes son siempre adimensionales: Si aparece e^(k·t), entonces [k·t] = 1 ⇒ [k] = T⁻¹.\n"
                    "• Trabajo y Torque comparten la misma dimensión [M L² T⁻²], pero el Trabajo es escalar y el Torque es vectorial."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuación Dimensional General de Fourier",
            "formula_latex": "[X] = L^a M^b T^c \\theta^d I^e J^f N^g \\quad \\land \\quad [\\text{adimensional}] = 1",
            "formula_simple": "[Fuerza] = M L T^(-2)  |  [Trabajo/Energía] = M L^2 T^(-2)  |  [Potencia] = M L^2 T^(-3)",
            "descripcion": "Expresión canónica que define cualquier magnitud física derivada en función de las 7 magnitudes fundamentales del SI.",
            "despejes": [
                {"nombre": "Fuerza (Newton)", "latex": "[F] = [m] \\cdot [a] = M \\cdot (L T^{-2}) = M L T^{-2}"},
                {"nombre": "Trabajo / Energía (Joule)", "latex": "[W] = [F] \\cdot [d] = (M L T^{-2}) \\cdot L = M L^2 T^{-2}"},
                {"nombre": "Presión (Pascal)", "latex": "[P] = \\frac{[F]}{[A]} = \\frac{M L T^{-2}}{L^2} = M L^{-1} T^{-2}"},
                {"nombre": "Carga Eléctrica (Coulomb)", "latex": "[Q] = [I] \\cdot [t] = I \\cdot T"}
            ],
            "variables": [
                {"simbolo": "L", "nombre": "Longitud", "unidad": "Metro (m)"},
                {"simbolo": "M", "nombre": "Masa", "unidad": "Kilogramo (kg)"},
                {"simbolo": "T", "nombre": "Tiempo", "unidad": "Segundo (s)"}
            ],
            "fija_unsa": "En CEPREUNSA: Todo argumento de función trigonométrica o exponente es adimensional ([argumento] = 1). La dimensión de la energía es M L² T⁻²."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Fuerza = M L T⁻²; Energía/Trabajo/Calor = M L² T⁻²; Potencia = M L² T⁻³; Presión = M L⁻¹ T⁻². Todos los números, ángulos y funciones trigonométricas tienen dimensión 1.",
        "takeaway": "El análisis dimensional verifica la coherencia física. Las 7 fundamentales generan las derivadas; toda constante numérica, ángulo y exponente tiene dimensión 1."
    },

    "1.2": {
        "marcoteorico": (
            "El Principio de Homogeneidad Dimensional o Regla de Fourier establece que en toda ecuación física dimensionalmente correcta, "
            "cada uno de los términos que se suman o restan deben poseer exactamente la misma fórmula dimensional.\n\n"
            "Formalmente, si A = B + C - D / E, entonces necesariamente: [A] = [B] = [C] = [D / E].\n"
            "En el álgebra dimensional no se aplican las reglas convencionales de adición o sustracción de coeficientes: "
            "[L] + [L] = [L], y [T] - [T] = [T] (las dimensiones no se suman ni se restan, permanecen invariantes).\n\n"
            "Este principio permite deducir magnitudes desconocidas, despejar constantes físicas universales "
            "(como la constante de gravitación universal G o la constante de Coulomb k) y verificar la validez de modelos teóricos en el examen de admisión."
        ),
        "sections": [
            {
                "heading": "🏛️ Principio de Homogeneidad Dimensional (Ley de Fourier)",
                "body": (
                    "• Enunciado: Si A + B = C - D, entonces [A] = [B] = [C] = [D].\n"
                    "• Suma y Resta Dimensional: [L] + [L] + [L] = [L];  [M·T⁻¹] - [M·T⁻¹] = [M·T⁻¹].\n"
                    "• Multiplicación y División: Sí operan normalmente: [L] · [L] = [L²];  [L] / [T] = [L·T⁻¹]."
                )
            },
            {
                "heading": "🔬 Constantes Físicas Universales y sus Dimensiones",
                "body": (
                    "• Constante de Gravitación Universal (G): F = G·m₁·m₂/d² ⇒ [G] = M⁻¹·L³·T⁻²\n"
                    "• Constante de Coulomb (k): F = k·q₁·q₂/d² ⇒ [k] = M·L³·T⁻⁴·I⁻²\n"
                    "• Constante Universal de los Gases (R): P·V = n·R·T ⇒ [R] = M·L²·T⁻²·θ⁻¹·N⁻¹\n"
                    "• Constante de Planck (h): E = h·f ⇒ [h] = M·L²·T⁻¹"
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Resolución Estratégica",
                "body": (
                    "• Exponentes: Si aparece A = B·e^(k·x), el exponente es adimensional: [k·x] = 1 ⇒ [k] = [x]⁻¹ = L⁻¹.\n"
                    "• Argumentos Trigonométricos: Si aparece sen(ω·t + φ), entonces [ω·t] = 1 ⇒ [ω] = T⁻¹ (frecuencia angular).\n"
                    "• Si en CEPREUNSA te piden [A/B] en la ecuación x = A·t + B·t², aplica homogeneidad: [x] = [A·t] = [B·t²]."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Principio de Homogeneidad Dimensional (Fourier)",
            "formula_latex": "A = B + C - D \\implies [A] = [B] = [C] = [D]",
            "formula_simple": "Si A + B = C, entonces [A] = [B] = [C]  |  [L] + [L] = [L]",
            "descripcion": "Regla cardinal que exige que los términos sumados o restados en una ley física tengan la misma naturaleza dimensional.",
            "despejes": [
                {"nombre": "Invarianza de Suma", "latex": "[X] \\pm [X] = [X] \\quad \\text{y} \\quad [X] \\pm [X] \\neq 2[X]"},
                {"nombre": "Condición de Exponente", "latex": "y = A \\cdot B^{\\alpha \\cdot t} \\implies [\\alpha \\cdot t] = 1 \\implies [\\alpha] = T^{-1}"},
                {"nombre": "Constante de Gravitación G", "latex": "[G] = \\frac{[F] [d^2]}{[m_1] [m_2]} = \\frac{(M L T^{-2}) L^2}{M^2} = M^{-1} L^3 T^{-2}"}
            ],
            "variables": [
                {"simbolo": "G", "nombre": "Constante de gravitación", "unidad": "M^(-1) L^3 T^(-2) [N·m²/kg²]"},
                {"simbolo": "h", "nombre": "Constante de Planck", "unidad": "M L^2 T^(-1) [J·s]"}
            ],
            "fija_unsa": "Pregunta clásica UNSA: Hallar la dimensión de G a partir de F = G·m₁·m₂/d². Clave: M⁻¹ L³ T⁻²."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: En A = B + C, se cumple [A] = [B] = [C]. Las constantes físicas tienen dimensión: G = M⁻¹ L³ T⁻²; R = M L² T⁻² θ⁻¹ N⁻¹; h = M L² T⁻¹.",
        "takeaway": "El principio de Fourier iguala dimensionalmente todos los términos de una suma o resta. Los exponentes y argumentos trigonométricos siempre se igualan a 1."
    },

    "1.3": {
        "marcoteorico": (
            "Un vector es un ente matemático geométrico caracterizado por tres elementos cardinales: MÓDULO (magnitud o tamaño escalar no negativo), "
            "DIRECCIÓN (ángulo medido en sentido antihorario respecto al semieje positivo de las abscisas +X) y SENTIDO (indicado por la saeta de la flecha).\n\n"
            "En el plano bidimensional ℝ², un vector A⃗ se descompone rectangularmente en dos componentes ortogonales proyectadas sobre los ejes coordenados: "
            "A_x = A · cos θ (eje de las abscisas) y A_y = A · sen θ (eje de las ordenadas).\n\n"
            "En términos de vectores unitarios canónicos (î en +X, ĵ en +Y): A⃗ = A_x î + A_y ĵ. "
            "El módulo se calcula mediante el Teorema de Pitágoras: |A⃗| = √(A_x² + A_y²), y la dirección mediante la función arco tangente: θ = arctan(A_y / A_x)."
        ),
        "sections": [
            {
                "heading": "🏛️ Elementos del Vector y Vectores Unitarios Canónicos",
                "body": (
                    "• Módulo |A⃗|: Longitud del segmento orientado. Siempre es un valor real positivo o cero.\n"
                    "• Dirección (θ): Ángulo en grados o radianes medido desde el semieje +X en sentido antihorario.\n"
                    "• Vectores Unitarios: Vectores de módulo 1 que señalan la dirección de los ejes: î = (1, 0), ĵ = (0, 1).\n"
                    "• Vector Unitario de A⃗: û_A = A⃗ / |A⃗|, con |û_A| = 1."
                )
            },
            {
                "heading": "🔬 Descomposición Rectangular en 2D",
                "body": (
                    "• Componente Horizontal: A_x = |A⃗| · cos θ\n"
                    "• Componente Vertical: A_y = |A⃗| · sen θ\n"
                    "• Módulo Pitagórico: |A⃗| = √(A_x² + A_y²)\n"
                    "• Triángulos Notables Frecuentes en CEPREUNSA:\n"
                    "  - 37° y 53°: Catetos 3k y 4k, hipotenusa 5k.\n"
                    "  - 30° y 60°: Catetos k y k√3, hipotenusa 2k.\n"
                    "  - 45°: Catetos k y k, hipotenusa k√2."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Casos Particulares",
                "body": (
                    "• Si un vector está en el segundo cuadrante, A_x es negativo y A_y es positivo.\n"
                    "• Para sumar vectores con componentes cartesianas: Suma todas las componentes en X (R_x = ΣA_x) y todas en Y (R_y = ΣA_y). La resultante total es R = √(R_x² + R_y²).\n"
                    "• Resultante en el eje X: Si el problema dice 'la resultante es horizontal', entonces la suma de componentes verticales es cero (R_y = 0)."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Descomposición Rectangular y Módulo Vectorial 2D",
            "formula_latex": "\\vec{A} = A_x \\hat{i} + A_y \\hat{j}, \\quad A_x = |\\vec{A}|\\cos\\theta, \\quad A_y = |\\vec{A}|\\text{sen}\\,\\theta, \\quad |\\vec{A}| = \\sqrt{A_x^2 + A_y^2}",
            "formula_simple": "|A| = √(Ax² + Ay²)  |  Ax = |A| cosθ  |  Ay = |A| senθ",
            "descripcion": "Expresión vectorial en función de vectores unitarios rectangulares y cálculo de la magnitud resultante.",
            "despejes": [
                {"nombre": "Dirección del Vector", "latex": "\\theta = \\arctan\\left(\\frac{A_y}{A_x}\\right)"},
                {"nombre": "Vector Unitario", "latex": "\\hat{u}_A = \\frac{\\vec{A}}{|\\vec{A}|} = \\frac{A_x}{|\\vec{A}|}\\hat{i} + \\frac{A_y}{|\\vec{A}|}\\hat{j} \\quad [|\\hat{u}_A| = 1]"},
                {"nombre": "Resultante por Componentes", "latex": "R_x = \\sum A_x, \\quad R_y = \\sum A_y \\implies R = \\sqrt{R_x^2 + R_y^2}"}
            ],
            "variables": [
                {"simbolo": "Ax, Ay", "nombre": "Componentes rectangulares ortogonales", "unidad": "Metros, Newtons, etc."},
                {"simbolo": "θ", "nombre": "Ángulo de dirección respecto a +X", "unidad": "Grados sexagesimales (°)"},
                {"simbolo": "î, ĵ", "nombre": "Vectores unitarios en X e Y", "unidad": "Adimensional (|î| = |ĵ| = 1)"}
            ],
            "fija_unsa": "Si en la UNSA te dicen que la resultante es HORIZONTAL, iguala la suma de componentes en Y a cero (ΣF_y = 0). Si es VERTICAL, iguala ΣF_x = 0."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Ax = A cosθ; Ay = A senθ; A = √(Ax² + Ay²). Si la resultante es vertical, ΣRx = 0; si la resultante es horizontal, ΣRy = 0.",
        "takeaway": "Todo vector en 2D se descompone en A cosθ (eje X) y A senθ (eje Y). Su módulo es la hipotenusa pitagórica √(Ax² + Ay²)."
    },

    "1.4": {
        "marcoteorico": (
            "La adición de vectores determina un vector resultante R⃗ que produce el mismo efecto físico que el conjunto de vectores sumados.\n\n"
            "El Método del Paralelogramo permite calcular la magnitud de la resultante de dos vectores coplanares y concurrentes A⃗ y B⃗ que forman un ángulo θ:\n"
            "R = √(A² + B² + 2·A·B·cos θ).\n\n"
            "Casos Notables Cardinales en CEPREUNSA:\n"
            "1. Resultante Máxima (θ = 0°): Los vectores son paralelos y del mismo sentido: R_max = A + B.\n"
            "2. Resultante Mínima (θ = 180°): Los vectores son antiparalelos y opuestos: R_min = |A - B|.\n"
            "3. Vectores Perpendiculares (θ = 90°): cos 90° = 0 ⇒ R = √(A² + B²).\n"
            "4. Vectores Iguales con θ = 60°: Si |A| = |B| = x ⇒ R = x√3.\n"
            "5. Vectores Iguales con θ = 120°: Si |A| = |B| = x ⇒ R = x (la resultante es igual al módulo de uno de ellos).\n"
            "6. Vectores Iguales con θ = 90°: Si |A| = |B| = x ⇒ R = x√2.\n"
            "Para la diferencia vectorial D⃗ = A⃗ - B⃗: D = √(A² + B² - 2·A·B·cos θ)."
        ),
        "sections": [
            {
                "heading": "🏛️ Método del Paralelogramo y Ley de Cosenos Vectorial",
                "body": (
                    "• Fórmula General: R = √(A² + B² + 2·A·B·cos θ).\n"
                    "• Rango de la Resultante: Para cualquier ángulo θ, se cumple siempre: |A - B| ≤ R ≤ A + B.\n"
                    "• Vector Diferencia: D⃗ = A⃗ - B⃗ ⇒ D = √(A² + B² - 2·A·B·cos θ)."
                )
            },
            {
                "heading": "🔬 Los 5 Casos Notables Frecuentes en Admisión UNSA",
                "body": (
                    "1. θ = 0° (Paralelos): R_max = A + B.\n"
                    "2. θ = 180° (Antiparalelos): R_min = A - B.\n"
                    "3. θ = 90° (Ortogonales): R = √(A² + B²).\n"
                    "4. Módulos iguales (|A| = |B| = k):\n"
                    "   • θ = 60°: R = k√3\n"
                    "   • θ = 90°: R = k√2\n"
                    "   • θ = 120°: R = k (la bisectriz divide el ángulo en 60° y 60°)"
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Método del Polígono",
                "body": (
                    "• Polígono Cerrado: Si un conjunto de vectores dispuestos uno a continuación del otro forman una figura cerrada continua, la RESULTANTE ES CERO (R⃗ = 0).\n"
                    "• Si R_max = 10 y R_min = 2: Sistema de ecuaciones: A + B = 10 y A - B = 2 ⇒ A = 6 y B = 4.\n"
                    "• Ángulo entre vectores iguales que da R = k: El ángulo es exactamente 120°."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ley de Cosenos Vectorial (Método del Paralelogramo)",
            "formula_latex": "R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} \\quad \\land \\quad D = \\sqrt{A^2 + B^2 - 2AB\\cos\\theta}",
            "formula_simple": "R = √(A² + B² + 2AB cosθ)  |  R_max = A + B  |  R_min = A - B",
            "descripcion": "Cálculo analítico del módulo de la resultante de dos vectores concurrentes con ángulo relativo θ.",
            "despejes": [
                {"nombre": "Resultante Perpendicular (θ = 90°)", "latex": "R = \\sqrt{A^2 + B^2} \\quad [\\cos 90^{\\circ} = 0]"},
                {"nombre": "Vectores Iguales a 120°", "latex": "|\\vec{A}| = |\\vec{B}| = x, \\quad \\theta = 120^{\\circ} \\implies R = x"},
                {"nombre": "Vectores Iguales a 60°", "latex": "|\\vec{A}| = |\\vec{B}| = x, \\quad \\theta = 60^{\\circ} \\implies R = x\\sqrt{3}"},
                {"nombre": "Polígono Cerrado Continuo", "latex": "\\vec{A} + \\vec{B} + \\vec{C} + \\dots + \\vec{N} = \\vec{0}"}
            ],
            "variables": [
                {"simbolo": "A, B", "nombre": "Módulos de los vectores concurrentes", "unidad": "Unidades de fuerza (N), velocidad (m/s), etc."},
                {"simbolo": "θ", "nombre": "Ángulo entre los vectores A y B", "unidad": "Grados sexagesimales (0° a 180°)"},
                {"simbolo": "R", "nombre": "Módulo del vector resultante", "unidad": "Mismas unidades que A y B"}
            ],
            "fija_unsa": "En CEPREUNSA: Dos vectores de igual módulo x que forman 120° dan como resultante exactamente x. Si forman un polígono cerrado continuo, la resultante es CERO."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: R = √(A² + B² + 2AB cosθ). R_max = A + B; R_min = A - B. Dos vectores iguales a 120° tienen resultante igual a uno de ellos (R = x). En polígono cerrado continuo, R = 0.",
        "takeaway": "La resultante vectorial varía entre A-B (180°) y A+B (0°). Con 90° es Pitágoras √(A²+B²); con dos vectores iguales a 120°, la resultante es igual al mismo vector."
    },

    # -------------------------------------------------------------------------
    # SEMANA 2: CINEMÁTICA LINEAL Y CAÍDA LIBRE (MRU, MRUV, MVCL)
    # -------------------------------------------------------------------------
    "2.1": {
        "marcoteorico": (
            "El Movimiento Rectilíneo Uniforme (MRU) es el movimiento más elemental de la cinemática clásica, caracterizado por una "
            "TRAYECTORIA RECTILÍNEA y una VELOCIDAD CONSTANTE en módulo, dirección y sentido. Al ser la velocidad constante, "
            "la ACELERACIÓN ES NULA (a = 0) y el móvil recorre distancias directamente proporcionales a los tiempos transcurridos: d = v · t.\n\n"
            "En el análisis de dos móviles con MRU se definen dos tiempos canónicos indispensables en las pruebas de CEPREUNSA:\n"
            "1. Tiempo de Encuentro (t_e): Tiempo necesario para que dos móviles separados inicialmente una distancia 'd' y que viajan en sentidos contrarios "
            "(hacia el encuentro mutuo) se crucen: t_e = d / (v₁ + v₂).\n"
            "2. Tiempo de Alcance (t_a): Tiempo que tarda un móvil más veloz (v₁ > v₂) en alcanzar a otro que viaja en el mismo sentido, separados por 'd': "
            "t_a = d / (v₁ - v₂).\n\n"
            "En las gráficas de posición versus tiempo (x vs t) del MRU, la función es una línea recta cuya pendiente representa exactamente la velocidad: "
            "m = tan α = v. En las gráficas de velocidad versus tiempo (v vs t), la velocidad es una recta horizontal y el área bajo la curva representa la distancia recorrida."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Cinemático: Ecuaciones del MRU",
                "body": (
                    "• Ley de Movimiento: d = v · t (distancia = velocidad × tiempo).\n"
                    "• Aceleración: a = 0 (velocidad vectorial estrictamente constante).\n"
                    "• Unidades SI: Distancia en metros (m), tiempo en segundos (s), velocidad en m/s.\n"
                    "• Factor de Conversión Rápida: Para pasar de km/h a m/s, multiplica por 5/18 (ej. 72 km/h × 5/18 = 20 m/s)."
                )
            },
            {
                "heading": "🔬 Tiempos Canónicos de Encuentro y Alcance",
                "body": (
                    "• Tiempo de Encuentro (Sentidos opuestos): t_e = d / (v₁ + v₂)\n"
                    "• Tiempo de Alcance (Mismo sentido, v₁ > v₂): t_a = d / (v₁ - v₂)\n"
                    "• Cruce de Túneles o Puentes: Para que un tren de longitud L_t cruce completamente un túnel de longitud L_p: "
                    "d_total = L_t + L_p = v · t."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Análisis Gráfico",
                "body": (
                    "• En gráfica x vs t: La PENDIENTE es la VELOCIDAD (v = Δx / Δt). Si la recta sube, v > 0; si es horizontal, móvil en reposo.\n"
                    "• En gráfica v vs t: El ÁREA bajo la recta es la DISTANCIA o DESPLAZAMIENTO recorrido.\n"
                    "• Tren que cruza un túnel: ¡No olvides sumar la longitud del tren a la del túnel!"
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuaciones del Movimiento Rectilíneo Uniforme (MRU)",
            "formula_latex": "d = v \\cdot t, \\quad t_e = \\frac{d}{v_1 + v_2}, \\quad t_a = \\frac{d}{v_1 - v_2} \\quad (v_1 > v_2)",
            "formula_simple": "d = v · t  |  t_encuentro = d / (v1 + v2)  |  t_alcance = d / (v1 - v2)",
            "descripcion": "Leyes cinemáticas de movimiento a velocidad constante y fórmulas para tiempos de encuentro y alcance de dos móviles.",
            "despejes": [
                {"nombre": "Velocidad", "latex": "v = \\frac{d}{t} \\quad \\left[1\\,\\frac{\\text{km}}{\\text{h}} = \\frac{5}{18}\\,\\frac{\\text{m}}{\\text{s}}\\right]"},
                {"nombre": "Paso de Tren por Túnel", "latex": "L_{\\text{tren}} + L_{\\text{túnel}} = v \\cdot t"},
                {"nombre": "Pendiente en Gráfica x-t", "latex": "v = \\tan\\alpha = \\frac{\\Delta x}{\\Delta t}"}
            ],
            "variables": [
                {"simbolo": "d", "nombre": "Distancia recorrida", "unidad": "Metros (m)"},
                {"simbolo": "v", "nombre": "Velocidad constante", "unidad": "Metros por segundo (m/s)"},
                {"simbolo": "t", "nombre": "Tiempo transcurrido", "unidad": "Segundos (s)"}
            ],
            "fija_unsa": "En CEPREUNSA: Recuerda siempre convertir km/h a m/s multiplicando por 5/18 (ej. 36 km/h = 10 m/s; 54 km/h = 15 m/s; 72 km/h = 20 m/s)."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: d = v · t. Encuentro: te = d / (v1 + v2); Alcance: ta = d / (v1 - v2). Multiplica km/h por 5/18 para obtener m/s. En cruce de túneles: d = Ltren + Ltúnel.",
        "takeaway": "En MRU la velocidad es constante (a=0) y d = v·t. Los tiempos de encuentro suman velocidades (v1+v2) y los de alcance las restan (v1-v2)."
    }
}
