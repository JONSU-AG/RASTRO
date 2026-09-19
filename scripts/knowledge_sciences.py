# -*- coding: utf-8 -*-
"""
COMPENDIO OFICIAL DE CIENCIAS Y MATEMÁTICAS - CEPREUNSA / MATRIZ UNSA
Cursos: Biología, Física, Química, Matemática (40 temas por materia = 160 subtemas)
Cada entrada contiene:
- marcoteorico: Fundamento teórico oficial denso y riguroso
- sec1_heading & sec1_body: Conceptos Fundamentales y Definiciones Exactas
- sec2_heading & sec2_body: Clasificación, Desglose Analítico y Casos Operacionales
- sec3_heading & sec3_body: Claves de Admisión UNSA y Resolución Estratégica
- formula: Datos estructurados para FormulaDisplay (KaTeX)
- fija_unsa: Clave fija de examen CEPREUNSA
- takeaway: Regla de oro de deducción preuniversitaria
"""

SCIENCES_KNOWLEDGE = {
    # =========================================================================
    # BIOLOGÍA (Semanas 1 a 10)
    # =========================================================================
    ("Biología", 1, "1.1"): {
        "marcoteorico": (
            "La Biología es una ciencia fáctica, natural y sistemática que estudia la vida en todas sus manifestaciones: "
            "su origen, evolución, estructura molecular y celular, fisiología, relaciones ecológicas y mecanismos de la herencia.\n\n"
            "Etimológicamente proviene de dos voces del griego clásico: «bíos» (vida) y «lógos» (estudio, tratado o explicación racional). "
            "El vocablo fue acuñado de forma independiente y simultánea en 1802 por el naturalista francés Jean-Baptiste de Monet, "
            "Caballero de Lamarck (en su obra 'Hydrogéologie'), y por el médico y botánico alemán Gottfried Reinhold Treviranus "
            "(en su célebre tratado 'Biologie oder Philosophie der lebenden Natur').\n\n"
            "Como ciencia, se rige por el Método Científico Riguroso: parte de la observación sistemática de un fenómeno, "
            "planteamiento de una pregunta o problema contrastable, formulación de una hipótesis (explicación tentativa falsable), "
            "diseño experimental con grupo experimental y grupo control, análisis estadístico riguroso y formulación de leyes o teorías científicas universales."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Conceptual: Etimología, Objeto de Estudio y Método Científico",
                "body": (
                    "• Etimología griega: bíos = vida; lógos = estudio racional o explicación fundada.\n"
                    "• Acuñación histórica (1802): Lamarck (Francia) y Treviranus (Alemania) unificaron el estudio de los seres vivos bajo este término.\n"
                    "• Objeto de estudio: La materia viva organizada, desde el nivel supramolecular hasta la biosfera.\n"
                    "• Pasos del Método Científico:\n"
                    "  1. Observación: Percepción objetiva de un fenómeno natural mediante los sentidos o instrumentos.\n"
                    "  2. Problema: Interrogante estructurada sobre la causa o mecanismo del fenómeno.\n"
                    "  3. Hipótesis: Respuesta provisional y contrastable al problema planteado.\n"
                    "  4. Experimentación: Contrastación controlada alterando variables independientes y manteniendo constantes las de control.\n"
                    "  5. Conclusión y Ley: Si la hipótesis es validada reiteradamente por la comunidad científica, se enuncia como principio o ley universal."
                )
            },
            {
                "heading": "🔬 Ramas de la Biología: Clasificación Taxonómica y por Nivel de Organización",
                "body": (
                    "1. Ramas Taxonómicas (Según el Ser Vivo Estudiado):\n"
                    "  • Zoología (Animales): Ictiología (peces), Herpetología (anfibios y reptiles), Ornitología (aves), "
                    "Mastozoología (mamíferos), Entomología (insectos), Malacología (moluscos: pulpos, caracoles), Helmintología (gusanos parásitos).\n"
                    "  • Botánica / Fitología (Plantas): Criptógamas (sin semillas: algas -ficología-, musgos -briología-, helechos -pteridología-) "
                    "y Fanerógamas (con semillas: gimnospermas y angiospermas).\n"
                    "  • Micología (Hongos): Levaduras, mohos y setas (pared de quitina, heterótrofos absortivos).\n"
                    "  • Microbiología: Bacteriología (bacterias), Virología (virus y priones), Protozoología (protozoarios).\n"
                    "2. Ramas por Estructura y Función (Nivel de Organización):\n"
                    "  • Citología: Estructura, ultraestructura y organelos celulares.\n"
                    "  • Histología: Tejidos biológicos y matriz extracelular.\n"
                    "  • Anatomía: Morfología macroscópica y disposición espacial de órganos.\n"
                    "  • Fisiología: Funcionamiento físico y químico de los órganos y sistemas.\n"
                    "  • Genética: Mecanismos de la herencia y expresión del genoma.\n"
                    "  • Ecología: Interacción entre los seres vivos (biocenosis) y su medio abiótico (biotopo)."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Casos de Examen",
                "body": (
                    "• Trampa clásica de examen: Lamarck y Treviranus son los acuñadores del vocablo en 1802. Aristóteles es el 'Padre de la Biología' por sus observaciones sistemáticas en animales, pero NO acuñó el término.\n"
                    "• Diferenciación Malacología vs Helmintología: La malacología estudia moluscos (con concha o cefalópodos); la helmintología estudia tenias, áscaris y lombrices.\n"
                    "• Anatomía vs Fisiología: La anatomía describe la 'forma y ubicación' (estática); la fisiología explica 'cómo trabaja y qué procesos químicos ocurren' (dinámica).\n"
                    "• Los hongos NO son plantas: Su pared es de quitina (no celulosa) y su reserva energética es glucógeno (no almidón)."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Axioma Epistemológico de la Biología y Método Científico",
            "formula_latex": "\\text{Biología} = \\text{Bíos (Vida)} + \\text{Lógos (Estudio Racional)} \\quad [1802: \\text{Lamarck} \\land \\text{Treviranus}]",
            "formula_simple": "Biología = Bíos + Lógos (Lamarck y Treviranus, 1802)",
            "descripcion": "Etimología y postulado epistemológico fundamental que formaliza la biología como ciencia fáctica natural basada en el método experimental riguroso.",
            "despejes": [
                {"nombre": "Secuencia del Método Científico", "latex": "\\text{Observación} \\to \\text{Problema} \\to \\text{Hipótesis} \\to \\text{Experimentación} \\to \\text{Ley}"},
                {"nombre": "Ecuación de Crecimiento Poblacional", "latex": "\\frac{dN}{dt} = r \\cdot N \\left(1 - \\frac{N}{K}\\right) \\quad [\\text{Capacidad de carga } K]"},
                {"nombre": "Dualidad Biológica", "latex": "\\text{Estructura (Anatomía / Citología)} \\iff \\text{Función (Fisiología)}"}
            ],
            "variables": [
                {"simbolo": "Bíos", "nombre": "Materia viva organizada", "unidad": "Sistemas celulares y ecológicos"},
                {"simbolo": "Lógos", "nombre": "Método racional deductivo-inductivo", "unidad": "Leyes científicas contrastadas"},
                {"simbolo": "K", "nombre": "Capacidad de carga ambiental", "unidad": "Número máximo de individuos sostenibles"}
            ],
            "fija_unsa": "En la prueba UNSA, si te preguntan por la disciplina que estudia al caracol de jardín, la clave es MALACOLOGÍA. Si preguntan por la tenia solium, es HELMINTOLOGÍA."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Lamarck y Treviranus crearon el término en 1802. En ramas zoológicas: Ictiología (peces), Herpetología (anfibios/reptiles), Ornitología (aves), Entomología (insectos), Malacología (moluscos), Helmintología (gusanos).",
        "takeaway": "La Biología fue acuñada en 1802 por Lamarck y Treviranus. Sus ramas taxonómicas clasifican al organismo; sus ramas funcionales explican la estructura y procesos vitales."
    },

    ("Biología", 1, "1.2"): {
        "marcoteorico": (
            "El origen de la vida representa uno de los enigmas cardinales de la ciencia biológica. A través de la historia se han contrastado "
            "postulados vitalistas frente a teorías empíricas rigurosas: la Teoría de la Generación Espontánea (Abiogénesis), defendida desde la "
            "Antigüedad por Aristóteles y en el siglo XVII por Van Helmont y Needham, sostenía que la materia inerte originaba seres vivos "
            "merced a una supuesta 'fuerza vital' o 'entelequia'.\n\n"
            "La demolición experimental de esta doctrina comenzó con Francesco Redi (1668, frascos con carne que refutaron la aparición de larvas de mosca) "
            "y Lázaro Spallanzani (1765, caldos hervidos en frascos sellados), culminando en 1862 cuando Louis Pasteur liquidó para siempre la generación espontánea "
            "usando sus legendarios matraces con cuello de cisne (en forma de 'S'). Pasteur postuló el principio de la Biogénesis: «Omne vivum ex vivo» "
            "(todo ser vivo procede exclusivamente de otro ser vivo preexistente).\n\n"
            "Superada la abiogénesis vitalista, la ciencia moderna explicó el origen abiótico original mediante la Teoría Quimiosintética o Físico-Química "
            "de Aleksandr Oparin y John Haldane (1924), validada experimentalmente por Stanley Miller y Harold Urey en 1953: en la atmósfera primitiva reductora "
            "(carente de O2 libre y rica en CH4, NH3, H2 y vapor de agua), con energía solar ultravioleta y descargas eléctricas, se sintetizaron precursores orgánicos "
            "(aminoácidos) que polimerizaron en coacervados en el caldo primigenio."
        ),
        "sections": [
            {
                "heading": "🏛️ De la Abiogénesis a la Ley de la Biogénesis (Pasteur, 1862)",
                "body": (
                    "• Generación Espontánea (Abiogénesis): Aristóteles, Van Helmont (receta para crear ratones con ropa sucia y trigo en 21 días) y John Needham.\n"
                    "• Detractores Experimentales:\n"
                    "  - Francesco Redi (1668): Usó 3 tipos de frascos con carne (abiertos, tapados herméticos y cubiertos con gasa). Las larvas solo aparecieron en los abiertos donde las moscas depositaron sus huevos.\n"
                    "  - Louis Pasteur (1862): Usó matraces de cuello de cisne (en 'S'). Hirvió caldo nutritivo; el aire entraba libremente pero el polvo y microorganismos quedaban atrapados en la curvatura inferior. Al romper el cuello, el caldo se contaminaba inmediatamente. Demostró la Ley de la Biogénesis: 'Omne vivum ex vivo'."
                )
            },
            {
                "heading": "🔬 Hipótesis de la Panspermia y Teoría Quimiosintética (Oparin-Haldane)",
                "body": (
                    "• Panspermia (Cosmozoica): Planteada por Svante Arrhenius. Afirma que esporas bacterianas llegaron a la Tierra a bordo de meteoritos o cometas. Crítica: no resuelve el origen intrínseco de la vida, solo traslada el problema al espacio exterior.\n"
                    "• Teoría Quimiosintética (Oparin-Haldane, 1924):\n"
                    "  - Atmósfera primitiva REDUCTORA (anóxica): Contenía Metano (CH4), Amoníaco (NH3), Hidrógeno molecular (H2) y Vapor de agua (H2O). NUNCA contenía oxígeno diatómico libre (O2) ni capa de ozono (O3).\n"
                    "  - Fuentes de energía: Radiación UV sin filtro, tormentas eléctricas (rayos) y calor volcánico.\n"
                    "  - Océano primitivo ('Caldo o sopa nutricia'): Acumulación de monómeros orgánicos que formaron coacervados (sistemas coloidales precelulares).\n"
                    "• Experimento de Miller y Urey (1953): Diseñaron un aparato hermético de vidrio donde hicieron circular CH4, NH3, H2 y H2O sometidos a descargas eléctricas de 60,000 V durante una semana. Obtuvieron aminoácidos esenciales (Glicina, Alanina, Ácido aspártico)."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Casos de Examen",
                "body": (
                    "• Fija UNSA sobre la Atmósfera Primitiva: La atmósfera de la Tierra primitiva era REDUCTORA, jamás oxidante. El gas ausente decisivo era el OXÍGENO LIBRE (O2).\n"
                    "• Coacervados de Oparin: NO eran células vivas completas, sino gotas coloidales rodeadas de una película de agua que intercambiaban materia y energía con el entorno.\n"
                    "• El experimento de Miller y Urey demostró la síntesis abiótica de moléculas orgánicas a partir de inorgánicas, pero NO creó una célula viva completa."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ley de la Biogénesis y Síntesis Prebiótica de Miller-Urey",
            "formula_latex": "\\text{Ley de Pasteur: } \\text{Omne vivum ex vivo} \\quad \\iff \\quad \\text{CH}_4 + \\text{NH}_3 + \\text{H}_2 + \\text{H}_2\\text{O} \\xrightarrow{60\\,000\\text{ V}} \\text{Aminoácidos}",
            "formula_simple": "Biogénesis: Pasteur (1862) | Síntesis de Miller-Urey: CH4 + NH3 + H2 + H2O → Aminoácidos",
            "descripcion": "Ecuación de síntesis prebiótica que demuestra la formación abiótica de aminoácidos en la atmósfera reductora simulada por Stanley Miller y Harold Urey.",
            "despejes": [
                {"nombre": "Atmósfera Reductora Primitiva", "latex": "\\text{Gases} = \\{\\text{CH}_4, \\text{NH}_3, \\text{H}_2, \\text{H}_2\\text{O}_{\\text{vapor}}\\} \\quad (\\text{O}_2 = 0\\%)"},
                {"nombre": "Coacervados Precelulares (Oparin)", "latex": "\\text{Micela Coloidal} + \\text{Capa de Hidratación} \\implies \\text{Metabolismo Primitivo}"},
                {"nombre": "Teoría Endosimbiótica (Lynn Margulis)", "latex": "\\text{Célula Anaerobia} + \\text{Proteobacteria Aerobia} \\to \\text{Mitocondria}"}
            ],
            "variables": [
                {"simbolo": "\\text{CH}_4", "nombre": "Metano", "unidad": "Gas reductor con enlace covalente apolar"},
                {"simbolo": "\\text{NH}_3", "nombre": "Amoníaco", "unidad": "Fuente de nitrógeno para grupos amino (-NH2)"},
                {"simbolo": "\\text{Aminoácidos}", "nombre": "Monómeros peptídicos", "unidad": "Glicina, Alanina y Ácidos carboxílicos"}
            ],
            "fija_unsa": "Si en la UNSA te preguntan qué gas NO existía en la atmósfera primitiva antes del origen de la vida, la respuesta segura es OXÍGENO MOLECULAR LIBRE (O2)."
        },
        "fijaUnsa": "Pregunta fija de examen: La atmósfera primitiva era REDUCTORA (CH4, NH3, H2, H2O vapor) y carecía de Oxígeno libre (O2). Pasteur demostró la Biogénesis con matraces de cuello de cisne.",
        "takeaway": "Pasteur refutó la generación espontánea (Omne vivum ex vivo). Oparin-Haldane y Miller-Urey demostraron que los aminoácidos surgieron de una atmósfera reductora sin oxígeno."
    },

    # =========================================================================
    # FÍSICA (Semanas 1 a 10)
    # =========================================================================
    ("Física", 1, "1.1"): {
        "marcoteorico": (
            "El Análisis Dimensional es la rama de la física que estudia las relaciones formales entre las magnitudes físicas fundamentales "
            "y derivadas, garantizando la consistencia matemática y la coherencia de unidades en las leyes físicas.\n\n"
            "El Sistema Internacional de Unidades (S.I.) reconoce siete magnitudes fundamentales independientes: Longitud [L] en metros, "
            "Masa [M] en kilogramos, Tiempo [T] en segundos, Temperatura termodinámica [θ] en Kelvin, Intensidad de corriente eléctrica [I] en Amperios, "
            "Intensidad luminosa [J] en candelas y Cantidad de sustancia [N] en moles.\n\n"
            "Toda magnitud física derivada posee una fórmula dimensional única expresada como producto de potencias enteras o fraccionarias de las magnitudes fundamentales: "
            "[X] = M^a · L^b · T^c · θ^d · I^e · J^f · N^g. Las constantes numéricas puras, los argumentos de funciones trigonométricas, funciones logarítmicas "
            "y exponentes son estrictamente adimensionales, por lo que su fórmula dimensional es igual a la unidad: [número] = 1."
        ),
        "sections": [
            {
                "heading": "🏛️ Magnitudes Fundamentales y Ecuaciones Dimensionales Notables",
                "body": (
                    "• Las 7 Magnitudes Fundamentales del S.I.:\n"
                    "  [Longitud] = L, [Masa] = M, [Tiempo] = T, [Temperatura] = θ, [Corriente] = I, [Intensidad Luminosa] = J, [Sustancia] = N.\n"
                    "• Fórmulas Dimensionales de Cabecera para Admisión UNSA:\n"
                    "  - Área: [A] = L²\n"
                    "  - Volumen: [V] = L³\n"
                    "  - Velocidad / Rapidez: [v] = L·T⁻¹\n"
                    "  - Aceleración: [a] = L·T⁻²\n"
                    "  - Fuerza / Peso / Tensión: [F] = M·L·T⁻²\n"
                    "  - Trabajo / Energía / Calor: [W] = [E] = [Q] = M·L²·T⁻²\n"
                    "  - Potencia mecánica: [Pot] = M·L²·T⁻³\n"
                    "  - Presión: [P] = M·L⁻¹·T⁻²\n"
                    "  - Densidad: [ρ] = M·L⁻³\n"
                    "  - Caudal volumétrico: [Q] = L³·T⁻¹\n"
                    "  - Frecuencia: [f] = T⁻¹\n"
                    "  - Periodo: [T] = T"
                )
            },
            {
                "heading": "🔬 Propiedades y Reglas del Álgebra Dimensional",
                "body": (
                    "1. Principio de Homogeneidad Dimensional (Ley de Fourier):\n"
                    "  Si A = B + C - D, entonces forzosamente [A] = [B] = [C] = [D]. En dimensiones NO existe suma ni resta: L + L = L; M·T⁻¹ - M·T⁻¹ = M·T⁻¹.\n"
                    "2. Regla de Adimensionalidad:\n"
                    "  Toda constante matemática, ángulo, razón trigonométrica, logaritmo o exponente tiene dimensión 1:\n"
                    "  [π] = 1, [√2] = 1, [sen 30°] = 1, [ln(x)] = 1.\n"
                    "3. Regla del Exponente:\n"
                    "  Si una variable aparece como exponente de una base (ej. e^(k·t)), dicho exponente es forzosamente adimensional: [k·t] = 1 → [k]·T = 1 → [k] = T⁻¹."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Trampas Frecuentes",
                "body": (
                    "• Trabajo vs Potencia vs Fuerza: Recuerda la progresión de la 'T': Fuerza = M·L·T⁻², Trabajo = M·L²·T⁻², Potencia = M·L²·T⁻³.\n"
                    "• La Presión y la Densidad de Energía tienen la misma dimensión: [P] = M·L⁻¹·T⁻².\n"
                    "• Si en una ecuación te piden hallar [k] en y = A·cos(k·x + φ), iguala el argumento a 1: [k·x] = 1 → [k]·L = 1 → [k] = L⁻¹."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Principio de Homogeneidad Dimensional (Ley de Fourier)",
            "formula_latex": "[A] = [B] + [C] \\implies [A] = [B] = [C]",
            "formula_simple": "[A] = [B] = [C] \\quad (L + L = L, \\quad M - M = M)",
            "descripcion": "En toda ecuación física válida, los términos sumados o restados a ambos lados de la igualdad deben poseer idéntica fórmula dimensional.",
            "despejes": [
                {"nombre": "Ecuación de la Fuerza", "latex": "[F] = M \\cdot L \\cdot T^{-2}"},
                {"nombre": "Ecuación del Trabajo y Energía", "latex": "[W] = [E] = M \\cdot L^2 \\cdot T^{-2}"},
                {"nombre": "Ecuación de la Potencia", "latex": "[Pot] = M \\cdot L^2 \\cdot T^{-3}"},
                {"nombre": "Ecuación de la Presión", "latex": "[P] = M \\cdot L^{-1} \\cdot T^{-2}"},
                {"nombre": "Regla del Exponente Adimensional", "latex": "[e^{k \\cdot t}] = 1 \\implies [k \\cdot t] = 1 \\implies [k] = T^{-1}"}
            ],
            "variables": [
                {"simbolo": "M", "nombre": "Masa", "unidad": "Kilogramo [kg]"},
                {"simbolo": "L", "nombre": "Longitud", "unidad": "Metro [m]"},
                {"simbolo": "T", "nombre": "Tiempo", "unidad": "Segundo [s]"},
                {"simbolo": "\\theta", "nombre": "Temperatura termodinámica", "unidad": "Kelvin [K]"}
            ],
            "fija_unsa": "En la UNSA, si te ponen un exponente como a^(k·v), iguala [k·v] = 1. Como [v] = L·T⁻¹, entonces [k] = L⁻¹·T."
        },
        "fijaUnsa": "Clave Fija UNSA: Fuerza es M·L·T⁻²; Trabajo y Energía es M·L²·T⁻²; Potencia es M·L²·T⁻³. Todo exponente y argumento trigonométrico se iguala a 1 dimensionalmente.",
        "takeaway": "En el análisis dimensional no existe suma ni resta (L + L = L). Todo exponente o ángulo es adimensional ([exponente] = 1)."
    },

    ("Física", 2, "2.1"): {
        "marcoteorico": (
            "La Cinemática estudia el movimiento de los cuerpos en el espacio en función del tiempo sin considerar las fuerzas que lo producen. "
            "El Movimiento Rectilíneo Uniforme (MRU) es el modelo cinemático fundamental en el cual la partícula describe una trayectoria recta "
            "manteniendo su velocidad vectorial rigurosamente constante tanto en módulo (rapidez) como en dirección y sentido.\n\n"
            "Dado que no existe variación de la velocidad, la aceleración lineal es estrictamente nula (a = 0). En consecuencia, la distancia recorrida "
            "es directamente proporcional al tiempo transcurrido, cumpliéndose la ley horaria: d = v · t.\n\n"
            "En las evaluaciones oficiales de CEPREUNSA y los exámenes ordinarios de la UNSA, este modelo se evalúa a través de dos situaciones cinemáticas "
            "clásicas: el Tiempo de Encuentro (te) entre dos móviles que parten simultáneamente en sentidos opuestos con rapideces constantes separadas "
            "por una distancia d, y el Tiempo de Alcance (ta) donde el móvil más veloz persigue al más lento en el mismo sentido."
        ),
        "sections": [
            {
                "heading": "🏛️ Ley Horaria Fundamental y Condiciones del MRU",
                "body": (
                    "• Velocidad Vectorial Constante: \\vec{v} = \\text{constante} \\iff |\\vec{v}| = \\text{constante y trayectoria rectilínea}.\n"
                    "• Aceleración nula: \\vec{a} = 0 m/s².\n"
                    "• Ecuación Escalar Fundamental: d = v · t.\n"
                    "• Factor de Conversión de Unidades de Rapidez:\n"
                    "  - Para convertir de km/h a m/s: multiplicar por 5/18 (ej. 72 km/h × 5/18 = 20 m/s; 90 km/h × 5/18 = 25 m/s).\n"
                    "  - Para convertir de m/s a km/h: multiplicar por 18/5 (ej. 15 m/s × 18/5 = 54 km/h)."
                )
            },
            {
                "heading": "🔬 Despejes Operacionales: Tiempos de Encuentro y Alcance",
                "body": (
                    "1. Tiempo de Encuentro (te):\n"
                    "  Dos móviles A y B separados una distancia d se mueven al encuentro en sentidos opuestos:\n"
                    "  d = d_A + d_B = v_A · te + v_B · te \\implies t_e = \\frac{d}{v_A + v_B}\n"
                    "2. Tiempo de Alcance (ta):\n"
                    "  Dos móviles A y B separados una distancia d se mueven en el mismo sentido, con v_A > v_B:\n"
                    "  d_A = d_B + d \\implies v_A · ta = v_B · ta + d \\implies t_a = \\frac{d}{v_A - v_B}\n"
                    "3. Cruce de Trenes y Túneles:\n"
                    "  La distancia total para que un tren de longitud L_t cruce completamente un túnel o puente de longitud L_p es:\n"
                    "  d_{\\text{total}} = L_t + L_p \\implies t = \\frac{L_t + L_p}{v}"
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Trampas Frecuentes",
                "body": (
                    "• Error típico con trenes: Si un tren cruza a una persona en un poste, d = L_tren. Si cruza un puente o túnel, d = L_tren + L_puente. ¡No olvides sumar la longitud del tren!\n"
                    "• Verificación de unidades: En la UNSA casi siempre dan la distancia en kilómetros (km) o la rapidez en km/h y el tiempo en segundos. Convierte TODO al Sistema Internacional (m y m/s) antes de calcular.\n"
                    "• Si los móviles parten con horas distintas, halla la posición de ventaja del primero con d = v · t_adelanto y luego aplica tiempo de encuentro/alcance con la nueva distancia."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuación Fundamental del MRU y Despejes Operacionales",
            "formula_latex": "d = v \\cdot t \\quad \\iff \\quad t_e = \\frac{d}{v_A + v_B}, \\quad t_a = \\frac{d}{v_A - v_B}",
            "formula_simple": "d = v · t | t_e = d / (v_A + v_B) | t_a = d / (v_A - v_B)",
            "descripcion": "Relación escalar del MRU que describe el desplazamiento lineal con rapidez constante y los tiempos de encuentro y alcance para móviles coplanares.",
            "despejes": [
                {"nombre": "Velocidad constante", "latex": "v = \\frac{d}{t}"},
                {"nombre": "Tiempo de recorrido", "latex": "t = \\frac{d}{v}"},
                {"nombre": "Tiempo de Encuentro", "latex": "t_e = \\frac{d}{v_A + v_B}"},
                {"nombre": "Tiempo de Alcance (v_A > v_B)", "latex": "t_a = \\frac{d}{v_A - v_B}"},
                {"nombre": "Cruce de Tren por Túnel", "latex": "t_{\\text{cruce}} = \\frac{L_{\\text{tren}} + L_{\\text{túnel}}}{v}"}
            ],
            "variables": [
                {"simbolo": "d", "nombre": "Distancia recorrida", "unidad": "Metro [m]"},
                {"simbolo": "v", "nombre": "Rapidez o velocidad escalar", "unidad": "Metro por segundo [m/s]"},
                {"simbolo": "t", "nombre": "Tiempo transcurrido", "unidad": "Segundo [s]"},
                {"simbolo": "t_e", "nombre": "Tiempo de encuentro", "unidad": "Segundo [s]"},
                {"simbolo": "t_a", "nombre": "Tiempo de alcance", "unidad": "Segundo [s]"}
            ],
            "fija_unsa": "Multiplica km/h por 5/18 para m/s. En cruce de túneles: Distancia = Longitud del tren + Longitud del túnel."
        },
        "fijaUnsa": "Fija CEPREUNSA: Para tren que cruza un túnel, d = L_tren + L_túnel. Tiempos de encuentro suman velocidades (d / (vA + vB)), tiempos de alcance las restan (d / (vA - vB)). Convierte con 5/18 a m/s.",
        "takeaway": "En el MRU d = v·t. En sentidos opuestos te = d/(vA+vB); en el mismo sentido ta = d/(vA-vB). En trenes que cruzan puentes se suman ambas longitudes."
    },

    # =========================================================================
    # QUÍMICA (Semanas 1 a 10)
    # =========================================================================
    ("Química", 1, "1.1"): {
        "marcoteorico": (
            "La Química es la ciencia natural que estudia la materia, su composición íntima, estructura molecular y atómica, propiedades "
            "fisicoquímicas y las transformaciones energéticas que experimenta durante las reacciones químicas.\n\n"
            "La materia se define como todo aquello que tiene masa y ocupa un volumen en el espacio (posee inercia y extensión). Las propiedades "
            "de la materia se clasifican según su dependencia de la cantidad de masa: las Propiedades Extensivas o Generales dependen directamente "
            "de la masa del cuerpo (masa, volumen, peso, inercia, capacidad calorífica, porosidad), mientras que las Propiedades Intensivas o Específicas "
            "son independientes de la masa y permiten identificar a una sustancia (densidad, punto de ebullición, punto de fusión, viscosidad, "
            "presión de vapor, dureza, calor específico).\n\n"
            "La densidad de una sustancia pura se define matemáticamente como el cociente entre su masa y el volumen que ocupa: ρ = m / V, siendo "
            "su unidad oficial en el Sistema Internacional el kg/m³, aunque en laboratorio se emplea corrientemente el g/cm³ o g/mL (1 g/cm³ = 1000 kg/m³)."
        ),
        "sections": [
            {
                "heading": "🏛️ Clasificación de la Materia: Sustancias Puras vs Mezclas",
                "body": (
                    "• Sustancia Pura (Composición química fija y constante):\n"
                    "  - Sustancia Simple (Elemento): Formada por átomos del mismo número atómico Z. No se descompone por métodos químicos (ej. O2, Fe, Au, C, N2, P4).\n"
                    "  - Sustancia Compuesta (Compuesto): Formada por dos o más elementos químicos combinados en proporciones atómicas fijas definidas (Ley de Proust). Se descompone por métodos químicos como electrólisis o pirólisis (ej. H2O, NaCl, CO2, C6H12O6).\n"
                    "• Mezcla (Unión física de sustancias en proporciones variables, sin formar enlaces químicos):\n"
                    "  - Mezcla Homogénea (Solución): Posee una sola fase visible (monofásica). Composición uniforme en toda su extensión (ej. aire, agua potable, bronce -Cu+Sn-, latón -Cu+Zn-, acero -Fe+C-, salmuera).\n"
                    "  - Mezcla Heterogénea: Posee dos o más fases visibles (polifásica). Ej. agua con aceite, granito, leche, niebla, sangre (los coloides y suspensiones son heterogéneos)."
                )
            },
            {
                "heading": "🔬 Propiedades Intensivas vs Extensivas y Cambios de Estado",
                "body": (
                    "1. Propiedades Extensivas (Aditivas, dependen de la masa):\n"
                    "  • Masa, Volumen, Longitud, Peso, Inercia, Capacidad Calorífica, Energía Interna, Entalpía.\n"
                    "2. Propiedades Intensivas (No aditivas, NO dependen de la masa):\n"
                    "  • Densidad, Temperatura de ebullición, Temperatura de fusión, Tensión superficial, Dureza (Escala de Mohs: 1 Talco, 10 Diamante), Conductividad eléctrica, Color, Olor, pH.\n"
                    "3. Cambios de Estado Físico (Procesos Isotérmicos):\n"
                    "  • Sólido a Líquido: Fusión. Líquido a Sólido: Solidificación.\n"
                    "  • Líquido a Gas: Vaporización (ebullición / evaporación). Gas a Líquido: Condensación (si es vapor: licuefacción si es gas).\n"
                    "  • Sólido directo a Gas: Sublimación directa (ej. naftalina, hielo seco CO2, yodo I2). Gas a Sólido: Sublimación inversa o Deposición."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Trampas Frecuentes",
                "body": (
                    "• Trampa Fija de la Densidad: La densidad es INTENSIVA. 1 gota de agua y 1000 litros de agua tienen exactamente la misma densidad (1 g/mL a 4 °C).\n"
                    "• El Aire y el Acero: El aire seco filtrado es una MEZCLA HOMOGÉNEA (solución gaseosa). El acero es una solución sólida (mezcla homogénea de Fe y C).\n"
                    "• La Leche y la Gelatina: Aunque a simple vista parezcan homogéneas, son COLOIDES (mezclas heterogéneas con efecto Tyndall).\n"
                    "• Cambio físico vs químico: La digestión, fermentación, combustión y oxidación son QUÍMICOS; la ebullición, disolución y pulverización son FÍSICOS."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuación de la Densidad y Leyes de la Materia",
            "formula_latex": "\\rho = \\frac{m}{V} \\quad \\iff \\quad m = \\rho \\cdot V, \\quad V = \\frac{m}{\\rho}",
            "formula_simple": "Densidad = masa / volumen (ρ = m / V)",
            "descripcion": "Propiedad intensiva fundamental que expresa la masa por unidad de volumen de una sustancia pura o solución.",
            "despejes": [
                {"nombre": "Cálculo de Masa", "latex": "m = \\rho \\cdot V"},
                {"nombre": "Cálculo de Volumen", "latex": "V = \\frac{m}{\\rho}"},
                {"nombre": "Conversión de Densidades", "latex": "1\\text{ g/cm}^3 = 1\\text{ g/mL} = 1000\\text{ kg/m}^3"},
                {"nombre": "Densidad del Agua Líquida a 4°C", "latex": "\\rho_{\\text{H}_2\\text{O}} = 1.0\\text{ g/mL} = 1000\\text{ kg/m}^3"}
            ],
            "variables": [
                {"simbolo": "\\rho", "nombre": "Densidad absoluta", "unidad": "g/mL o kg/m³"},
                {"simbolo": "m", "nombre": "Masa del cuerpo", "unidad": "Gramo [g] o Kilogramo [kg]"},
                {"simbolo": "V", "nombre": "Volumen ocupado", "unidad": "Mililitro [mL] o Metro cúbico [m³]"}
            ],
            "fija_unsa": "La densidad es una propiedad INTENSIVA (no depende de la masa). 1 litro de alcohol y 1 barril tienen la misma densidad."
        },
        "fijaUnsa": "Clave Fija UNSA: La densidad, temperatura de ebullición y dureza son INTENSIVAS. La masa y volumen son EXTENSIVAS. El aire, latón y salmuera son mezclas homogéneas; la leche y la sangre son coloides (heterogéneas).",
        "takeaway": "La materia se divide en sustancias puras (elementos y compuestos) y mezclas (homogéneas y heterogéneas). Las propiedades intensivas no dependen de la cantidad de masa."
    },

    # =========================================================================
    # MATEMÁTICA (Semanas 1 a 10)
    # =========================================================================
    ("Matemática", 1, "1.1"): {
        "marcoteorico": (
            "La Teoría de Exponentes es el conjunto de definiciones, propiedades y teoremas matemáticos que rigen las operaciones de potenciación "
            "y radicación en el campo de los números reales (ℝ).\n\n"
            "La potenciación es una operación binaria donde a partir de una base real 'a' y un exponente entero 'n' se obtiene una potencia: "
            "P = a^n = a · a · ... · a (n factores). Las definiciones cardinales incluyen el exponente cero (a^0 = 1, con a ≠ 0; la expresión 0^0 es indeterminada), "
            "el exponente negativo (a^(-n) = 1 / a^n, con a ≠ 0) y el exponente fraccionario, que enlaza formalmente la potenciación con la radicación: "
            "a^(m/n) = n√(a^m).\n\n"
            "El dominio riguroso de estas leyes algebraicas constituye la herramienta indispensable para simplificar expresiones polinómicas complejas, "
            "resolver ecuaciones exponenciales trascendentes y determinar valores numéricos en los exámenes de admisión de la UNSA."
        ),
        "sections": [
            {
                "heading": "🏛️ Leyes Fundamentales de la Potenciación en ℝ",
                "body": (
                    "• 1. Producto de Bases Iguales: a^m · a^n = a^(m + n).\n"
                    "• 2. Cociente de Bases Iguales: a^m / a^n = a^(m - n) (con a ≠ 0).\n"
                    "• 3. Potencia de Potencia: (a^m)^n = a^(m · n). CUIDADO: (a^m)^n ≠ a^(m^n) (torre de exponentes sin paréntesis se opera de arriba hacia abajo).\n"
                    "• 4. Potencia de un Producto: (a · b)^n = a^n · b^n.\n"
                    "• 5. Potencia de un Cociente: (a / b)^n = a^n / b^n (con b ≠ 0).\n"
                    "• 6. Exponente Negativo: a^(-n) = (1 / a)^n = 1 / a^n; y (a / b)^(-n) = (b / a)^n."
                )
            },
            {
                "heading": "🔬 Leyes de la Radicación y Ecuaciones Exponenciales",
                "body": (
                    "1. Exponente Fraccionario: a^(m/n) = n√(a^m) = (n√a)^m (con a > 0 si n es par).\n"
                    "2. Raíz de un Producto: n√(a · b) = n√a · n√b.\n"
                    "3. Raíz de un Cociente: n√(a / b) = n√a / n√b (con b ≠ 0).\n"
                    "4. Raíz de Raíz: m√(n√a) = (m · n)√a.\n"
                    "5. Ecuaciones Exponenciales:\n"
                    "  • Bases iguales: a^x = a^y \\implies x = y (con a > 0, a ≠ 1).\n"
                    "  • Exponentes iguales: x^a = y^a \\implies x = y (si a es impar) o |x| = |y| (si a es par).\n"
                    "  • Por Semejanza o Analogía: x^x = a^a \\implies x = a."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Casos de Examen",
                "body": (
                    "• La Trampa del Cero a la Cero: 0^0 es una forma INDETERMINADA, no existe como número real.\n"
                    "• Cuidado con la Torre de Exponentes: 2^(3^2) = 2^9 = 512, mientras que (2^3)^2 = 2^6 = 64. ¡Son completamente distintos!\n"
                    "• En problemas de simplificación con factores repetidos (ej. (2^(n+4) - 2·2^n) / (2·2^(n+3))), factoriza siempre la menor potencia (2^n) en el numerador y denominador para cancelarla."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Teoremas Cardinales de la Teoría de Exponentes y Radicación",
            "formula_latex": "a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}, \\quad (a^m)^n = a^{m \\cdot n}, \\quad a^{m/n} = \\sqrt[n]{a^m}",
            "formula_simple": "a^m · a^n = a^(m+n) | (a^m)^n = a^(m·n) | a^(m/n) = n√(a^m)",
            "descripcion": "Leyes fundamentales que gobiernan la reducción y simplificación de términos algebraicos con potencias y radicales en los números reales.",
            "despejes": [
                {"nombre": "Exponente Negativo", "latex": "a^{-n} = \\frac{1}{a^n} \\quad \\iff \\quad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n"},
                {"nombre": "Raíz de Raíz", "latex": "\\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[m \\cdot n]{a}"},
                {"nombre": "Potencia de una Raíz", "latex": "(\\sqrt[n]{a})^m = \\sqrt[n]{a^m} = a^{m/n}"},
                {"nombre": "Ecuación Exponencial Fundamental", "latex": "a^{f(x)} = a^{g(x)} \\implies f(x) = g(x) \\quad (a > 0, a \\neq 1)"}
            ],
            "variables": [
                {"simbolo": "a, b", "nombre": "Bases algebraicas reales", "unidad": "a, b \\in \\mathbb{R}"},
                {"simbolo": "m, n", "nombre": "Exponentes e índices radicales", "unidad": "m, n \\in \\mathbb{R}, n \\ge 2"},
                {"simbolo": "P", "nombre": "Potencia resultante", "unidad": "Valor real en \\mathbb{R}"}
            ],
            "fija_unsa": "En torres de exponentes como x = 2^(3^2), calcula primero 3² = 9 y luego 2⁹ = 512. No multipliques 3×2."
        },
        "fijaUnsa": "Clave Fija UNSA: En torres de exponentes se opera de arriba hacia abajo. a^0 = 1 (a ≠ 0). 0^0 es indeterminado. (a/b)^(-n) = (b/a)^n. En ecuaciones exponenciales, iguala las bases para igualar los exponentes.",
        "takeaway": "a^m · a^n = a^(m+n) y (a^m)^n = a^(m·n). En torres de exponentes sin paréntesis se calcula de arriba hacia abajo. Si las bases son iguales, los exponentes se igualan."
    }
}
