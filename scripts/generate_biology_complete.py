# -*- coding: utf-8 -*-
"""
Generador de las 10 semanas completas (40 subtemas) de BIOLOGÍA para CEPREUNSA / UNSA
Contenido 100% verídico, con rigor científico preuniversitario, sin textos genéricos.
"""
import json

def get_full_biology():
    from scripts.knowledge_biology import BIOLOGY_KNOWLEDGE
    data = dict(BIOLOGY_KNOWLEDGE)

    # SEMANA 2: Bioelementos, Agua, Sales y Glúcidos
    data["2.1"] = {
        "marcoteorico": (
            "Los bioelementos o elementos biogénicos son los componentes químicos que forman parte de la materia viva. "
            "De los más de 118 elementos de la tabla periódica, aproximadamente 27 son indispensables para los organismos.\n\n"
            "Se clasifican cuantitativa y funcionalmente en tres categorías fundamentales:\n"
            "1. Bioelementos Primarios u Organógenos (C, H, O, N, P, S): Constituyen el 96% al 99% de la masa celular total. "
            "Poseen bajo peso atómico y gran capacidad de formar enlaces covalentes estables (simples, dobles y triples), "
            "destacando el Carbono por su propiedad de tetravalencia y autosaturación para originar cadenas hidrocarbonadas lineales, ramificadas y cíclicas.\n"
            "2. Bioelementos Secundarios: Representan aproximadamente el 3.9% de la masa celular. Incluyen cationes y aniones fundamentales: "
            "Sodio (Na+) y Potasio (K+) que regulan la bomba de sodio-potasio y la conducción del impulso nervioso (Na+ extracelular predominante, K+ intracelular); "
            "Calcio (Ca2+) indispensable para la coagulación sanguínea, contracción del sarcómero muscular y rigidez ósea (hidroxiapatita); "
            "Magnesio (Mg2+) presente como átomo central del anillo de porfirina de la clorofila y activador enzimático; "
            "Cloro (Cl-) principal anión extracelular y componente del ácido clorhídrico gástrico.\n"
            "3. Oligoelementos o Elementos Traza: Presentes en concentraciones inferiores al 0.1%, pero indispensables para el metabolismo vital: "
            "Hierro (Fe) en el grupo hemo de la hemoglobina y mioglobina (su déficit causa anemia ferropénica); Yodo (I) en las hormonas tiroideas T3 y T4 "
            "(su carencia produce bocio simple); Cobre (Cu) en la hemocianina de moluscos y artrópodos; Flúor (F) en el esmalte dental (previene caries); "
            "Cobalto (Co) en la vitamina B12 (cobalamina); y Cinc (Zn) en la anhidrasa carbónica y cicatrización celular."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Químico: Clasificación de Bioelementos",
                "body": (
                    "• Bioelementos Primarios (CHONPS): 96-99% de la materia viva. Forman las biomoléculas orgánicas.\n"
                    "• Carbono: Tetravalencia, forma enlaces covalentes C-C estables base de la química orgánica.\n"
                    "• Bioelementos Secundarios (Na, K, Ca, Mg, Cl): Mantienen el potencial de membrana, contracción muscular y equilibrio osmótico.\n"
                    "• Oligoelementos (<0.1%): Fe, I, Cu, F, Co, Zn, Mn. Actúan como cofactores enzimáticos y componentes hormonales."
                )
            },
            {
                "heading": "🔬 Funciones Clave y Patologías por Deficiencia",
                "body": (
                    "• Hierro (Fe): Núcleo de la hemoglobina (transporte de O2). Carencia: Anemia ferropénica o microcítica.\n"
                    "• Yodo (I): Síntesis de tiroxina (T4) y triyodotironina (T3). Carencia: Bocio endémico e hipotiroidismo.\n"
                    "• Magnesio (Mg): Núcleo de la molécula de Clorofila en vegetales. Carencia: Clorosis foliar.\n"
                    "• Calcio (Ca): Coagulación sanguínea (factor IV), contracción muscular, formación de huesos y dientes.\n"
                    "• Na+ y K+: Na+ es el catión extracelular más abundante; K+ es el catión intracelular más abundante."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Preguntas Fijas",
                "body": (
                    "• Clorofila vs Hemoglobina: Clorofila tiene MAGNESIO (Mg2+) en su centro; Hemoglobina tiene HIERRO (Fe2+).\n"
                    "• Bomba Na+/K+: Por cada 3 iones Na+ bombeados al exterior, entran 2 iones K+ con gasto de 1 ATP.\n"
                    "• Cinc (Zn): Cofactor de la anhidrasa carbónica y promotor de la transcripción (dedos de zinc) y cicatrización."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuación de la Bomba de Sodio-Potasio ATPasa",
            "formula_latex": "3\\,\\text{Na}^+_{\\text{intracelular}} + 2\\,\\text{K}^+_{\\text{extracelular}} + \\text{ATP} \\to 3\\,\\text{Na}^+_{\\text{extracelular}} + 2\\,\\text{K}^+_{\\text{intracelular}} + \\text{ADP} + P_i",
            "formula_simple": "3 Na+ salen + 2 K+ entran + 1 ATP gastado",
            "descripcion": "Transporte activo primario que mantiene el potencial de reposo celular (-70 mV) y el gradiente electroquímico vital.",
            "despejes": [
                {"nombre": "Balance Estequiométrico Iónico", "latex": "\\Delta Q = +1\\,e \\text{ neto hacia el exterior por ciclo}"},
                {"nombre": "Distribución Fisiológica", "latex": "[\\text{Na}^+]_{ext} > [\\text{Na}^+]_{int} \\quad \\land \\quad [\\text{K}^+]_{int} > [\\text{K}^+]_{ext}"}
            ],
            "variables": [
                {"simbolo": "Na+", "nombre": "Sodio", "unidad": "Catión extracelular principal (140 mEq/L)"},
                {"simbolo": "K+", "nombre": "Potasio", "unidad": "Catión intracelular principal (120 mEq/L)"},
                {"simbolo": "ATP", "nombre": "Adenosín trifosfato", "unidad": "Fuente de energía química fosfato"}
            ],
            "fija_unsa": "En CEPREUNSA es fija: ¿Qué bioelemento es el núcleo químico de la clorofila? Clave: MAGNESIO (Mg). Si preguntan por la hemoglobina: HIERRO (Fe)."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Bioelementos primarios = CHONPS (96%). Magnesio está en la clorofila; Hierro en la hemoglobina; Yodo en la tiroxina. Na+ es el catión extracelular y K+ el intracelular.",
        "takeaway": "Los bioelementos primarios forman la estructura molecular; los secundarios mantienen los gradientes iónicos (Na+/K+) y los oligoelementos catalizan funciones vitales (Fe, Mg, I)."
    }

    data["2.2"] = {
        "marcoteorico": (
            "El agua (H2O) es la biomolécula inorgánica más abundante de los seres vivos, representando en promedio del 65% al 75% de la masa "
            "de un organismo adulto. Su estructura molecular consiste en un átomo de oxígeno unido covalentemente a dos átomos de hidrógeno, "
            "formando un ángulo de enlace de 104.5°. Debido a la elevada electronegatividad del oxígeno, la molécula es un DIPOLO ELÉCTRICO "
            "(densidad de carga negativa en el oxígeno y positiva en los hidrógenos), lo que le permite establecer PUENTES DE HIDRÓGENO "
            "intermoleculares (cada molécula de agua puede formar hasta 4 puentes de hidrógeno).\n\n"
            "Estas uniones confieren al agua propiedades fisicoquímicas excepcionales indispensables para la vida:\n"
            "1. Elevada Tensión Superficial y Cohesión: Las fuerzas de cohesión entre moléculas superficiales crean una película resistente "
            "que permite el desplazamiento de insectos sobre el agua (zapateros) y, junto con las fuerzas de adhesión a paredes polares, "
            "determina la CAPILARIDAD (ascenso de la savia bruta por los vasos leñosos del xilema sin gasto de energía).\n"
            "2. Elevado Calor Específico: Requiere 1 cal/g·°C para elevar su temperatura, lo que la convierte en un excelente TERMORREGULADOR, "
            "amortiguando las variaciones bruscas de temperatura en los organismos y el planeta.\n"
            "3. Elevado Calor de Vaporización: Absorbe gran cantidad de calor al evaporarse (540 cal/g), permitiendo la refrigeración corporal mediante la sudoración.\n"
            "4. Solvente Universal: Por su constante dieléctrica elevada, disuelve sustancias iónicas y polares, siendo el medio donde ocurren todas las reacciones metabólicas.\n"
            "5. Densidad Anómala: El agua alcanza su máxima densidad a 4 °C; el hielo flota debido a su estructura cristalina hexagonal menos densa, "
            "aislando térmicamente el fondo de lagos y mares y permitiendo la supervivencia acuática en climas fríos."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Molecular: Estructura Dipolar y Puentes de Hidrógeno",
                "body": (
                    "• Molécula Dipolar: Ángulo de 104.5°, oxígeno electronegativo con carga parcial negativa (δ-) e hidrógenos con carga parcial positiva (δ+).\n"
                    "• Puente de Hidrógeno: Enlace intermolecular electrostático débil pero abundante. Cada molécula puede unirse a otras 4.\n"
                    "• Solvente Universal: Rompe enlaces iónicos formando esferas de solvatación alrededor de aniones y cationes."
                )
            },
            {
                "heading": "🔬 Propiedades Fisicoquímicas y Funciones Biológicas",
                "body": (
                    "• Cohesión y Adhesión: Cohesión une agua con agua; adhesión une agua con superficies polares. Juntas explican la Capilaridad (transporte en xilema).\n"
                    "• Alto Calor Específico: Termorregulador biológico por excelencia. Evita fluctuaciones térmicas celulares letales.\n"
                    "• Alto Calor de Vaporización: Enfriamiento evaporativo mediante transpiración y sudoración.\n"
                    "• Densidad Anómala: Hielo flota sobre agua líquida (máxima densidad a 4 °C), preservando la vida acuática bajo capas de hielo."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Casos de Examen",
                "body": (
                    "• Capilaridad en Plantas: La savia bruta sube por capilaridad y tensión superficial a través del XILEMA.\n"
                    "• Termorregulación: Pregunta fija; el agua actúa como amortiguador térmico gracias a su ELEVADO CALOR ESPECÍFICO.\n"
                    "• Puentes de Hidrógeno: Son los responsables de casi todas las propiedades singulares del agua; se rompen con el calor y se reorganizan continuamente."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Ecuación de Capilaridad de Jurin y Calorimetría Hídrica",
            "formula_latex": "h = \\frac{2\\,\\gamma \\cos\\theta}{\\rho \\cdot g \\cdot r} \\quad \\land \\quad Q = m \\cdot C_e \\cdot \\Delta T \\quad [C_e = 1\\,\\text{cal/g}^{\\circ}\\text{C}]",
            "formula_simple": "h = 2γ cosθ / (ρ g r)  [Capilaridad del Agua]",
            "descripcion": "Ley de Jurin que rige el ascenso capilar del agua en conductos leñosos estrechos por tensión superficial y adhesión molecular.",
            "despejes": [
                {"nombre": "Calor Absorbido por Sudoración", "latex": "Q_v = m \\cdot L_v \\quad [L_v = 540\\,\\text{cal/g}]"},
                {"nombre": "Geometría Molecular H2O", "latex": "\\angle(\\text{H-O-H}) = 104.5^{\\circ} \\implies \\mu \\neq 0 \\text{ (Dipolo permanente)}"}
            ],
            "variables": [
                {"simbolo": "γ", "nombre": "Tensión superficial del agua", "unidad": "0.0728 N/m a 20 °C"},
                {"simbolo": "r", "nombre": "Radio del tubo capilar (vaso del xilema)", "unidad": "Metros (m)"},
                {"simbolo": "Ce", "nombre": "Calor específico del agua líquida", "unidad": "1 cal/(g·°C) = 4184 J/(kg·K)"}
            ],
            "fija_unsa": "En UNSA, la propiedad del agua que permite a las plantas elevar agua desde las raíces hasta las copas de árboles gigantes es la CAPILARIDAD (cohesión-tensión)."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: El agua es termorreguladora por su ALTO CALOR ESPECÍFICO. La capilaridad resulta de la cohesión (puentes de H) y adhesión. El hielo flota porque su máxima densidad es a 4 °C.",
        "takeaway": "El dipolo del agua y sus puentes de hidrógeno explican su alto calor específico (termorregulador), capilaridad (transporte en xilema) y densidad anómala."
    }

    data["2.3"] = {
        "marcoteorico": (
            "Los glúcidos, carbohidratos, azúcares o sacáridos son biomoléculas orgánicas ternarias compuestas fundamentalmente por C, H y O "
            "(fórmula general Cn(H2O)n). Químicamente se definen como polihidroxialdehídos (aldosas) o polihidroxicetonas (cetosas), "
            "y constituyen la principal FUENTE DE ENERGÍA INMEDIATA de la célula (aportando aproximadamente 4 kcal/gramo).\n\n"
            "Se clasifican según su grado de polimerización en:\n"
            "1. Monosacáridos (Azúcares simples, no hidrolizables): Monómeros con sabor dulce y solubles en agua. "
            "Se clasifican por número de carbonos en triosas (gliceraldehído, dihidroxiacetona), tetrosas (eritrosa), "
            "pentosas (ribosa en ARN y ATP, desoxirribosa en ADN, ribulosa que fija el CO2 en la fotosíntesis mediante la enzima RuBisCO) "
            "y hexosas (Glucosa o dextrosa: combustible metabólico universal del cerebro y hematíes; Galactosa: constituyente de la leche; "
            "Fructosa o levulosa: azúcar de las frutas y semen, única fuente de energía del espermatozoide).\n"
            "2. Disacáridos: Formados por la unión de dos monosacáridos mediante el ENLACE GLUCOSÍDICO con liberación de una molécula de agua (síntesis por deshidratación):\n"
            "  • Maltosa (azúcar de malta): Glucosa + Glucosa unidos por enlace α(1→4). Se obtiene por digestión del almidón.\n"
            "  • Lactosa (azúcar de la leche): Galactosa + Glucosa unidos por enlace β(1→4). Su degradación requiere lactasa.\n"
            "  • Sacarosa (azúcar de mesa o caña): Glucosa + Fructosa unidos por enlace α(1→2). Es el azúcar de transporte en la savia elaborada de las plantas y carece de poder reductor."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Bioquímico: Estructura de Monosacáridos",
                "body": (
                    "• Fórmula empírica: Cn(H2O)n. Función biológica principal: Energética inmediata (4 kcal/g).\n"
                    "• Aldosas (Grupo aldehído -CHO en C1): Glucosa, Galactosa, Ribosa, Gliceraldehído.\n"
                    "• Cetosas (Grupo cetona -C=O en C2): Fructosa, Ribulosa, Dihidroxiacetona.\n"
                    "• Isomería: Glucosa, Galactosa y Fructosa comparten la misma fórmula molecular C6H12O6 (son isómeros)."
                )
            },
            {
                "heading": "🔬 Disacáridos y el Enlace Glucosídico",
                "body": (
                    "• Enlace Glucosídico: Enlace covalente tipo éter entre dos grupos hidroxilo (-OH) con desprendimiento de H2O.\n"
                    "• Maltosa: α-D-glucosa + α-D-glucosa con enlace α(1→4).\n"
                    "• Lactosa: β-D-galactosa + α-D-glucosa con enlace β(1→4).\n"
                    "• Sacarosa: α-D-glucosa + β-D-fructosa con enlace α(1→2). No tiene carbono anomérico libre (azúcar no reductor).\n"
                    "• Trehalosa: Glucosa + Glucosa α(1→1), disacárido de reserva en la hemolinfa de los insectos."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Preguntas Típicas",
                "body": (
                    "• Glucosa: Azúcar de la sangre o dextrosa. Combustible obligatorio de neuronas y glóbulos rojos.\n"
                    "• Fructosa: Azúcar más dulce; nutre a los espermatozoides en el líquido seminal (secretado por vesículas seminales).\n"
                    "• Ribulosa-1,5-bisfosfato: Pentosa que fija el CO2 atmosférico en el ciclo de Calvin de la fotosíntesis."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Formación del Enlace Glucosídico y Combustión de Glucosa",
            "formula_latex": "\\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{Enlace } \\alpha(1\\to2)} \\text{C}_{12}\\text{H}_{22}\\text{O}_{11} \\text{ (Sacarosa)} + \\text{H}_2\\text{O}",
            "formula_simple": "Glucosa + Fructosa -> Sacarosa + H2O [Enlace α(1→2)]",
            "descripcion": "Reacción de condensación con deshidratación para formar disacáridos mediante enlace glucosídico covalente.",
            "despejes": [
                {"nombre": "Oxidación Celular de Glucosa", "latex": "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\,\\text{O}_2 \\to 6\\,\\text{CO}_2 + 6\\,\\text{H}_2\\text{O} + 36-38\\,\\text{ATP}"},
                {"nombre": "Componentes de Disacáridos", "latex": "\\begin{aligned} \\text{Maltosa} &= \\text{Glucosa} + \\text{Glucosa} \\\\ \\text{Lactosa} &= \\text{Glucosa} + \\text{Galactosa} \\\\ \\text{Sacarosa} &= \\text{Glucosa} + \\text{Fructosa} \\end{aligned}"}
            ],
            "variables": [
                {"simbolo": "C6H12O6", "nombre": "Hexosa monómero (Glucosa, Fructosa)", "unidad": "Masa molar 180 g/mol"},
                {"simbolo": "C12H22O11", "nombre": "Disacárido (Sacarosa, Maltosa, Lactosa)", "unidad": "Masa molar 342 g/mol"}
            ],
            "fija_unsa": "Pregunta fija UNSA: ¿Qué azúcar alimenta al espermatozoide en el líquido seminal? Clave: FRUCTOSA. ¿Qué azúcar forma la sacarosa? Clave: Glucosa + Fructosa."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Glúcidos aportan 4 kcal/g. Monosacáridos hexosas: Glucosa, Fructosa y Galactosa. Sacarosa = Glucosa + Fructosa [α(1→2)]. Maltosa = Glucosa + Glucosa [α(1→4)]. Lactosa = Galactosa + Glucosa [β(1→4)].",
        "takeaway": "Los monosacáridos son combustibles celulares inmediatos (glucosa). Se unen por enlace glucosídico liberando H2O para formar disacáridos como sacarosa, maltosa y lactosa."
    }

    data["2.4"] = {
        "marcoteorico": (
            "Los polisacáridos son macromoléculas biológicas formadas por la polimerización condensada de cientos o miles de unidades "
            "de monosacáridos (principalmente glucosas) mediante enlaces glucosídicos. A diferencia de los azúcares simples, son insolubles en agua, "
            "no tienen sabor dulce, no cristalizan y carecen de poder reductor.\n\n"
            "Se clasifican funcionalmente en dos grandes categorías preuniversitarias:\n"
            "1. Polisacáridos de Reserva Energética:\n"
            "  • Almidón: Reserva energética por excelencia de las células vegetales (acumulado en raíces, tubérculos y semillas en amiloplastos). "
            "Está formado por dos fracciones: Amilosa (20-30%, polímero lineal de glucosas con enlaces α(1→4) enrollado en hélice) "
            "y Amilopectina (70-80%, polímero ramificado de glucosas con enlaces α(1→4) en cadena lineal y ramificaciones con enlaces α(1→6) cada 24-30 glucosas).\n"
            "  • Glucógeno: Reserva energética de los animales, hongos y bacterias. Se almacena fundamentalmente en el HÍGADO (para regular la glucemia sanguínea) "
            "y en el MÚSCULO ESQUELÉTICO (para consumo propio durante la contracción). Su estructura es similar a la amilopectina pero mucho más ramificada "
            "(ramificaciones α(1→6) cada 8-12 glucosas), lo que permite una hidrólisis rápida y eficiente (glucogenólisis estimulada por el glucagón y adrenalina).\n"
            "2. Polisacáridos Estructurales:\n"
            "  • Celulosa: Componente fundamental de la pared celular vegetal. Polímero lineal no ramificado de β-D-glucosas unidas por enlaces β(1→4). "
            "Los mamíferos no pueden digerirla porque carecen de la enzima celulasa (actúa como fibra dietética insoluble).\n"
            "  • Quitina: Componente estructural de la pared celular de los HONGOS y del exoesqueleto de los ARTRÓPODOS (insectos, arácnidos, crustáceos). "
            "Es un polímero no ramificado de N-acetilglucosamina (NAG) unidas por enlaces β(1→4)."
        ),
        "sections": [
            {
                "heading": "🏛️ Fundamento Estructural: Homopolisacáridos y Tipo de Enlace",
                "body": (
                    "• Enlace α-glucosídico: Enlaces fácilmente hidrolizables por amilasas animales. Función de reserva energética (Almidón y Glucógeno).\n"
                    "• Enlace β-glucosídico: Enlaces rígidos y resistentes a enzimas digestivas humanas. Función estructural (Celulosa y Quitina).\n"
                    "• Lugol: Reactivo que tiñe de azul oscuro/violeta al almidón por atrapamiento de yodo en la hélice de amilosa."
                )
            },
            {
                "heading": "🔬 Comparación Analítica de los 4 Grandes Polisacáridos",
                "body": (
                    "1. Almidón: Vegetal, reserva. Amilosa lineal α(1→4) + Amilopectina ramificada α(1→6).\n"
                    "2. Glucógeno: Animal y hongos, reserva. Hígado (glucemia) y Músculo. Altamente ramificado con enlaces α(1→6).\n"
                    "3. Celulosa: Vegetal, estructural (pared celular). Cadenas paralelas de glucosa β(1→4) estabilizadas por puentes de hidrógeno intercatenarios.\n"
                    "4. Quitina: Hongos y artrópodos, estructural. Monómero: N-acetil-D-glucosamina (NAG) con enlace β(1→4). Contiene nitrógeno."
                )
            },
            {
                "heading": "💡 Claves de Admisión UNSA y Preguntas Frecuentes",
                "body": (
                    "• Pared de hongos vs pared de plantas: Los hongos tienen QUITINA (polímero con nitrógeno); las plantas tienen CELULOSA.\n"
                    "• Exoesqueleto de insectos: Su dureza inicial proviene de la QUITINA (endurecida luego por esclerotización o sales de calcio en crustáceos).\n"
                    "• Almacenamiento animal: Si en la UNSA preguntan dónde se almacena el glucógeno: HÍGADO Y MÚSCULO."
                )
            }
        ],
        "formula": {
            "teorema_nombre": "Estructura Polimérica de Glucógeno y Celulosa",
            "formula_latex": "\\text{Glucógeno} = [\\alpha\\text{-D-Glucosa}]_{n} \\quad (\\text{Enlaces } \\alpha(1\\to4) \\text{ lineal}, \\, \\alpha(1\\to6) \\text{ ramificado})",
            "formula_simple": "Almidón/Glucógeno: Enlace α(1→4) y α(1→6)  |  Celulosa/Quitina: Enlace β(1→4)",
            "descripcion": "Diferenciación de enlaces glucosídicos: los enlaces alfa sirven de reserva energética digestible, mientras los beta forman fibras estructurales insolubles.",
            "despejes": [
                {"nombre": "Celulosa Estructural", "latex": "\\text{Celulosa} = [\\beta\\text{-D-Glucosa}]_{n} \\quad (\\text{Enlace } \\beta(1\\to4) \\text{ resistente a amilasas})"},
                {"nombre": "Quitina con Nitrógeno", "latex": "\\text{Quitina} = [\\text{N-acetilglucosamina}]_{n} \\quad [\\text{Pared de hongos y artrópodos}]"}
            ],
            "variables": [
                {"simbolo": "n", "nombre": "Grado de polimerización", "unidad": "Desde 300 hasta más de 100,000 monómeros"},
                {"simbolo": "NAG", "nombre": "N-acetilglucosamina", "unidad": "Derivado aminado de la glucosa monómero de quitina"}
            ],
            "fija_unsa": "Pregunta de rigor UNSA: ¿Qué tienen en común la pared celular de los hongos y el exoesqueleto de los artrópodos? Clave: Ambos contienen QUITINA."
        },
        "fijaUnsa": "Clave Fija CEPREUNSA: Almidón = reserva vegetal; Glucógeno = reserva animal (hígado y músculo). Celulosa = pared vegetal [enlaces β(1→4)]; Quitina = pared de hongos y caparazón de insectos (monómero: N-acetilglucosamina).",
        "takeaway": "Los polisacáridos de reserva (almidón y glucógeno) usan enlaces alfa digeribles; los polisacáridos estructurales (celulosa y quitina) usan enlaces beta insolubles y rígidos."
    }

    return data

if __name__ == "__main__":
    b = get_full_biology()
    print("Biology subtopics ready:", len(b))
