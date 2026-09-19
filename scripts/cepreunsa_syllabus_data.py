# -*- coding: utf-8 -*-
"""
Estructura curricular oficial de los 15 cursos de CEPREUNSA I FASE 2027 (10 semanas completas)
Extraída y contrastada con los Tomos Digitales de CEPREUNSA y la Matriz de Evaluación Oficial de la UNSA.
"""

SYLLABUS = {
    "Biología": {
        "area": "General",
        "icon": "🧬",
        "color": "#10B981",
        "gradient": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "desc": "Origen de la vida, bioquímica, células, histología, anatomía, genética y ecología.",
        "asigBanco": "Biología",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Origen de la Vida, Evolución y Niveles de Organización",
                "topics": [
                    {"title": "Concepto de Biología y Ramas de Especialización", "short": "Concepto y Ramas", "icon": "🔬", "kw": "biología"},
                    {"title": "Teorías del Origen: Espontánea, Panspermia y Quimiosintética", "short": "Origen de la Vida", "icon": "✨", "kw": "origen"},
                    {"title": "Teorías Evolutivas: Lamarck, Darwin-Wallace y Neodarwinismo", "short": "Evolución Biológica", "icon": "🦕", "kw": "evolución"},
                    {"title": "Niveles de Organización de la Materia Viva, Taxonomía y Virus (Ciclo Lítico y Lisogénico)", "short": "Niveles, Virus y Ciclos", "icon": "📊", "kw": "virus"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Bioelementos, Agua, Sales Minerales y Glúcidos",
                "topics": [
                    {"title": "Bioelementos Primarios (CHONPS), Secundarios y Oligoelementos", "short": "Bioelementos", "icon": "🧪", "kw": "bioelementos"},
                    {"title": "El Agua: Tensión Superficial, Calor Específico y Capilaridad", "short": "Propiedades del Agua", "icon": "💧", "kw": "agua"},
                    {"title": "Glúcidos: Monosacáridos (Glucosa, Fructosa) y Disacáridos", "short": "Monosacáridos y Azúcares", "icon": "🍞", "kw": "glucosa"},
                    {"title": "Polisacáridos de Reserva y Estructurales: Glucógeno, Almidón y Celulosa", "short": "Polisacáridos", "icon": "🌾", "kw": "almidón"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Lípidos, Proteínas, Enzimas y Ácidos Nucleicos",
                "topics": [
                    {"title": "Lípidos Simples, Complejos (Fosfolípidos) e Isoprenoides", "short": "Lípidos y Grasas", "icon": "🥑", "kw": "lípidos"},
                    {"title": "Proteínas: Estructura, Clasificación y Enlace Peptídico", "short": "Proteínas", "icon": "🥩", "kw": "proteína"},
                    {"title": "Enzimas y Cinética Enzimática: Centro Activo e Inhibidores", "short": "Enzimas y Catálisis", "icon": "⚡", "kw": "enzima"},
                    {"title": "Ácidos Nucleicos: ADN, ARN y el Dogma Central de la Biología", "short": "ADN, ARN y Dogma", "icon": "🧬", "kw": "adn"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Citología - Célula Procariota y Eucariota",
                "topics": [
                    {"title": "Célula Procariota: Pared Celular, Flagelos y Plásmidos", "short": "Célula Procariota", "icon": "🦠", "kw": "procariota"},
                    {"title": "Membrana Celular: Mosaico Fluido y Transporte Activo y Pasivo", "short": "Membrana Celular", "icon": "🛡️", "kw": "membrana"},
                    {"title": "Citoplasma y Organelos: Mitocondrias, Cloroplastos y Ribosomas", "short": "Organelos Celulares", "icon": "⚙️", "kw": "mitocondria"},
                    {"title": "Núcleo Celular, Envoltura Nuclear, Cromatina y Cromosomas", "short": "Núcleo y Cromatina", "icon": "🎯", "kw": "núcleo"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Ciclo Celular, Mitosis, Meiosis y Gametogénesis",
                "topics": [
                    {"title": "Ciclo Celular: Fases G1, S, G2 y Regulación por Ciclinas", "short": "Ciclo e Interfase", "icon": "⏳", "kw": "interfase"},
                    {"title": "Mitosis: Profase, Metafase, Anafase y Telofase en Somáticas", "short": "Mitosis Celular", "icon": "✂️", "kw": "mitosis"},
                    {"title": "Meiosis: Meiosis I (Crossing-Over en Paquiteno) y Meiosis II", "short": "Meiosis y Variabilidad", "icon": "🔀", "kw": "meiosis"},
                    {"title": "Gametogénesis Humana: Espermatogénesis y Ovogénesis", "short": "Gametogénesis", "icon": "🥚", "kw": "gameto"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Dominios, Reinos Biológicos e Histología Vegetal",
                "topics": [
                    {"title": "Dominios Archaea, Bacteria y Eukarya y los 5 Reinos", "short": "Dominios y Reinos", "icon": "👑", "kw": "reino"},
                    {"title": "Reino Plantae: Criptógamas (Briófitas, Pteridófitas) y Fanerógamas", "short": "Reino Plantae", "icon": "🌿", "kw": "plantas"},
                    {"title": "Histología Vegetal: Tejidos Meristemáticos y Adultos (Xilema y Floema)", "short": "Tejidos Vegetales", "icon": "🌱", "kw": "xilema"},
                    {"title": "Fotosíntesis: Fase Fotoquímica (Tilacoides) y Fase Biosintética (Estroma)", "short": "Fotosíntesis y Cloroplastos", "icon": "☀️", "kw": "fotosíntesis"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Histología Animal y Sistema Digestivo Humano",
                "topics": [
                    {"title": "Tejido Epitelial y Tejido Conectivo (Óseo, Cartilaginoso y Sangre)", "short": "Epitelial y Conectivo", "icon": "🔬", "kw": "epitelial"},
                    {"title": "Tejido Muscular y Tejido Nervioso: Neuronas, Glías y Sinapsis", "short": "Muscular y Nervioso", "icon": "⚡", "kw": "neurona"},
                    {"title": "Aparato Digestivo Humano: Boca, Esófago, Estómago e Intestinos", "short": "Aparato Digestivo", "icon": "🍎", "kw": "digestivo"},
                    {"title": "Fisiología Digestiva: Secreción Enzimática y Absorción de Nutrientes", "short": "Fisiología Digestiva", "icon": "💧", "kw": "digestión"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Sistemas Cardiovascular, Excretor, Nervioso y Endocrino",
                "topics": [
                    {"title": "Sistemas Respiratorio y Cardiovascular: Hematosis, Ciclo Cardíaco y Grupos Sanguíneos ABO/Rh", "short": "Cardiovascular y Respiratorio", "icon": "🫁", "kw": "respiratorio"},
                    {"title": "Sistema Excretor Humano: Anatomía Renal y Fisiología del Nefrón (Filtración y Reabsorción)", "short": "Excretor y Nefrón", "icon": "🧪", "kw": "nefrón"},
                    {"title": "Sistema Nervioso Humano: Sinapsis Química, Neurotransmisores, Encéfalo, Médula Espinal y Arco Reflejo", "short": "Sistema Nervioso y Sinapsis", "icon": "⚡", "kw": "neurona"},
                    {"title": "Sistema Endocrino Humano: Glándulas (Hipófisis, Tiroides, Páncreas e Insulina/Glucagón) y Retroalimentación", "short": "Sistema Endocrino y Hormonas", "icon": "🩸", "kw": "endocrino"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Genética Mendeliana, Inmunología Humana y Biotecnología",
                "topics": [
                    {"title": "Leyes de Mendel: Ley de la Segregación y Distribución Independiente con Proporciones Fenotípicas", "short": "Leyes de Mendel", "icon": "🌱", "kw": "mendel"},
                    {"title": "Herencia Post-mendeliana, Herencia Ligada al Sexo y Cariotipo Humano (Síndromes de Down, Turner y Klinefelter)", "short": "Cromosomas y Síndromes", "icon": "🧬", "kw": "daltonismo"},
                    {"title": "Sistema Inmunológico y Patologías Humanas: Inmunidad Celular y Humoral, Vacunas, Sueros y Enfermedades (TBC, Dengue, VIH)", "short": "Inmunología y Patologías", "icon": "🛡️", "kw": "inmunidad"},
                    {"title": "Biotecnología y Bioética: ADN Recombinante, PCR, Organismos Transgénicos y Edición Genética CRISPR-Cas9", "short": "Biotecnología y CRISPR", "icon": "🔬", "kw": "biotecnología"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Ecología, Ecorregiones, Sostenibilidad y ODS",
                "topics": [
                    {"title": "Ecosistemas: Factores Bióticos, Abióticos, Hábitat y Nicho Ecológico", "short": "Ecosistemas y Nicho", "icon": "🏞️", "kw": "ecosistema"},
                    {"title": "Dinámica Trófica y Relaciones Bióticas (Mutualismo, Parasitismo)", "short": "Redes Tróficas", "icon": "🦅", "kw": "trófica"},
                    {"title": "Las 11 Ecorregiones del Perú (Brack Egg) y Áreas Naturales Protegidas (ANP)", "short": "Ecorregiones y ANP", "icon": "🇵🇪", "kw": "ecorregiones"},
                    {"title": "Impacto Ambiental, Cambio Climático, Sostenibilidad y Objetivos de Desarrollo Sostenible (ODS)", "short": "Sostenibilidad y ODS", "icon": "🌍", "kw": "sostenibilidad"}
                ]
            }
        ]
    },

    "Física": {
        "area": "General",
        "icon": "⚡",
        "color": "#EAB308",
        "gradient": "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
        "desc": "Análisis dimensional, vectores, cinemática, leyes de Newton, estática, trabajo, fluidos, calor y electromagnetismo.",
        "asigBanco": "Física",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Análisis Dimensional y Álgebra Vectorial",
                "topics": [
                    {"title": "Magnitudes Físicas Fundamentales y Ecuaciones Dimensionales", "short": "Análisis Dimensional", "icon": "📐", "kw": "dimensional"},
                    {"title": "Principio de Homogeneidad Dimensional (Fourier) y Casos Especiales", "short": "Homogeneidad Fourier", "icon": "⚖️", "kw": "homogeneidad"},
                    {"title": "Vectores en 2D: Componentes Rectangulares y Vector Unitario", "short": "Vectores y Componentes", "icon": "↗️", "kw": "vectores"},
                    {"title": "Operaciones Vectoriales: Método del Paralelogramo y Polígono", "short": "Métodos Vectoriales", "icon": "🎯", "kw": "resultante"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Cinemática Lineal y Caída Libre",
                "topics": [
                    {"title": "Movimiento Rectilíneo Uniforme (MRU): Ecuaciones y Gráficas de Posición", "short": "MRU y Gráficas", "icon": "🚗", "kw": "mru"},
                    {"title": "Movimiento Rectilíneo Uniformemente Variado (MRUV): Aceleración Constante", "short": "MRUV y Aceleración", "icon": "🏎️", "kw": "mruv"},
                    {"title": "Movimiento Vertical de Caída Libre (MVCL): Ecuaciones con Gravedad", "short": "Caída Libre (MVCL)", "icon": "🍎", "kw": "caída libre"},
                    {"title": "Tiempo de Encuentro, Tiempo de Alcance y Gráficas de Velocidad", "short": "Encuentro y Gráficas", "icon": "📈", "kw": "alcance"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Movimiento Parabólico y Movimiento Circular",
                "topics": [
                    {"title": "Movimiento Parabólico de Caída Libre (MPCL): Descomposición Ortogonal", "short": "Parabólico (MPCL)", "icon": "🚀", "kw": "parabólico"},
                    {"title": "Tiempo de Vuelo, Altura Máxima y Alcance Horizontal en MPCL", "short": "Alcance y Altura Máx", "icon": "🎯", "kw": "altura máxima"},
                    {"title": "Movimiento Circular Uniforme (MCU): Velocidad Angular, Frecuencia y Periodo", "short": "MCU y Periodo", "icon": "🔄", "kw": "circular"},
                    {"title": "Aceleración Centrípeta y Transmisión de Movimiento por Fajas y Poleas", "short": "Centrípeta y Fajas", "icon": "⚙️", "kw": "centrípeta"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Estática - Equilibrio de Fuerzas y Momentos",
                "topics": [
                    {"title": "Fuerzas en la Naturaleza y Diagrama de Cuerpo Libre (DCL)", "short": "DCL y Fuerzas", "icon": "✏️", "kw": "cuerpo libre"},
                    {"title": "Primera Condición de Equilibrio: Sumatoria de Fuerzas = Cero", "short": "1ra Cond. Equilibrio", "icon": "⚖️", "kw": "equilibrio"},
                    {"title": "Momento de una Fuerza o Torque (M = F · d) y Sentido de Giro", "short": "Momento de Fuerza", "icon": "🔧", "kw": "torque"},
                    {"title": "Segunda Condición de Equilibrio: Equilibrio Rotacional de Palancas", "short": "2da Cond. Equilibrio", "icon": "🏗️", "kw": "rotacional"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Dinámica Lineal, Fricción y Dinámica Circular",
                "topics": [
                    {"title": "Segunda Ley de Newton: Fuerza Resultante y Aceleración (F = m · a)", "short": "Segunda Ley Newton", "icon": "💥", "kw": "newton"},
                    {"title": "Fuerza de Rozamiento: Coeficiente de Fricción Estático y Cinético", "short": "Rozamiento y Fricción", "icon": "🛑", "kw": "fricción"},
                    {"title": "Dinámica de Cuerpos Vinculados y Máquinas Simples (Poleas)", "short": "Cuerpos Vinculados", "icon": "⛓️", "kw": "tensión"},
                    {"title": "Dinámica Circular: Fuerza Centrípeta en Curvas y Peraltes Viales", "short": "Dinámica Circular", "icon": "🎡", "kw": "curva"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Trabajo Mecánico, Potencia y Conservación de Energía",
                "topics": [
                    {"title": "Trabajo Mecánico de Fuerzas Constantes y en Gráficas F vs x", "short": "Trabajo Mecánico", "icon": "🔨", "kw": "trabajo"},
                    {"title": "Potencia Mecánica y Rendimiento o Eficiencia de Motores", "short": "Potencia y Eficiencia", "icon": "⚡", "kw": "potencia"},
                    {"title": "Energía Mecánica: Energía Cinética, Potencial Gravitatoria y Elástica", "short": "Energía Mecánica", "icon": "🔋", "kw": "energía"},
                    {"title": "Teorema del Trabajo y la Energía y Principio de Conservación", "short": "Conservación Energía", "icon": "🔄", "kw": "conservación"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Hidrostática y Mecánica de Fluidos",
                "topics": [
                    {"title": "Densidad, Peso Específico y Presión en Sólidos y Líquidos", "short": "Densidad y Presión", "icon": "🧱", "kw": "presión"},
                    {"title": "Presión Hidrostática y Principio Fundamental (ΔP = ρ·g·h)", "short": "Presión Hidrostática", "icon": "🌊", "kw": "hidrostática"},
                    {"title": "Principio de Pascal: Prensa Hidráulica y Vasos Comunicantes", "short": "Principio de Pascal", "icon": "🚜", "kw": "pascal"},
                    {"title": "Principio de Arquímedes: Fuerza de Empuje y Flotación de Cuerpos", "short": "Empuje de Arquímedes", "icon": "🚢", "kw": "arquímedes"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Termometría, Dilatación Térmica y Calorimetría",
                "topics": [
                    {"title": "Termometría: Escalas Celcius, Fahrenheit, Kelvin y Rankine", "short": "Escalas Térmicas", "icon": "🌡️", "kw": "temperatura"},
                    {"title": "Dilatación Térmica en Sólidos: Lineal, Superficial y Volumétrica", "short": "Dilatación Térmica", "icon": "📏", "kw": "dilatación"},
                    {"title": "Calorimetría: Calor Sensible, Calor Específico y Capacidad Térmica", "short": "Calor Sensible", "icon": "🔥", "kw": "calor"},
                    {"title": "Equilibrio Térmico, Calor Latente y Cambios de Fase de la Materia", "short": "Equilibrio y Fases", "icon": "🧊", "kw": "calor latente"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Electrostática - Carga Eléctrica y Ley de Coulomb",
                "topics": [
                    {"title": "Carga Eléctrica, Cuantización y Procesos de Electrización", "short": "Carga Eléctrica", "icon": "⚡", "kw": "electrostática"},
                    {"title": "Ley de Coulomb: Interacción entre Cargas Puntuales en el Vacío", "short": "Ley de Coulomb", "icon": "🧲", "kw": "coulomb"},
                    {"title": "Campo Eléctrico (E): Intensidad, Líneas de Fuerza y Cargas Distribuidas", "short": "Campo Eléctrico", "icon": "🌐", "kw": "campo eléctrico"},
                    {"title": "Potencial Eléctrico (V) y Diferencia de Potencial entre Puntos", "short": "Potencial Eléctrico", "icon": "🔌", "kw": "voltaje"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Electrocinética, Magnetismo, Óptica Geométrica y Física Moderna",
                "topics": [
                    {"title": "Corriente Eléctrica, Intensidad, Ley de Ohm (V = I · R) y Circuitos en Serie y Paralelo", "short": "Corriente y Ley de Ohm", "icon": "⚡", "kw": "corriente"},
                    {"title": "Magnetismo: Campo Magnético (B), Fuerza Magnética de Lorentz e Inducción de Faraday", "short": "Magnetismo y Faraday", "icon": "🧲", "kw": "magnetismo"},
                    {"title": "Óptica Geométrica: Reflexión, Refracción (Ley de Snell) y Ecuación de Descartes para Lentes y Espejos (1/f = 1/do + 1/di)", "short": "Óptica y Lentes (1/f)", "icon": "🔍", "kw": "óptica"},
                    {"title": "Ondas Mecánicas, Acústica y Física Moderna: Efecto Fotoeléctrico (E = h · f) y Dualidad de De Broglie", "short": "Ondas y Física Moderna", "icon": "🌊", "kw": "ondas"}
                ]
            }
        ]
    },

    "Química": {
        "area": "General",
        "icon": "🧪",
        "color": "#06B6D4",
        "gradient": "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
        "desc": "Materia, estructura atómica, tabla periódica, enlace químico, nomenclatura, estequiometría, gases y química orgánica.",
        "asigBanco": "Química",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: La Química como Ciencia y Sistema Internacional (SI)",
                "topics": [
                    {"title": "Definición, Importancia y Ramas Principales de la Química", "short": "Química y Ramas", "icon": "🧪", "kw": "química"},
                    {"title": "Método Científico: Observación, Hipótesis, Experimentación y Ley", "short": "Método Científico", "icon": "🔍", "kw": "método científico"},
                    {"title": "Sistema Internacional de Unidades (SI) y Prefijos Múltiplos", "short": "Unidades del SI", "icon": "📏", "kw": "unidades"},
                    {"title": "Factores de Conversión de Unidades y Notación Científica", "short": "Factores de Conversión", "icon": "🔢", "kw": "conversión"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Materia, Clasificación y Cambios de Fase",
                "topics": [
                    {"title": "Sustancias Puras: Elementos Químicos y Compuestos Químicos", "short": "Sustancias Puras", "icon": "💎", "kw": "sustancia"},
                    {"title": "Mezclas Homogéneas (Soluciones) y Heterogéneas y Métodos de Separación", "short": "Mezclas y Métodos", "icon": "🥣", "kw": "mezcla"},
                    {"title": "Estados de Agregación de la Materia y Cambios de Fase Físicos", "short": "Estados y Cambios", "icon": "🧊", "kw": "cambios de estado"},
                    {"title": "Propiedades de la Materia: Físicas, Químicas, Extensivas e Intensivas", "short": "Propiedades Materia", "icon": "📊", "kw": "propiedades"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Estructura Atómica y Núclidos",
                "topics": [
                    {"title": "Modelos Atómicos: Dalton, Thomson, Rutherford, Bohr y Dualidad Onda-Corpúsculo de De Broglie", "short": "Modelos Atómicos y De Broglie", "icon": "⚛️", "kw": "de broglie"},
                    {"title": "Estructura del Átomo Moderno: Núcleo y Nube Electrónica", "short": "Estructura Atómica", "icon": "🔬", "kw": "átomo"},
                    {"title": "Número Atómico (Z), Número de Masa (A) y Especies Núclidas", "short": "Núclidos Z y A", "icon": "🏷️", "kw": "número atómico"},
                    {"title": "Tipos de Núclidos: Isótopos, Isóbaros, Isótonos y Especies Isoelectrónicas", "short": "Isótopos e Iones", "icon": "⚖️", "kw": "isótopos"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Mecánica Cuántica y Configuración Electrónica",
                "topics": [
                    {"title": "Números Cuánticos: Principal (n), Secundario (l), Magnético (m) y Spin (s)", "short": "Números Cuánticos", "icon": "🌀", "kw": "números cuánticos"},
                    {"title": "Principio de Construcción (Aufbau) y Regla del Serrucho (Regla n+l)", "short": "Regla del Serrucho", "icon": "📈", "kw": "serrucho"},
                    {"title": "Principio de Exclusión de Pauli y Regla de Hund de Máxima Multiplicidad", "short": "Pauli y Hund", "icon": "⬆️", "kw": "hund"},
                    {"title": "Configuración Electrónica de Iones, Paramagnetismo y Diamagnetismo", "short": "Iones y Magnetismo", "icon": "🧲", "kw": "paramagnético"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Tabla Periódica Moderna y Propiedades Periódicas",
                "topics": [
                    {"title": "Ley Periódica de Moseley: Distribución por Z en Periodos y Grupos", "short": "Ley Periódica", "icon": "📑", "kw": "periódica"},
                    {"title": "Bloques Cuánticos s, p, d, f y Familias de Elementos Representativos", "short": "Bloques s, p, d, f", "icon": "🧱", "kw": "bloques"},
                    {"title": "Radio Atómico, Radio Iónico y Carga Nuclear Efectiva", "short": "Radio Atómico", "icon": "⚪", "kw": "radio atómico"},
                    {"title": "Energía de Ionización, Afinidad Electrónica y Electronegatividad", "short": "Electronegatividad", "icon": "⚡", "kw": "electronegatividad"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Enlace Químico y Fuerzas Intermoleculares",
                "topics": [
                    {"title": "Estructura de Lewis y Regla del Octeto Electrónico", "short": "Lewis y Octeto", "icon": "🟡", "kw": "lewis"},
                    {"title": "Enlace Iónico o Electrovalente: Transferencia Electrónica y Redes Cristalinas", "short": "Enlace Iónico", "icon": "🧂", "kw": "iónico"},
                    {"title": "Enlace Covalente: Normal, Dativo o Coordinado, Polar y Apolar", "short": "Enlace Covalente", "icon": "🔗", "kw": "covalente"},
                    {"title": "Fuerzas Intermoleculares: Puente de Hidrógeno, Dipolo-Dipolo y London", "short": "Fuerzas Intermoleculares", "icon": "💧", "kw": "puente de hidrógeno"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Nomenclatura Química Inorgánica",
                "topics": [
                    {"title": "Estados de Oxidación y Sistemas de Nomenclatura: Clásica/Tradicional, Stock y Sistemática IUPAC", "short": "Nomenclatura Tradicional y Stock", "icon": "🔢", "kw": "nomenclatura"},
                    {"title": "Óxidos Básicos y Óxidos Ácidos (Anhídridos): Nomenclatura IUPAC y Clásica", "short": "Óxidos y Anhídridos", "icon": "♨️", "kw": "óxido"},
                    {"title": "Hidróxidos e Hidruros Metálicos y No Metálicos", "short": "Hidróxidos e Hidruros", "icon": "🧴", "kw": "hidróxido"},
                    {"title": "Ácidos Hidrácidos, Oxácidos y Formación de Sales Neutras", "short": "Ácidos y Sales", "icon": "🧪", "kw": "ácido"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Reacciones Químicas y Métodos de Balanceo",
                "topics": [
                    {"title": "Evidencias Experimentales y Clasificación de Reacciones Químicas", "short": "Tipos de Reacciones", "icon": "💥", "kw": "reacciones"},
                    {"title": "Balance de Ecuaciones por el Método de Tanteo o Simple Inspección", "short": "Balance por Tanteo", "icon": "⚖️", "kw": "tanteo"},
                    {"title": "Reacciones de Óxido-Reducción: Agente Oxidante y Agente Reductor", "short": "Reacciones Redox", "icon": "🔄", "kw": "redox"},
                    {"title": "Balanceo por Método Redox y Método del Ion-Electrón", "short": "Balance Ion-Electrón", "icon": "⚡", "kw": "ion electrón"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Estequiometría y Leyes Ponderales",
                "topics": [
                    {"title": "Unidades Químicas de Masa: Mol, Masa Molar y Número de Avogadro", "short": "Mol y Masa Molar", "icon": "📦", "kw": "mol"},
                    {"title": "Composición Centesimal, Fórmula Empírica y Fórmula Molecular", "short": "Fórmula Empírica", "icon": "🔬", "kw": "fórmula"},
                    {"title": "Leyes Estequiométricas: Conservación de la Masa (Lavoisier) y Proust", "short": "Leyes Ponderales", "icon": "⚖️", "kw": "estequiometría"},
                    {"title": "Reactivo Limitante, Reactivo en Exceso y Porcentaje de Rendimiento", "short": "Reactivo Limitante", "icon": "🎯", "kw": "reactivo limitante"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Gases Ideales, Soluciones, pH, Cinética, Equilibrio y Química Orgánica",
                "topics": [
                    {"title": "Estado Gaseoso: Ecuación Universal de Gases Ideales (P·V = n·R·T) y Mezclas Gaseosas", "short": "Gases Ideales (PV=nRT)", "icon": "🎈", "kw": "gaseoso"},
                    {"title": "Soluciones Químicas, Molaridad, Normalidad, Dilución y Potencial de Hidrógeno (pH = -log[H+])", "short": "Soluciones, Molaridad y pH", "icon": "☕", "kw": "ph"},
                    {"title": "Cinética Química, Equilibrio Químico (Kc, Kp), Principio de Le Chatelier y Electroquímica (Faraday)", "short": "Equilibrio y Electroquímica", "icon": "⚡", "kw": "equilibrio"},
                    {"title": "Química Orgánica: Hidrocarburos (Alcanos, Alquenos, Alquinos, Benceno) y Funciones Oxigenadas y Nitrogenadas", "short": "Química Orgánica y Funciones", "icon": "🧪", "kw": "hidrocarburos"}
                ]
            }
        ]
    },

    "Matemática": {
        "area": "General",
        "icon": "📐",
        "color": "#3B82F6",
        "gradient": "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        "desc": "Polinomios, productos notables, factorización, división de polinomios, ecuaciones, desigualdades y funciones.",
        "asigBanco": "Álgebra",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Teoría de Exponentes y Radicación",
                "topics": [
                    {"title": "Leyes de Exponentes: Producto de Bases Iguales y Exponente Negativo", "short": "Leyes de Exponentes", "icon": "🔢", "kw": "exponentes"},
                    {"title": "Potencia de Potencia y Raíz de un Producto y Cociente", "short": "Radicación y Raíces", "icon": "√", "kw": "radicales"},
                    {"title": "Ecuaciones Exponenciales: Igualación de Bases y Formas Simétricas", "short": "Ecuaciones Exponenciales", "icon": "⚡", "kw": "exponencial"},
                    {"title": "Radicales Dobles y Racionalización de Denominadores", "short": "Radicales Dobles", "icon": "📐", "kw": "racionalización"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Polinomios y Grados de Expresiones Algebraicas",
                "topics": [
                    {"title": "Polinomio de una y Varias Variables: Notación y Valor Numérico", "short": "Valor Numérico", "icon": "📊", "kw": "polinomio"},
                    {"title": "Grados de un Monomio y Polinomio: Grado Relativo y Grado Absoluto", "short": "Grado Relativo y Absoluto", "icon": "📈", "kw": "grado"},
                    {"title": "Polinomios Especiales: Homogéneo, Ordenado, Completo e Idéntico", "short": "Polinomios Especiales", "icon": "🧩", "kw": "homogéneo"},
                    {"title": "Suma de Coeficientes P(1) y Término Independiente P(0)", "short": "Coeficientes y T.I.", "icon": "🔣", "kw": "coeficientes"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Productos Notables e Identidades Algebraicas",
                "topics": [
                    {"title": "Binomio al Cuadrado e Identidades de Legendre", "short": "Binomio y Legendre", "icon": "²", "kw": "binomio"},
                    {"title": "Diferencia de Cuadrados y Multiplicación de Binomios con Término Común", "short": "Diferencia Cuadrados", "icon": "✖️", "kw": "diferencia"},
                    {"title": "Binomio al Cubo: Forma Desarrollada y Forma Abreviada de Cauchy", "short": "Binomio al Cubo", "icon": "³", "kw": "cauchy"},
                    {"title": "Suma y Diferencia de Cubos e Identidades Condicionales (a+b+c=0)", "short": "Identidades Condicionales", "icon": "✨", "kw": "condicional"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: División Algebraica de Polinomios y Teorema del Resto",
                "topics": [
                    {"title": "Algoritmo de la División: D(x) = d(x)·q(x) + r(x) y Propiedades", "short": "Algoritmo División", "icon": "➗", "kw": "división"},
                    {"title": "Método de Guillermo Horner para Divisores de Cualquier Grado", "short": "Método de Horner", "icon": "📋", "kw": "horner"},
                    {"title": "Regla de Paolo Ruffini para Divisores de Primer Grado (ax ± b)", "short": "Regla de Ruffini", "icon": "📝", "kw": "ruffini"},
                    {"title": "Teorema del Resto de René Descartes y Divisibilidad Algebraica", "short": "Teorema del Resto", "icon": "🎯", "kw": "resto"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Factorización de Polinomios",
                "topics": [
                    {"title": "Criterio del Factor Común Monomio, Polinomio y por Agrupación", "short": "Factor Común", "icon": "🔲", "kw": "factor común"},
                    {"title": "Criterio de las Identidades: Diferencia de Cuadrados y Cubos", "short": "Criterio Identidades", "icon": "🔗", "kw": "factorización"},
                    {"title": "Método del Aspa Simple para Trinomios de Grado Par", "short": "Aspa Simple", "icon": "❌", "kw": "aspa simple"},
                    {"title": "Método del Aspa Doble Especial y Divisores Binómicos (Ruffini)", "short": "Aspa Doble y Divisores", "icon": "🎲", "kw": "aspa doble"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Divisibilidad, Números Primos, MCD, MCM y Fracciones",
                "topics": [
                    {"title": "MCD y MCM de Polinomios y Números Enteros: Algoritmo de Euclides y Propiedades", "short": "MCD, MCM y Euclides", "icon": "⚖️", "kw": "mcd"},
                    {"title": "Teoría de la Divisibilidad: Criterios por 2, 3, 5, 7, 9, 11 y Teorema de Arquímedes", "short": "Divisibilidad y Arquímedes", "icon": "➗", "kw": "divisibilidad"},
                    {"title": "Números Primos, Compuestos, Criba de Eratóstenes y Cantidad de Divisores CD(N)", "short": "Números Primos y Divisores", "icon": "🔢", "kw": "primos"},
                    {"title": "Fracciones Algebraicas y Aritméticas: Simplificación y Fracciones Parciales Simples", "short": "Fracciones Algebraicas", "icon": "½", "kw": "fracciones"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Ecuaciones, Cardano-Viète, Regla de Tres e Interés Simple",
                "topics": [
                    {"title": "Ecuación Cuadrática: Factorización, Fórmula General de Bhaskara y Cardano-Viète", "short": "Ecuación Cuadrática", "icon": "🎯", "kw": "cuadrática"},
                    {"title": "Naturaleza de las Raíces: Análisis del Discriminante (Δ = b² - 4ac) y Reconstrucción", "short": "Discriminante (Delta)", "icon": "🔍", "kw": "discriminante"},
                    {"title": "Razones, Proporciones y Regla de Tres Simple y Compuesta", "short": "Regla de Tres", "icon": "📈", "kw": "proporcionalidad"},
                    {"title": "Porcentajes, Aplicaciones Comerciales (Pv = Pc + G) e Interés Simple (I = C·r·t/100)", "short": "Porcentajes e Interés", "icon": "💰", "kw": "porcentajes"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Geometría Plana - Triángulos, Pitágoras, Thales, Áreas y Sólidos",
                "topics": [
                    {"title": "Triángulos: Propiedades Fundamentales, Líneas Notables, Congruencia y Teorema de Thales", "short": "Triángulos y Thales", "icon": "📐", "kw": "triángulos"},
                    {"title": "Relaciones Métricas en el Triángulo Rectángulo y Teorema de Pitágoras (a² + b² = c²)", "short": "Teorema de Pitágoras", "icon": "📐", "kw": "pitágoras"},
                    {"title": "Circunferencia: Ángulos Asociados, Teoremas de Poncelet y Pitot y Áreas de Regiones Planas", "short": "Circunferencia y Áreas", "icon": "⭕", "kw": "circunferencia"},
                    {"title": "Geometría del Espacio: Prisma, Pirámide y Sólidos de Revolución (Cilindro, Cono y Esfera)", "short": "Sólidos del Espacio", "icon": "🧊", "kw": "espacio"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Trigonometría - Razones Notables, Identidades y Ley de Senos",
                "topics": [
                    {"title": "Sistemas de Medición Angular (S, C, R), Fórmula de Conversión (S/9 = C/10) y Longitud de Arco", "short": "Sistemas de Ángulos", "icon": "🔄", "kw": "ángulos"},
                    {"title": "Razones Trigonométricas de Ángulos Notables (30°, 45°, 60°, 37°, 53°) y Posición Normal", "short": "Razones Notables", "icon": "📐", "kw": "notables"},
                    {"title": "Identidades Trigonométricas Fundamentales (sen²θ + cos²θ = 1) y de Arcos Compuestos", "short": "Identidades Pitagóricas", "icon": "✨", "kw": "trigonometría"},
                    {"title": "Resolución de Triángulos Oblicuángulos: Ley de Senos y Ley de Cosenos (a² = b² + c² - 2bc·cosA)", "short": "Ley de Senos y Cosenos", "icon": "⛰️", "kw": "ley de senos"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Inecuaciones, Funciones Reales, Parábola y Logaritmos",
                "topics": [
                    {"title": "Desigualdades e Inecuaciones Lineales, Cuadráticas y con Valor Absoluto (|x|)", "short": "Inecuaciones y Valor Abs.", "icon": "≠", "kw": "inecuación"},
                    {"title": "Funciones Reales: Dominio, Rango y Función Cuadrática (Vértice de la Parábola)", "short": "Funciones y Parábola", "icon": "🌐", "kw": "función"},
                    {"title": "Logaritmos: Definición, Propiedades de Productos y Cocientes y Cambio de Base", "short": "Propiedades de Logaritmos", "icon": "🪵", "kw": "logaritmo"},
                    {"title": "Ecuaciones Exponenciales y Logarítmicas con Restricciones del Dominio (C.V.A.)", "short": "Ecuaciones Logarítmicas", "icon": "⚡", "kw": "ecuaciones logarítmicas"}
                ]
            }
        ]
    },

    "Filosofía": {
        "area": "General",
        "icon": "💭",
        "color": "#8B5CF6",
        "gradient": "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        "desc": "Disciplinas filosóficas, historia antigua a contemporánea, gnoseología, epistemología, ética y política.",
        "asigBanco": "Filosofía",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Nociones Preliminares de la Filosofía",
                "topics": [
                    {"title": "Etimología: Pitágoras y el Filósofo como Amante de la Sabiduría", "short": "Etimología y Pitágoras", "icon": "🏛️", "kw": "pitágoras"},
                    {"title": "Origen Histórico de la Filosofía: Del Mito al Logos en Jonia", "short": "Del Mito al Logos", "icon": "✨", "kw": "mito"},
                    {"title": "Rasgos del Saber Filosófico: Totalizador, Radical, Crítico y Problemático", "short": "Rasgos del Saber", "icon": "🔍", "kw": "radical"},
                    {"title": "Concepciones Históricas de la Filosofía: Aristóteles, Marx y Wittgenstein", "short": "Concepciones Filosóficas", "icon": "📜", "kw": "concepción"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Periodo Cosmológico o Presocrático",
                "topics": [
                    {"title": "El Problema del Arjé o Principio Primero de la Physis (Naturaleza)", "short": "El Arjé y la Physis", "icon": "🌊", "kw": "arjé"},
                    {"title": "Monistas de Mileto: Tales (Agua), Anaximandro (Ápeiron) y Anaxímenes (Aire)", "short": "Escuela de Mileto", "icon": "💨", "kw": "tales"},
                    {"title": "Heráclito (El Devenir y el Fuego) vs Parménides (El Ser Inmutable)", "short": "Heráclito vs Parménides", "icon": "🔥", "kw": "devenir"},
                    {"title": "Filósofos Pluralistas: Empédocles (4 Raíces), Anaxágoras y Demócrito (Átomos)", "short": "Pluralistas y Átomos", "icon": "⚛️", "kw": "demócrito"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Periodo Antropológico - Sofistas y Sócrates",
                "topics": [
                    {"title": "Giro Antropológico: El Hombre y la Polis en la Atenas Democrática", "short": "Giro Antropológico", "icon": "🏛️", "kw": "antropológico"},
                    {"title": "Los Sofistas: Protágoras ('Homo Mensura' y Relativismo) y Gorgias", "short": "Sofistas y Relativismo", "icon": "🗣️", "kw": "protágoras"},
                    {"title": "Sócrates de Atenas: Ironía y Mayéutica (El Parto de las Ideas)", "short": "Sócrates y Mayéutica", "icon": "💡", "kw": "sócrates"},
                    {"title": "Intelectualismo Moral Socrático: Saber es Obrar Bien y 'Conócete a ti Mismo'", "short": "Intelectualismo Moral", "icon": "⚖️", "kw": "moral"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Periodo Ontológico o Clásico - Platón y Aristóteles",
                "topics": [
                    {"title": "Platón y la Teoría de las Ideas: Mundo Sensible vs Mundo Inteligible", "short": "Mundo de las Ideas", "icon": "☀️", "kw": "platón"},
                    {"title": "Alegoría de la Caverna, la Reminiscencia (Anamnesis) y el Alma Tripartita", "short": "Mito de la Caverna", "icon": "🕯️", "kw": "caverna"},
                    {"title": "Aristóteles y la Crítica a Platón: Teoría Hilemórfica (Materia y Forma)", "short": "Hilemorfismo Aristotélico", "icon": "🧱", "kw": "aristóteles"},
                    {"title": "Las 4 Causas (Material, Formal, Eficiente y Final) y Acto vs Potencia", "short": "Las Cuatro Causas", "icon": "⚙️", "kw": "potencia"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Filosofía Helenístico-Romana y Medieval",
                "topics": [
                    {"title": "Filosofía Helenística: Búsqueda de la Felicidad y la Ataraxia (Imperturbabilidad)", "short": "Ataraxia y Felicidad", "icon": "🧘", "kw": "ataraxia"},
                    {"title": "Escuelas Helenísticas: Epicureísmo (Hedonismo Racional) y Estoicismo (Cénon)", "short": "Epicúreos y Estoicos", "icon": "🛡️", "kw": "estoicismo"},
                    {"title": "La Filosofía Medieval y el Problema Fe vs Razón", "short": "Fe y Razón", "icon": "⛪", "kw": "medieval"},
                    {"title": "San Agustín de Hipona (Patrística) y Santo Tomás de Aquino (Las 5 Vías)", "short": "Agustín y Tomás", "icon": "📖", "kw": "tomás"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Filosofía Moderna - Racionalismo, Empirismo y Criticismo",
                "topics": [
                    {"title": "René Descartes y el Racionalismo: Duda Metódica y el 'Cogito Ergo Sum'", "short": "Descartes y la Duda", "icon": "🤔", "kw": "descartes"},
                    {"title": "John Locke y el Empirismo: La Mente como Tabla Rasa y Crítica a Ideas Innatas", "short": "Locke y Tabla Rasa", "icon": "📜", "kw": "locke"},
                    {"title": "David Hume: Impresiones, Ideas y el Escepticismo del Principio de Causalidad", "short": "Hume y Causalidad", "icon": "🔍", "kw": "hume"},
                    {"title": "Immanuel Kant y el Criticismo: Juicios Sintéticos a Priori y Giro Copernicano", "short": "Kant y Criticismo", "icon": "⚙️", "kw": "kant"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Filosofía Contemporánea",
                "topics": [
                    {"title": "Georg Wilhelm Friedrich Hegel y el Idealismo Dialéctico (Tesis, Antítesis, Síntesis)", "short": "Hegel y Dialéctica", "icon": "🌀", "kw": "hegel"},
                    {"title": "Karl Marx: Materialismo Histórico, Alienación del Trabajo y Lucha de Clases", "short": "Marx y Materialismo", "icon": "⚒️", "kw": "marx"},
                    {"title": "Friedrich Nietzsche: Crítica a la Moral Occidental, Muerte de Dios y Superhombre", "short": "Nietzsche y Superhombre", "icon": "🦅", "kw": "nietzsche"},
                    {"title": "El Existencialismo: Jean-Paul Sartre ('La Existencia Precede a la Esencia')", "short": "Sartre y Existencia", "icon": "🎭", "kw": "existencialismo"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Gnoseología, Epistemología y Filosofía de la Ciencia",
                "topics": [
                    {"title": "Gnoseología: Posibilidad del Conocimiento (Dogmatismo, Escepticismo, Criticismo)", "short": "Gnoseología y Verdad", "icon": "🧩", "kw": "gnoseología"},
                    {"title": "El Origen y Naturaleza del Conocimiento: Racionalismo, Empirismo y Apriorismo", "short": "Origen del Conocimiento", "icon": "🌱", "kw": "apriorismo"},
                    {"title": "Epistemología y Filosofía de la Ciencia: El Método Científico y Problema de la Demarcación", "short": "Filosofía de la Ciencia", "icon": "🔬", "kw": "ciencia"},
                    {"title": "Teorías Científicas Contemporáneas: Popper (Falsacionismo), Kuhn (Paradigmas) y Feyerabend", "short": "Popper, Kuhn y Paradigmas", "icon": "💡", "kw": "popper"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Axiología, Ética y Filosofía Política",
                "topics": [
                    {"title": "Axiología: Naturaleza del Valor, Polaridad, Jerarquía y Posturas (Subjetivismo vs Objetivismo)", "short": "Teoría de los Valores", "icon": "💎", "kw": "valor"},
                    {"title": "Ética: Moral, Acto Moral y Doctrinas Éticas (Eudemonismo, Deontología Kantiana, Utilitarismo)", "short": "Ética y Deontología", "icon": "🕊️", "kw": "moral"},
                    {"title": "Filosofía Política: Origen del Estado, Poder Político, Soberanía y el Contrato Social (Hobbes, Locke, Rousseau)", "short": "Filosofía Política y Estado", "icon": "⚖️", "kw": "política"},
                    {"title": "Justicia y Democracia: Karl Marx (Crítica del Estado) y John Rawls (Teoría de la Justicia)", "short": "Justicia y Democracia", "icon": "🏛️", "kw": "justicia"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Filosofía en el Perú y Latinoamérica",
                "topics": [
                    {"title": "Cosmovisión Andina Prehispánica: Reciprocidad (Ayni) y Complementariedad", "short": "Cosmovisión Andina", "icon": "🌄", "kw": "andina"},
                    {"title": "El Debate de Valladolid: Bartolomé de las Casas vs Ginés de Sepúlveda", "short": "Debate de Valladolid", "icon": "📜", "kw": "las casas"},
                    {"title": "La Ilustración Peruana y el Pensamiento Emancipador (Sociedad Amantes del País)", "short": "Ilustración Peruana", "icon": "💡", "kw": "emancipación"},
                    {"title": "Positivismo en el Perú (Manuel González Prada) y el Debate Mariátegui-Haya", "short": "González Prada y Mariátegui", "icon": "🇵🇪", "kw": "mariátegui"}
                ]
            }
        ]
    },

    "Historia": {
        "area": "General",
        "icon": "🏛️",
        "color": "#F59E0B",
        "gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "desc": "Historia como ciencia, prehistoria, edades antigua a contemporánea, Perú prehispánico y virreinato.",
        "asigBanco": "Historia",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: La Historia como Ciencia y Disciplinas Auxiliares",
                "topics": [
                    {"title": "La Historia: Objeto de Estudio, Fuentes y Categorías Temporales (Diacronía y Sincronía)", "short": "Historia y Categorías", "icon": "📜", "kw": "diacronía"},
                    {"title": "Ciencias Cooperativas y Disciplinas Auxiliares: Numismática, Paleografía y Arqueología", "short": "Disciplinas Auxiliares", "icon": "🔍", "kw": "auxiliares"},
                    {"title": "Periodización Tradicional (Keller) vs Periodización Materialista (Marx)", "short": "Periodización Histórica", "icon": "⏳", "kw": "periodización"},
                    {"title": "Proceso de Hominización: Del Australopithecus al Homo Sapiens", "short": "Hominización", "icon": "🦴", "kw": "hominización"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: La Prehistoria Universal - Edad de Piedra y de los Metales",
                "topics": [
                    {"title": "Paleolítico Inferior, Medio y Superior: Nomadismo y Arte Rupestre", "short": "Edad de Piedra (Paleolítico)", "icon": "🪨", "kw": "paleolítico"},
                    {"title": "Revolución Neolítica: Agricultura, Ganadería, Sedentarismo y Cerámica", "short": "Revolución Neolítica", "icon": "🌾", "kw": "neolítico"},
                    {"title": "Edad de los Metales: Cobre, Bronce (Invención de la Escritura) y Hierro", "short": "Edad de los Metales", "icon": "⚔️", "kw": "metales"},
                    {"title": "Poblamiento Americano: Teoría Asiática (Hrdlicka), Oceánica (Rivet) y Australiana", "short": "Poblamiento Americano", "icon": "🌏", "kw": "poblamiento"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Primeras Civilizaciones del Cercano y Lejano Oriente",
                "topics": [
                    {"title": "Mesopotamia: Sumerios, Acadios, Código de Hammurabi y los Asirios", "short": "Mesopotamia y Hammurabi", "icon": "🏺", "kw": "mesopotamia"},
                    {"title": "Egipto Antiguo: Faraones, Periodos Históricos, Religión y Momificación", "short": "Egipto Faraónico", "icon": "🔺", "kw": "egipto"},
                    {"title": "Fenicia (El Alfabeto Fonético y el Comercio) y los Hebreos (Monoteísmo)", "short": "Fenicios y Hebreos", "icon": "⛵", "kw": "hebreos"},
                    {"title": "Imperio Persa y Civilizaciones de la India y China Antiguas", "short": "Persia, India y China", "icon": "🏯", "kw": "persia"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: La Antigüedad Clásica - Grecia y Roma",
                "topics": [
                    {"title": "Grecia: Creta, Micenas y el Surgimiento de las Polis (Atenas y Esparta)", "short": "Polis Griegas", "icon": "🏛️", "kw": "esparta"},
                    {"title": "Las Guerras Médicas y el Siglo de Oro de Pericles en Atenas", "short": "Guerras Médicas y Pericles", "icon": "🛡️", "kw": "pericles"},
                    {"title": "Roma: Monarquía, República, Conflictos Patricio-Plebeyos y Guerras Púnicas", "short": "República Romana", "icon": "🦅", "kw": "roma"},
                    {"title": "El Imperio Romano: Augusto, Pax Romana, Cristianismo y Crisis del Imperio", "short": "Imperio Romano y Caída", "icon": "👑", "kw": "imperio romano"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: La Edad Media Universal",
                "topics": [
                    {"title": "Invasiones Bárbaras y Reinos Germánicos: Visigodos, Francos y Carlomagno", "short": "Reinos Germánicos", "icon": "🏰", "kw": "carlomagno"},
                    {"title": "El Imperio Bizantino (Justiniano) y la Expansión del Islam (Mahoma)", "short": "Bizancio y el Islam", "icon": "🕌", "kw": "islam"},
                    {"title": "El Sistema Feudal: Vasallaje, Feudo, Sociedad Estamental y la Iglesia Medieval", "short": "Feudalismo Medieval", "icon": "🛡️", "kw": "feudalismo"},
                    {"title": "Las Cruzadas y el Renacimiento Urbano-Comercial de la Baja Edad Media", "short": "Las Cruzadas y Ciudades", "icon": "⚔️", "kw": "cruzadas"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: La Edad Moderna Universal",
                "topics": [
                    {"title": "El Humanismo y el Renacimiento Artístico: Italia y Europa", "short": "Humanismo y Renacimiento", "icon": "🎨", "kw": "renacimiento"},
                    {"title": "La Reforma Protestante (Martín Lutero, Calvino) y la Contrarreforma Católica", "short": "Reforma y Contrarreforma", "icon": "⛪", "kw": "lutero"},
                    {"title": "Expansión Europea y Grandes Descubrimientos Geográficos (Colón y Magallanes)", "short": "Grandes Descubrimientos", "icon": "🧭", "kw": "descubrimiento"},
                    {"title": "El Absolutismo Monárquico Europeo y la Ilustración del Siglo XVIII", "short": "Absolutismo e Ilustración", "icon": "👑", "kw": "ilustración"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Perú Prehispánico - Periodo Lítico, Arcaico y Formativo",
                "topics": [
                    {"title": "Periodo Lítico Peruano: Pacaicasa, Paiján, Lauricocha y Toquepala", "short": "Periodo Lítico Peruano", "icon": "🏹", "kw": "paiján"},
                    {"title": "Periodo Arcaico Inferior y Superior: Nanchoc, Guitarrero, Caral y Kotosh", "short": "Arcaico y Caral", "icon": "🏺", "kw": "caral"},
                    {"title": "Periodo Formativo: Chavín de Huántar (Horizonte Temprano) y Paracas", "short": "Chavín y Paracas", "icon": "🗿", "kw": "chavín"},
                    {"title": "Culturas del Intermedio Temprano: Moche, Nazca y Lima", "short": "Moche y Nazca", "icon": "🏺", "kw": "moche"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Horizonte Medio e Intermedio Tardío",
                "topics": [
                    {"title": "Horizonte Medio: El Imperio Wari y la Cultura Tiahuanaco", "short": "Wari y Tiahuanaco", "icon": "🏛️", "kw": "wari"},
                    {"title": "Intermedio Tardío: Reino Chimú, Señorío Chincha, Chachapoyas y Chancas", "short": "Chimú y Chincha", "icon": "👑", "kw": "chimú"},
                    {"title": "El Tahuantinsuyo: Origen Mítico e Histórico (Pachacútec) y Expansión", "short": "Origen del Tahuantinsuyo", "icon": "🌄", "kw": "pachacútec"},
                    {"title": "Organización Social Inca (Ayllu, Realeza, Nobleza) y Económica (Ayni, Minka, Mita)", "short": "Sociedad y Economía Inca", "icon": "🌽", "kw": "ayllu"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Invasión Española y Resistencia Andina",
                "topics": [
                    {"title": "Viajes de Francisco Pizarro, Capitulación de Toledo y Captura de Atahualpa", "short": "Viajes de Pizarro", "icon": "⚔️", "kw": "pizarro"},
                    {"title": "Resistencia Andina: Manco Inca y los Incas de Vilcabamba (Túpac Amaru I)", "short": "Incas de Vilcabamba", "icon": "🏹", "kw": "vilcabamba"},
                    {"title": "Guerras Civiles entre Conquistadores: Almagristas vs Pizarristas", "short": "Guerras Civiles", "icon": "🗡️", "kw": "conquistadores"},
                    {"title": "Establecimiento del Virreinato del Perú: Leyes Nuevas de 1542 y Virrey Toledo", "short": "Creación del Virreinato", "icon": "📜", "kw": "toledo"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: El Virreinato del Perú y Rebeliones Anticoloniales",
                "topics": [
                    {"title": "Organización Política Virreinal: El Rey, Consejo de Indias, Virrey y Cabildos", "short": "Instituciones Coloniales", "icon": "👑", "kw": "virrey"},
                    {"title": "Economía Colonial: La Mita Minera (Potosí), el Monopolio Comercial y Tributos", "short": "Economía y Minería", "icon": "🪙", "kw": "mita"},
                    {"title": "Sociedad Estamental: República de Españoles y República de Indios", "short": "Sociedad Virreinal", "icon": "👥", "kw": "castas"},
                    {"title": "Reformas Borbónicas y la Rebelión de Túpac Amaru II de 1780", "short": "Túpac Amaru II", "icon": "🔥", "kw": "túpac amaru"}
                ]
            }
        ]
    },

    "Cívica": {
        "area": "General",
        "icon": "⚖️",
        "color": "#64748B",
        "gradient": "linear-gradient(135deg, #64748B 0%, #475569 100%)",
        "desc": "Ciudadanía, Constitución Política de 1993, poderes del Estado, garantías constitucionales, DD.HH. y cultura de paz.",
        "asigBanco": "Ed. Cívica",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Identidad Cultural y Nacional",
                "topics": [
                    {"title": "Concepto de Cultura, Identidad Cultural y Pluriculturalidad Peruana", "short": "Identidad Cultural", "icon": "👥", "kw": "cultural"},
                    {"title": "Identidad Nacional: Símbolos Patrios, Patrimonio Cultural y Material", "short": "Identidad Nacional", "icon": "🇵🇪", "kw": "patrimonio"},
                    {"title": "Diversidad Étnica y Lingüística en el Perú: Lenguas Originarias", "short": "Diversidad Lingüística", "icon": "🗣️", "kw": "lingüística"},
                    {"title": "Cultura de Paz, Convivencia Democrática y Resolución de Conflictos", "short": "Cultura de Paz", "icon": "🕊️", "kw": "paz"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: La Persona Humana y Derechos Fundamentales",
                "topics": [
                    {"title": "La Persona Humana y la Dignidad como Fin Supremo (Art. 1 Constitución)", "short": "Dignidad Humana", "icon": "👤", "kw": "dignidad"},
                    {"title": "Derechos Individuales: Derecho a la Vida, Libertad e Igualdad", "short": "Derechos Individuales", "icon": "🛡️", "kw": "vida"},
                    {"title": "Derechos Económicos, Sociales y Culturales en la Legislación", "short": "Derechos Sociales", "icon": "💼", "kw": "derecho"},
                    {"title": "Deberes de la Persona y Responsabilidad Ciudadana", "short": "Deberes Ciudadanos", "icon": "📋", "kw": "deberes"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Derechos Humanos y Tratados Internacionales",
                "topics": [
                    {"title": "Derechos Humanos: Concepto, Características y Fundamento Ético", "short": "Concepto de DD.HH.", "icon": "🌐", "kw": "humanos"},
                    {"title": "Las Tres Generaciones de Derechos Humanos: Civiles, Sociales y Solidaridad", "short": "Tres Generaciones DDHH", "icon": "📊", "kw": "generaciones"},
                    {"title": "Declaración Universal de Derechos Humanos (DUDH) de 1948", "short": "DUDH de 1948", "icon": "📜", "kw": "declaración"},
                    {"title": "Organismos Internacionales: Corte Interamericana (CIDH) y la ONU", "short": "Corte IDH y ONU", "icon": "⚖️", "kw": "corte interamericana"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Garantías Constitucionales en el Perú",
                "topics": [
                    {"title": "Hábeas Corpus: Protección de la Libertad Individual y la Integridad", "short": "Hábeas Corpus", "icon": "🔓", "kw": "hábeas corpus"},
                    {"title": "Acción de Amparo: Tutela de los Demás Derechos Constitucionales", "short": "Acción de Amparo", "icon": "🛡️", "kw": "amparo"},
                    {"title": "Hábeas Data: Acceso a la Información Pública y la Intimidad Personal", "short": "Hábeas Data", "icon": "📂", "kw": "hábeas data"},
                    {"title": "Acción Popular, Acción de Inconstitucionalidad y Acción de Cumplimiento", "short": "Otras Garantías", "icon": "📜", "kw": "inconstitucionalidad"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: La Familia, el Matrimonio y el Parentesco",
                "topics": [
                    {"title": "La Familia: Definición, Funciones y Tipos de Familia en el Perú", "short": "La Familia y Tipos", "icon": "👨‍👩‍👧", "kw": "familia"},
                    {"title": "El Matrimonio Civil: Requisitos, Impedimentos y Sociedad de Gananciales", "short": "Matrimonio Civil", "icon": "💍", "kw": "matrimonio"},
                    {"title": "El Parentesco: Consanguinidad, Afinidad y Grados Parentales", "short": "Parentesco y Grados", "icon": "🌳", "kw": "parentesco"},
                    {"title": "Patria Potestad, Tutela, Curatela y Protección del Menor", "short": "Patria Potestad", "icon": "👶", "kw": "patria potestad"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: La Constitución Política del Perú",
                "topics": [
                    {"title": "Historia Constitucional del Perú: Constituciones más Relevantes", "short": "Historia Constitucional", "icon": "📖", "kw": "constitucional"},
                    {"title": "Estructura de la Constitución de 1993: Preámbulo, Títulos y Artículos", "short": "Constitución de 1993", "icon": "📘", "kw": "constitución"},
                    {"title": "Reforma Constitucional: Procedimiento y Límites Materiales (Art. 206)", "short": "Reforma Constitucional", "icon": "✍️", "kw": "reforma"},
                    {"title": "Jerarquía Normativa en el Perú: La Pirámide de Kelsen", "short": "Pirámide de Kelsen", "icon": "🔺", "kw": "kelsen"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: El Estado Peruano y sus Deberes",
                "topics": [
                    {"title": "El Estado: Definición, Elementos (Territorio, Pueblo, Poder y Soberanía)", "short": "Elementos del Estado", "icon": "🏛️", "kw": "estado"},
                    {"title": "Características del Estado Peruano: Democrático, Social, Independiente y Soberano", "short": "Características del Estado", "icon": "🇵🇪", "kw": "soberano"},
                    {"title": "Deberes Primordiales del Estado (Defender la Soberanía y Derechos)", "short": "Deberes del Estado", "icon": "🛡️", "kw": "deberes del estado"},
                    {"title": "Estructura del Estado Peruano y Descentralización Regional y Local", "short": "Descentralización", "icon": "🗺️", "kw": "descentralización"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Poderes del Estado - Legislativo y Ejecutivo",
                "topics": [
                    {"title": "Poder Legislativo: El Congreso de la República, Comisiones y Atribuciones", "short": "El Congreso (Legislativo)", "icon": "🏛️", "kw": "congreso"},
                    {"title": "La Función Legislativa: Procedimiento de Formación y Promulgación de Leyes", "short": "Creación de Leyes", "icon": "📜", "kw": "leyes"},
                    {"title": "Poder Ejecutivo: El Presidente de la República, Requisitos y Vacancia", "short": "Poder Ejecutivo", "icon": "🏢", "kw": "presidente"},
                    {"title": "El Consejo de Ministros, Ministros de Estado y Voto de Confianza", "short": "Consejo de Ministros", "icon": "👥", "kw": "ministros"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Poder Judicial y Organismos del Sistema de Justicia",
                "topics": [
                    {"title": "Poder Judicial: Principios de la Función Jurisdiccional y Órganos", "short": "Poder Judicial", "icon": "⚖️", "kw": "judicial"},
                    {"title": "Corte Suprema de Justicia, Cortes Superiores y Juzgados Especializados", "short": "Jerarquía Judicial", "icon": "🏛️", "kw": "corte suprema"},
                    {"title": "Junta Nacional de Justicia (JNJ): Nombramiento y Ratificación de Jueces", "short": "Junta Nacional Justicia", "icon": "📋", "kw": "jnj"},
                    {"title": "Ministerio Público y Fiscalía de la Nación: Defensor de la Legalidad", "short": "Ministerio Público", "icon": "🔍", "kw": "fiscalía"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Organismos Constitucionales Autónomos y Sistema Electoral",
                "topics": [
                    {"title": "Tribunal Constitucional (TC): Intérprete Supremo de la Constitución", "short": "Tribunal Constitucional", "icon": "🏛️", "kw": "tribunal constitucional"},
                    {"title": "Defensoría del Pueblo y Contraloría General de la República", "short": "Defensoría y Contraloría", "icon": "🛡️", "kw": "defensoría"},
                    {"title": "Organismos Económicos: Banco Central de Reserva (BCR) y SBS", "short": "BCR y SBS", "icon": "🏦", "kw": "bcr"},
                    {"title": "Sistema Electoral Peruano: JNE, ONPE y RENIEC en Comicios Ciudadanos", "short": "JNE, ONPE y RENIEC", "icon": "🗳️", "kw": "electoral"}
                ]
            }
        ]
    },

    "Geografía": {
        "area": "General",
        "icon": "🌍",
        "color": "#0D9488",
        "gradient": "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
        "desc": "Espacio geográfico, geosistema, hidrósfera, atmósfera, 8 regiones naturales, población y gestión de riesgos.",
        "asigBanco": "Geografía",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: El Espacio Geográfico y el Geosistema",
                "topics": [
                    {"title": "La Geografía como Ciencia: Objeto de Estudio y Evolución", "short": "Geografía Ciencia", "icon": "🌍", "kw": "geografía"},
                    {"title": "Principios Geográficos: Localización (Ratzel), Causalidad (Humboldt) y Conexión", "short": "Principios Geográficos", "icon": "📐", "kw": "principios"},
                    {"title": "El Geosistema y sus Componentes: Litósfera, Hidrósfera, Atmósfera y Biósfera", "short": "El Geosistema", "icon": "🌐", "kw": "geosistema"},
                    {"title": "Cartografía: Líneas Imaginarias, Coordenadas Geográficas, Mapas y Escalas", "short": "Cartografía y Escalas", "icon": "🗺️", "kw": "cartografía"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: La Tierra en el Espacio y Movimientos Terrestres",
                "topics": [
                    {"title": "El Sistema Planetario Solar: El Sol y los Planetas Interiores y Exteriores", "short": "Sistema Planetario", "icon": "🪐", "kw": "solar"},
                    {"title": "La Tierra: Forma, Dimensiones y Factores que Determinan su Geoide", "short": "Forma de la Tierra", "icon": "🌎", "kw": "tierra"},
                    {"title": "Movimiento de Rotación Terrestre: Efecto Coriolis, Sucesión de Días y Noches", "short": "Movimiento de Rotación", "icon": "🔄", "kw": "rotación"},
                    {"title": "Movimiento de Traslación Terrestre: Estaciones del Año, Solsticios y Equinoccios", "short": "Traslación y Estaciones", "icon": "☀️", "kw": "traslación"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: La Atmósfera Terrestre y el Clima",
                "topics": [
                    {"title": "La Atmósfera: Composición Gaseosa y Capas (Tropósfera a Exósfera)", "short": "Capas de la Atmósfera", "icon": "☁️", "kw": "atmósfera"},
                    {"title": "Tiempo Atmosférico vs Clima: Diferencias y Elementos del Clima", "short": "Tiempo y Clima", "icon": "🌦️", "kw": "clima"},
                    {"title": "Factores del Clima: Latitud, Altitud, Cordillera de los Andes y Masas de Agua", "short": "Factores Climáticos", "icon": "⛰️", "kw": "factores"},
                    {"title": "Calentamiento Global, Efecto Invernadero y Destrucción de la Capa de Ozono", "short": "Efecto Invernadero", "icon": "🔥", "kw": "invernadero"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: La Hidrósfera - Océanos, Mar Peruano y Ríos",
                "topics": [
                    {"title": "La Hidrósfera: Distribución del Agua Dulce y Salada en la Tierra", "short": "La Hidrósfera", "icon": "💧", "kw": "hidrósfera"},
                    {"title": "El Mar Peruano o de Grau: Características, Zócalo Continental y Temperatura", "short": "Mar Peruano", "icon": "🌊", "kw": "mar peruano"},
                    {"title": "Corrientes Marinas: Corriente Peruana (Humboldt) y Corriente del Niño", "short": "Corrientes Marinas", "icon": "🐟", "kw": "humboldt"},
                    {"title": "Las Cuencas Hidrográficas del Perú: Vertiente del Pacífico, Amazonas y Titicaca", "short": "Cuencas Hidrográficas", "icon": "🏞️", "kw": "cuenca"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: La Geósfera y Fuerzas Geológicas",
                "topics": [
                    {"title": "Estructura Interna de la Geósfera: Corteza (Sial/Sima), Manto y Núcleo", "short": "Estructura Geósfera", "icon": "🌋", "kw": "geósfera"},
                    {"title": "Tectónica de Placas y Deriva Continental: Placa de Nazca y Sudamericana", "short": "Tectónica de Placas", "icon": "🧱", "kw": "placas"},
                    {"title": "Fuerzas Endógenas o Tectonismo: Orogénesis, Epirogénesis y Vulcanismo", "short": "Fuerzas Endógenas", "icon": "🌋", "kw": "vulcanismo"},
                    {"title": "Fuerzas Exógenas: Meteorización y Erosión (Fluvial, Eólica, Marina y Glaciar)", "short": "Erosión y Meteorización", "icon": "💨", "kw": "erosión"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Geomorfología del Territorio Peruano",
                "topics": [
                    {"title": "Relieve de la Costa Peruana: Valles, Pampas, Tablazos y Desiertos", "short": "Relieve Costero", "icon": "🏖️", "kw": "costa"},
                    {"title": "Relieve Andino: Cordilleras, Mesetas, Cañones, Volcanes y Pasos o Abras", "short": "Relieve Andino", "icon": "🏔️", "kw": "andino"},
                    {"title": "Relieve Amazónico: Selva Alta (Pongos, Valles) y Selva Baja (Tahuampas, Restingas)", "short": "Relieve Amazónico", "icon": "🌴", "kw": "amazónico"},
                    {"title": "Geomorfología y Paisaje de la Región Arequipa", "short": "Relieve de Arequipa", "icon": "🌋", "kw": "arequipa"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Las Ocho Regiones Naturales y Ecorregiones del Perú",
                "topics": [
                    {"title": "Tesis de Javier Pulgar Vidal: Criterios Altitudinales y Tradicionales", "short": "Pulgar Vidal", "icon": "📜", "kw": "pulgar vidal"},
                    {"title": "Regiones Chala, Yunga, Quechua y Suni: Relieve, Clima y Flora", "short": "Chala a Suni", "icon": "🌾", "kw": "chala"},
                    {"title": "Regiones Puna, Janca (Cordillera), Rupa Rupa y Omagua", "short": "Puna a Omagua", "icon": "❄️", "kw": "puna"},
                    {"title": "Las 11 Ecorregiones de Antonio Brack Egg y Biodiversidad Peruana", "short": "11 Ecorregiones", "icon": "🦙", "kw": "brack egg"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Demografía y Población Peruana",
                "topics": [
                    {"title": "Conceptos Demográficos: Población Absoluta, Relativa (Densidad) y Censos", "short": "Conceptos Demográficos", "icon": "📊", "kw": "demografía"},
                    {"title": "Evolución y Crecimiento de la Población Peruana: Natalidad y Mortalidad", "short": "Crecimiento Poblacional", "icon": "📈", "kw": "natalidad"},
                    {"title": "Distribución Espacial: Población Urbana vs Rural y Pirámide Poblacional", "short": "Distribución Espacial", "icon": "🏙️", "kw": "población"},
                    {"title": "Migraciones Internas y Externas en el Perú e Índice de Desarrollo Humano (IDH)", "short": "Migraciones e IDH", "icon": "🚶", "kw": "migración"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Actividades Económicas en el Perú",
                "topics": [
                    {"title": "Actividades Extractivas: Minería (Canon Minero) y Pesca (Industrial y Artesanal)", "short": "Minería y Pesca", "icon": "⛏️", "kw": "minería"},
                    {"title": "Actividades Productivas: Agricultura y Ganadería en Costa, Sierra y Selva", "short": "Agricultura y Ganadería", "icon": "🚜", "kw": "agricultura"},
                    {"title": "Actividades Transformativas: Industria Ligera y Pesada en el Perú", "short": "Industria Peruana", "icon": "🏭", "kw": "industria"},
                    {"title": "Actividades Distributivas: Comercio, Vías de Comunicación y Transporte", "short": "Comercio y Transporte", "icon": "🚚", "kw": "transporte"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Gestión del Riesgo de Desastres, Tratado Antártico y Conservación",
                "topics": [
                    {"title": "Fenómenos Naturales y Peligros: Sismos, Tsunamis, Huaycos, Heladas y Friajes", "short": "Peligros y Vulnerabilidad", "icon": "⚠️", "kw": "desastres"},
                    {"title": "Gestión del Riesgo de Desastres: El Sistema SINAGERD, INDECI y CENEPRED", "short": "SINAGERD e INDECI", "icon": "🛡️", "kw": "sinagerd"},
                    {"title": "Áreas Naturales Protegidas por el Estado (SINANPE): Parques, Reservas y Santuarios", "short": "SINANPE y Parques", "icon": "🌲", "kw": "parques nacionales"},
                    {"title": "El Perú en la Antártida: Tratado Antártico, Base Científica Machu Picchu y Desarrollo Sostenible", "short": "Antártida y Sostenibilidad", "icon": "🇦🇶", "kw": "antártida"}
                ]
            }
        ]
    },

    "Psicología": {
        "area": "General",
        "icon": "🧠",
        "color": "#EC4899",
        "gradient": "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
        "desc": "Psicología como ciencia, proyecto de vida, bases biológicas, procesos cognitivos, afectivos, aprendizaje y personalidad.",
        "asigBanco": "Psicología",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: La Psicología como Ciencia y Métodos",
                "topics": [
                    {"title": "Definición Actual de la Psicología, Objeto de Estudio y Evolución", "short": "Psicología Ciencia", "icon": "🧠", "kw": "psicología"},
                    {"title": "Métodos de Investigación: Descriptivo, Correlacional y Experimental", "short": "Métodos Psicológicos", "icon": "🔬", "kw": "método experimental"},
                    {"title": "Ramas de la Psicología: Clínica, Educativa, Organizacional y Social", "short": "Ramas de la Psicología", "icon": "🏥", "kw": "ramas"},
                    {"title": "Escuelas Psicológicas Clásicas: Estructuralismo, Funcionalismo y Conductismo", "short": "Escuelas Clásicas", "icon": "🏛️", "kw": "conductismo"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Proyecto de Vida, Orientación Vocacional y Hábitos de Estudio",
                "topics": [
                    {"title": "El Proyecto de Vida Individual: Metas SMART, Misión, Visión y FODA Personal", "short": "Proyecto de Vida y FODA", "icon": "🎯", "kw": "proyecto de vida"},
                    {"title": "Orientación Vocacional: Elección Profesional, Aptitudes e Intereses Vocacionales", "short": "Orientación Vocacional", "icon": "🧭", "kw": "vocación"},
                    {"title": "Hábitos de Estudio, Estilos de Aprendizaje y Metacognición en la Preparación", "short": "Hábitos de Estudio", "icon": "📚", "kw": "hábitos de estudio"},
                    {"title": "Gestión del Tiempo, Técnica Pomodoro y Curva del Olvido (Hermann Ebbinghaus)", "short": "Gestión del Tiempo", "icon": "⏱️", "kw": "tiempo"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Bases Biológicas del Comportamiento",
                "topics": [
                    {"title": "La Neurona: Estructura, Potencial de Acción y Neurotransmisores", "short": "Neurona y Sinapsis", "icon": "⚡", "kw": "neurona"},
                    {"title": "Sistema Nervioso Central: Encéfalo, Corteza Cerebral y Hemisferios", "short": "Hemisferios Cerebrales", "icon": "🧠", "kw": "corteza"},
                    {"title": "Lóbulos Cerebrales (Frontal, Parietal, Temporal, Occipital) y Funciones", "short": "Lóbulos Cerebrales", "icon": "🧩", "kw": "lóbulos"},
                    {"title": "Sistema Límbico, Amígdala y Sistema Nervioso Autónomo (Simpático/Parasimpático)", "short": "Sistema Límbico y SNA", "icon": "❤️", "kw": "límbico"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Procesos Cognitivos Simples - Sensación y Percepción",
                "topics": [
                    {"title": "Sensación: Umbrales Sensoriales (Absoluto y Diferencial) y Receptores", "short": "Sensación y Umbrales", "icon": "👁️", "kw": "sensación"},
                    {"title": "Percepción: Definición, Base Fisiológica y Factores Subjetivos", "short": "Proceso Perceptivo", "icon": "🔍", "kw": "percepción"},
                    {"title": "Leyes de la Gestalt: Proximidad, Semejanza, Cierre y Figura-Fondo", "short": "Leyes de la Gestalt", "icon": "🖼️", "kw": "gestalt"},
                    {"title": "Alteraciones Perceptivas: Ilusiones (Objetivas/Subjetivas) y Alucinaciones", "short": "Ilusiones y Alucinaciones", "icon": "🌀", "kw": "ilusión"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Memoria y Atención",
                "topics": [
                    {"title": "Atención: Tipos de Atención (Sostenida, Selectiva, Dividida) y Factores", "short": "Procesos Atencionales", "icon": "🎯", "kw": "atención"},
                    {"title": "La Memoria: Fases (Codificación, Almacenamiento y Recuperación)", "short": "Fases de la Memoria", "icon": "💾", "kw": "memoria"},
                    {"title": "Estructura de la Memoria (Atkinson y Shiffrin): Sensorial, Corto y Largo Plazo", "short": "Memoria a Largo Plazo", "icon": "📚", "kw": "corto plazo"},
                    {"title": "El Olvido: Causas (Interferencia Proactiva y Retroactiva) y Amnesias", "short": "El Olvido y Amnesias", "icon": "⏳", "kw": "olvido"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Pensamiento, Lenguaje e Inteligencia",
                "topics": [
                    {"title": "Pensamiento: Naturaleza, Operaciones Racionales y Solución de Problemas", "short": "Pensamiento y Razonamiento", "icon": "💡", "kw": "pensamiento"},
                    {"title": "El Lenguaje: Funciones, Desarrollo Lingüístico y Relación con el Pensamiento", "short": "Lenguaje y Cognición", "icon": "🗣️", "kw": "lenguaje"},
                    {"title": "Teorías de la Inteligencia: Factor G (Spearman) y Multifactorial (Thurstone)", "short": "Teorías de Inteligencia", "icon": "📈", "kw": "inteligencia"},
                    {"title": "Inteligencias Múltiples (Gardner) e Inteligencia Emocional (Goleman)", "short": "Inteligencias Múltiples", "icon": "✨", "kw": "gardner"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Afectividad, Emociones y Sexualidad Humana Responsable",
                "topics": [
                    {"title": "La Afectividad Humana: Emociones Básicas, Sentimientos y Pasiones", "short": "Afectividad y Emociones", "icon": "❤️", "kw": "afectividad"},
                    {"title": "Manejo del Estrés, Ansiedad Preuniversitaria y Resiliencia", "short": "Estrés y Resiliencia", "icon": "🛡️", "kw": "estrés"},
                    {"title": "Sexualidad Humana: Dimensiones Biológica, Psicológica y Sociocultural", "short": "Sexualidad Humana", "icon": "✨", "kw": "sexualidad"},
                    {"title": "Salud Sexual y Reproductiva, Afectividad en Pareja y Prevención de ITS", "short": "Salud Sexual y Pareja", "icon": "🤝", "kw": "reproductiva"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Motivación y Voluntad",
                "topics": [
                    {"title": "Proceso Motivacional: Necesidad, Motivo, Conducta y Estado de Satisfacción", "short": "Ciclo Motivacional", "icon": "🚀", "kw": "motivación"},
                    {"title": "Clasificación de Necesidades: Biológicas, Psicológicas y Sociales", "short": "Tipos de Necesidades", "icon": "📋", "kw": "necesidades"},
                    {"title": "Jerarquía de Necesidades de Abraham Maslow: De Fisiológicas a Autorrealización", "short": "Pirámide de Maslow", "icon": "🔺", "kw": "maslow"},
                    {"title": "Motivación Intrínseca vs Extrínseca y Acto Volitivo", "short": "Motivación y Voluntad", "icon": "⚡", "kw": "intrínseca"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Teorías del Aprendizaje",
                "topics": [
                    {"title": "Definición de Aprendizaje y Diferencias con Conductas Innatas", "short": "Concepto Aprendizaje", "icon": "💡", "kw": "aprendizaje"},
                    {"title": "Condicionamiento Clásico (Iván Pávlov): Estímulos y Respuestas Condicionadas", "short": "Condicionamiento Clásico", "icon": "🔔", "kw": "pávlov"},
                    {"title": "Condicionamiento Operante (B.F. Skinner): Reforzamiento y Castigo", "short": "Condicionamiento Operante", "icon": "🕹️", "kw": "skinner"},
                    {"title": "Aprendizaje Cognitivo: Por Descubrimiento (Bruner) y Significativo (Ausubel)", "short": "Aprendizaje Significativo", "icon": "🌱", "kw": "ausubel"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Personalidad, Factores de Protección y Conductas de Riesgo",
                "topics": [
                    {"title": "La Personalidad: Estructura, Temperamento, Carácter y Teoría Psicoanalítica (Freud)", "short": "Personalidad y Psicoanálisis", "icon": "🪞", "kw": "personalidad"},
                    {"title": "Teorías de la Personalidad: Rasgos (Allport, Cattell) y Mecanismos de Defensa del Yo", "short": "Teorías de la Personalidad", "icon": "📊", "kw": "mecanismos de defensa"},
                    {"title": "Factores de Protección: Autoestima, Habilidades Sociales, Asertividad y Redes de Apoyo", "short": "Factores de Protección", "icon": "🛡️", "kw": "autoestima"},
                    {"title": "Tipos de Familia (Nuclear, Extensa, Monoparental) y Prevención de Violencia Familiar y Cyberbullying", "short": "Familia y Prevención Violencia", "icon": "👨‍👩‍👧", "kw": "familia"}
                ]
            }
        ]
    },

    "Lenguaje": {
        "area": "General",
        "icon": "📝",
        "color": "#38BDF8",
        "gradient": "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
        "desc": "Comunicación, fonética, ortografía acentual, morfología, categorías gramaticales y sintaxis.",
        "asigBanco": "Lenguaje",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: La Comunicación Humana y Funciones del Lenguaje",
                "topics": [
                    {"title": "La Comunicación: Elementos (Emisor, Receptor, Mensaje, Código, Canal, Contexto)", "short": "Elementos Comunicación", "icon": "🗣️", "kw": "comunicación"},
                    {"title": "Tipos de Comunicación: Lingüística, No Lingüística, Directa e Indirecta", "short": "Tipos de Comunicación", "icon": "📡", "kw": "canales"},
                    {"title": "El Lenguaje: Características (Universal, Racional, Innato y Doblemente Articulado)", "short": "Propiedades del Lenguaje", "icon": "🌐", "kw": "lenguaje"},
                    {"title": "Funciones del Lenguaje (Jakobson): Representativa, Expresiva, Apelativa, Fática y Poética", "short": "Funciones del Lenguaje", "icon": "🎯", "kw": "apelativa"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Lengua, Habla, Dialecto y Sociolingüística",
                "topics": [
                    {"title": "Plano del Lenguaje (Saussure): Lengua (Social, Psíquica) vs Habla (Individual)", "short": "Lengua y Habla", "icon": "👥", "kw": "lengua"},
                    {"title": "Variaciones Lingüísticas: Dialecto (Diastático, Diatópico y Diafásico)", "short": "Dialecto y Variedades", "icon": "🗺️", "kw": "dialecto"},
                    {"title": "Niveles del Uso de la Lengua: Superestándar, Estándar y Subestándar", "short": "Niveles de la Lengua", "icon": "📊", "kw": "estándar"},
                    {"title": "Realidad Lingüística del Perú: Lenguas Amerindias y No Amerindias", "short": "Lenguas del Perú", "icon": "🇵🇪", "kw": "quechua"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Fonética, Fonología y Sílaba",
                "topics": [
                    {"title": "Fonología (Fonemas en la Mente) vs Fonética (Sonidos y Alófonos)", "short": "Fonema vs Fonética", "icon": "🔊", "kw": "fonema"},
                    {"title": "Clasificación de Vocales y Consonantes según Punto y Modo de Articulación", "short": "Vocales y Consonantes", "icon": "👄", "kw": "articulación"},
                    {"title": "La Sílaba: Estructura (Cabeza, Cima y Coda) y Clases de Sílabas", "short": "Estructura Silábica", "icon": "🔤", "kw": "sílaba"},
                    {"title": "Reglas de Silabeo Ortográfico en el Idioma Español", "short": "Silabeo Ortográfico", "icon": "✂️", "kw": "silabeo"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Concurrencia Vocálica (Diptongo, Triptongo y Hiato)",
                "topics": [
                    {"title": "Diptongo Creciente, Decreciente y Homogéneo: Reglas y Casos", "short": "Diptongos", "icon": "🔗", "kw": "diptongo"},
                    {"title": "Triptongo: Secuencia Vocal Cerrada + Abierta + Cerrada", "short": "Triptongos", "icon": "🔀", "kw": "triptongo"},
                    {"title": "Hiato Simple (Vocales Abiertas Contiguas): Reglas de Separación", "short": "Hiato Simple", "icon": "⚡", "kw": "hiato"},
                    {"title": "Hiato Acentual o Acentuación Robúrica: Tilde en Vocal Cerrada Tónica", "short": "Hiato Acentual", "icon": "✨", "kw": "acentual"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Acentuación General y Especial",
                "topics": [
                    {"title": "Acentuación General: Agudas (Oxítonas), Graves (Paroxítonas) y Esdrújulas", "short": "Acentuación General", "icon": "🎯", "kw": "agudas"},
                    {"title": "Tilde Diacrítica en Monosílabos (Él, Tú, Mí, Sí, Té, Dé, Sé, Más)", "short": "Tilde Diacrítica", "icon": "🏷️", "kw": "diacrítica"},
                    {"title": "Tilde Enfática en Interrogativos y Exclamativos Directos e Indirectos", "short": "Tilde Enfática", "icon": "❓", "kw": "enfática"},
                    {"title": "Acentuación de Palabras Compuestas y con Sufijo -mente", "short": "Palabras Compuestas", "icon": "🧩", "kw": "compuestas"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Morfología y Formación de Palabras",
                "topics": [
                    {"title": "Morfología: El Morfema, Lexema (Raíz) y Morfemas Derivativos y Flexivos", "short": "Morfemas y Raíz", "icon": "🌱", "kw": "morfema"},
                    {"title": "Procesos Formativos: Derivación, Composición (Propiamente Dicha y Yuxtaposición)", "short": "Derivación y Composición", "icon": "🔨", "kw": "derivación"},
                    {"title": "Parasíntesis, Onomatopeya, Acronimia y Siglación en Español", "short": "Parasíntesis y Siglas", "icon": "🔠", "kw": "parasíntesis"},
                    {"title": "Alomorfos y Flexión de Género y Número en Sustantivos y Adjetivos", "short": "Flexión de Género y Número", "icon": "👥", "kw": "flexión"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Categorías Gramaticales Nominales",
                "topics": [
                    {"title": "El Sustantivo: Criterio Semántico, Morfológico, Sintáctico y Clases", "short": "El Sustantivo", "icon": "📦", "kw": "sustantivo"},
                    {"title": "El Adjetivo Calificativo: Grados (Positivo, Comparativo y Superlativo)", "short": "El Adjetivo y Grados", "icon": "🎨", "kw": "adjetivo"},
                    {"title": "Determinantes: Artículos, Demostrativos, Posesivos, Numerales e Indefinidos", "short": "Los Determinantes", "icon": "🏷️", "kw": "artículo"},
                    {"title": "El Pronombre: Pronombres Personales, Demostrativos y Enclíticos/Proclíticos", "short": "El Pronombre", "icon": "👤", "kw": "pronombre"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: El Verbo y Categorías Invariables",
                "topics": [
                    {"title": "El Verbo: Accidentes Gramaticales (Número, Persona, Tiempo, Modo y Aspecto)", "short": "El Verbo y Accidentes", "icon": "🏃", "kw": "verbo"},
                    {"title": "Formas No Personales del Verbo (Verboides): Infinitivo, Participio y Gerundio", "short": "Verboides", "icon": "📋", "kw": "gerundio"},
                    {"title": "Clasificación del Verbo: Copulativo, Transitivo, Intransitivo y Perífrasis", "short": "Clases de Verbos", "icon": "⚙️", "kw": "transitivo"},
                    {"title": "Categorías Invariables: El Adverbio, la Preposición y la Conjunción", "short": "Adverbio y Conectores", "icon": "🔗", "kw": "preposición"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Sintaxis de la Oración Simple",
                "topics": [
                    {"title": "La Oración Bimembre: Criterio Sintáctico y Estructura General", "short": "Oración Bimembre", "icon": "📐", "kw": "oración"},
                    {"title": "El Sujeto: Núcleo y Modificadores (Modificador Directo e Indirecto, Aposición)", "short": "El Sujeto y Modificadores", "icon": "🎯", "kw": "sujeto"},
                    {"title": "El Predicado Verbal: Núcleo del Predicado y Objeto Directo (OD)", "short": "Predicado y Objeto Directo", "icon": "💥", "kw": "objeto directo"},
                    {"title": "Objeto Indirecto (OI), Complemento Circunstancial, Atributo y Agente", "short": "OI y Circunstanciales", "icon": "📍", "kw": "circunstancial"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Oración Compuesta y Normativa de Puntuación",
                "topics": [
                    {"title": "Oración Compuesta Coordinada: Copulativa, Disyuntiva, Adversativa e Ilativa", "short": "Compuesta Coordinada", "icon": "🔀", "kw": "coordinada"},
                    {"title": "Oración Compuesta Subordinada Sustantiva (Sujeto, OD) y Adjetiva", "short": "Subordinada Sustantiva", "icon": "🧩", "kw": "subordinada"},
                    {"title": "Oración Compuesta Subordinada Adverbial (Causal, Concesiva, Condicional)", "short": "Subordinada Adverbial", "icon": "📈", "kw": "adverbial"},
                    {"title": "Signos de Puntuación: Punto, Coma (Elíptica, Vocativa, Incidental) y Punto y Coma", "short": "Signos de Puntuación", "icon": "✍️", "kw": "puntuación"}
                ]
            }
        ]
    },

    "Literatura": {
        "area": "General",
        "icon": "📖",
        "color": "#A855F7",
        "gradient": "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
        "desc": "Teoría literaria, literatura clásica griega, española, hispanoamericana y literatura peruana.",
        "asigBanco": "Literatura",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Teoría Literaria, Géneros y Figuras Literarias",
                "topics": [
                    {"title": "La Literatura como Arte: Funciones Estética, Cognoscitiva y Catártica", "short": "Concepto de Literatura", "icon": "📖", "kw": "literatura"},
                    {"title": "Géneros Literarios Clásicos: Épico, Lírico, Dramático y Narrativo", "short": "Géneros Literarios", "icon": "🎭", "kw": "géneros"},
                    {"title": "Figuras Literarias de Sentido: Metáfora, Metonimia, Símil y Antítesis", "short": "Metáfora y Símil", "icon": "✨", "kw": "metáfora"},
                    {"title": "Figuras Literarias de Forma y Dicción: Anáfora, Hipérbaton, Epíteto e Hipérbole", "short": "Hipérbaton e Hipérbole", "icon": "📝", "kw": "hipérbaton"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Literatura Clásica Griega - Épica Heroica",
                "topics": [
                    {"title": "Contexto Griego, Oralidad, Mito y la Figura de Homero (Cuestión Homérica)", "short": "Contexto Homérico", "icon": "🏛️", "kw": "homero"},
                    {"title": "La Ilíada: Cólera de Aquiles, Estructura, Valores Heroicos y Fatalismo", "short": "La Ilíada de Homero", "icon": "⚔️", "kw": "ilíada"},
                    {"title": "La Odisea: El Retorno de Odiseo a Ítaca, Estructura y Telemaquia", "short": "La Odisea", "icon": "⛵", "kw": "odisea"},
                    {"title": "Personajes Clave y Rasgos del Estilo Homérico: Epítetos y Símiles", "short": "Personajes Homéricos", "icon": "🏹", "kw": "aquiles"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Tragedia Griega Clásica - Sófocles y Esquilo",
                "topics": [
                    {"title": "Origen de la Tragedia: Culto a Dionisio, Coro y Catarsis Trágica", "short": "Origen Tragedia", "icon": "🎭", "kw": "tragedia"},
                    {"title": "Esquilo: Padre de la Tragedia y la Trilogía de la Orestíada", "short": "Esquilo y Orestíada", "icon": "👑", "kw": "orestíada"},
                    {"title": "Sófocles: Aporte Técnico (Tercer Actor) y Destino Ineludible", "short": "Sófocles y Estilo", "icon": "📜", "kw": "sófocles"},
                    {"title": "Edipo Rey: Argumento, Personajes, Hamartía y Revelación Trágica", "short": "Edipo Rey", "icon": "👁️", "kw": "edipo"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Narrativa Universal Moderna - Kafka, Borges y Vanguardia",
                "topics": [
                    {"title": "Dante Alighieri y la Divina Comedia / Cantar de Mío Cid: Épica Medieval", "short": "Divina Comedia y Mío Cid", "icon": "🔥", "kw": "dante"},
                    {"title": "William Shakespeare: El Teatro Isabelino, 'Hamlet' y la Condición Humana", "short": "Shakespeare y Hamlet", "icon": "💀", "kw": "shakespeare"},
                    {"title": "Franz Kafka: 'La Metamorfosis' - Gregorio Samsa, Alienación y Absurdo", "short": "La Metamorfosis (Kafka)", "icon": "🪲", "kw": "metamorfosis"},
                    {"title": "Jorge Luis Borges: 'Ficciones' y 'El Aleph' - Laberintos, Tiempo y Fantasía", "short": "Borges (Ficciones)", "icon": "🌀", "kw": "borges"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Siglo de Oro Español - Poesía y Novela",
                "topics": [
                    {"title": "Siglo de Oro Español: Renacimiento y Barroco, Escuelas Poéticas", "short": "Siglo de Oro", "icon": "👑", "kw": "siglo de oro"},
                    {"title": "Garcilaso de la Vega: Églogas (Salicio y Nemoroso) y Tópicos Renacentistas", "short": "Garcilaso y Églogas", "icon": "🌿", "kw": "garcilaso"},
                    {"title": "La Novela Picaresca: El Lazarillo de Tormes y la Crítica Social", "short": "Lazarillo de Tormes", "icon": "🥖", "kw": "lazarillo"},
                    {"title": "Miguel de Cervantes Saavedra: El Ingenioso Hidalgo Don Quijote de la Mancha", "short": "Don Quijote (Cervantes)", "icon": "🛡️", "kw": "quijote"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Teatro del Siglo de Oro Español",
                "topics": [
                    {"title": "Lope de Vega y el Teatro Nacional: 'Arte Nuevo de Hacer Comedias'", "short": "Lope de Vega y Teatro", "icon": "📜", "kw": "lope de vega"},
                    {"title": "Fuenteovejuna: El Honor Villano y la Justicia Colectiva", "short": "Fuenteovejuna", "icon": "🏘️", "kw": "fuenteovejuna"},
                    {"title": "Pedro Calderón de la Barca y el Teatro Filosófico Barroco", "short": "Calderón de la Barca", "icon": "💭", "kw": "calderón"},
                    {"title": "La Vida es Sueño: El Libre Albedrío frente al Destino y Segismundo", "short": "La Vida es Sueño", "icon": "⛓️", "kw": "segismundo"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Literatura Peruana Prehispánica y Colonial",
                "topics": [
                    {"title": "Literatura Quechua Prehispánica: Poesía Lírica (Haylli, Harawi) y Drama Ollantay", "short": "Literatura Quechua", "icon": "🌄", "kw": "ollantay"},
                    {"title": "Crónicas de la Conquista: Españolas, Indígenas (Guamán Poma) y Mestizas", "short": "Crónicas y Testimonios", "icon": "📜", "kw": "guamán poma"},
                    {"title": "Inca Garcilaso de la Vega: Los Comentarios Reales de los Incas", "short": "Comentarios Reales", "icon": "🏛️", "kw": "garcilaso de la vega"},
                    {"title": "Literatura Colonial y Emancipadora: Mariano Melgar y los Yaravíes Arequipeños", "short": "Mariano Melgar", "icon": "🕊️", "kw": "melgar"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Costumbrismo, Tradiciones y Realismo Peruano",
                "topics": [
                    {"title": "Costumbrismo Peruano y Teatro: 'Ña Catita' de Manuel Ascencio Segura", "short": "Ña Catita (Segura)", "icon": "👵", "kw": "ña catita"},
                    {"title": "Romanticismo Peruano: Ricardo Palma y las 'Tradiciones Peruanas'", "short": "Tradiciones Peruanas", "icon": "📚", "kw": "ricardo palma"},
                    {"title": "Realismo Peruano Post-Guerra: Manuel González Prada ('Discurso en el Politeama')", "short": "González Prada (Politeama)", "icon": "📢", "kw": "gonzález prada"},
                    {"title": "Novela Indigenista Pionera: 'Aves sin nido' de Clorinda Matto de Turner", "short": "Aves sin nido (Matto de Turner)", "icon": "🕊️", "kw": "aves sin nido"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Realismo, Modernismo y Posmodernismo Peruano",
                "topics": [
                    {"title": "Realismo Peruano Post-Guerra del Pacífico: Manuel González Prada", "short": "Realismo y González Prada", "icon": "💥", "kw": "gonzález prada"},
                    {"title": "'Discurso en el Politeama': Crítica a los Viejos y Llamado a la Juventud", "short": "Discurso Politeama", "icon": "📢", "kw": "politeama"},
                    {"title": "Modernismo Peruano: José Santos Chocano ('Alma América')", "short": "Santos Chocano", "icon": "🦅", "kw": "chocano"},
                    {"title": "Posmodernismo: Abraham Valdelomar (El Caballero Carmelo) y José María Eguren", "short": "Valdelomar y Eguren", "icon": "🐓", "kw": "valdelomar"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Indigenismo, Narrativa Contemporánea y Boom",
                "topics": [
                    {"title": "José María Arguedas: 'Los Ríos Profundos', 'Yawar Fiesta' y el Neoindigenismo", "short": "Arguedas (Ríos Profundos)", "icon": "🌊", "kw": "arguedas"},
                    {"title": "Ciro Alegría: 'El Mundo es Ancho y Ajeno' y la Comunidad Indígena", "short": "Ciro Alegría", "icon": "🏔️", "kw": "ciro alegría"},
                    {"title": "Mario Vargas Llosa: 'La Ciudad y los Perros' y las Técnicas Narrativas del Boom", "short": "Vargas Llosa (Ciudad y Perros)", "icon": "🐕", "kw": "vargas llosa"},
                    {"title": "Oswaldo Reynoso: 'Los Inocentes' (Lima en Rock) y la Narrativa Juvenil Urbana", "short": "Reynoso (Los Inocentes)", "icon": "🎸", "kw": "reynoso"}
                ]
            }
        ]
    },

    "Raz. Lógico": {
        "area": "General",
        "icon": "🧩",
        "color": "#6366F1",
        "gradient": "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
        "desc": "Proposiciones, principios lógicos, conectores, formalización, tablas de verdad, equivalencias e inferencias.",
        "asigBanco": "Raz. Lógico",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Proposiciones y Enunciados Lógicos",
                "topics": [
                    {"title": "Enunciado vs Proposición: Definición, Criterios de Verdad y Falsedad", "short": "Proposiciones", "icon": "🧩", "kw": "proposición"},
                    {"title": "Enunciados no Proposicionales (Directivos, Interrogativos, Exclamativos) y Paradojas Lógicas", "short": "Enunciados y Paradojas", "icon": "❓", "kw": "paradojas"},
                    {"title": "Principios Lógicos Supremos: Identidad, No Contradicción y Tercio Excluido", "short": "Principios Lógicos", "icon": "⚖️", "kw": "tercio excluido"},
                    {"title": "Clasificación de Proposiciones: Simples (Atómicas) y Compuestas (Moleculares)", "short": "Simples y Moleculares", "icon": "🔗", "kw": "atómica"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Conectores Lógicos y Formalización Proposicional",
                "topics": [
                    {"title": "Conectores Lógicos: Negación (~), Conjunción (∧), Disyunción Débil (∨)", "short": "Conectores Básicos", "icon": "🔣", "kw": "conjunción"},
                    {"title": "Disyunción Fuerte (⊻), Condicional (→) y Bicondicional (↔)", "short": "Condicional y Bicondicional", "icon": "➡️", "kw": "condicional"},
                    {"title": "Estructura del Condicional: Antecedente, Consecuente y Conectores de Causa", "short": "Causa y Consecuencia", "icon": "🎯", "kw": "antecedente"},
                    {"title": "Reglas de Formalización de Enunciados del Lenguaje Natural al Simbólico", "short": "Formalización Lógica", "icon": "📝", "kw": "formalización"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Tablas de Verdad y Evaluación de Esquemas Moleculares",
                "topics": [
                    {"title": "Construcción de Tablas de Verdad: Fórmula 2^n para Arreglos de Valores", "short": "Tablas de Verdad", "icon": "📊", "kw": "tabla de verdad"},
                    {"title": "Matriz Principal: Tautología (Verdad Absoluta), Contradicción y Contingencia", "short": "Tautología y Contingencia", "icon": "✔️", "kw": "tautología"},
                    {"title": "Método Abreviado o del Reductio ad Absurdum para Determinar Validez", "short": "Método Abreviado", "icon": "⚡", "kw": "método abreviado"},
                    {"title": "Jerarquía de Conectores y Signos de Agrupación en Esquemas Lógicos", "short": "Jerarquía de Conectores", "icon": "📐", "kw": "esquema molecular"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Leyes de Equivalencia Lógica",
                "topics": [
                    {"title": "Leyes de Idempotencia, Doble Negación y Conmutatividad", "short": "Leyes Básicas", "icon": "🔄", "kw": "equivalencia"},
                    {"title": "Leyes de De Morgan: Negación de Conjunciones y Disyunciones", "short": "Leyes de De Morgan", "icon": "🛡️", "kw": "morgan"},
                    {"title": "Ley de la Implicación Material (p → q ≡ ~p ∨ q) y de Absorción", "short": "Implicación y Absorción", "icon": "🧲", "kw": "implicación"},
                    {"title": "Simplificación de Esquemas Moleculares Complejos con Leyes Lógicas", "short": "Simplificación Lógica", "icon": "✂️", "kw": "simplificación"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Circuitos Lógicos de Conmutadores y Compuertas",
                "topics": [
                    {"title": "Circuitos en Serie: Modelamiento Lógico de la Conjunción (p ∧ q)", "short": "Circuitos en Serie", "icon": "🔌", "kw": "serie"},
                    {"title": "Circuitos en Paralelo: Modelamiento Lógico de la Disyunción (p ∨ q)", "short": "Circuitos en Paralelo", "icon": "💡", "kw": "paralelo"},
                    {"title": "Diseño y Simplificación de Redes de Conmutadores con Leyes Lógicas", "short": "Diseño de Redes", "icon": "⚙️", "kw": "circuito"},
                    {"title": "Compuertas Lógicas Digitales: AND, OR, NOT, NAND y NOR", "short": "Compuertas Lógicas", "icon": "💻", "kw": "compuertas"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Inferencias Lógicas e Implicaciones Notables",
                "topics": [
                    {"title": "Estructura de una Inferencia: Premisas y Conclusión Válida", "short": "Estructura Inferencia", "icon": "🎯", "kw": "inferencia"},
                    {"title": "Modus Ponendo Ponens (MPP) y Modus Tollendo Tollens (MTT)", "short": "Modus Ponens y Tollens", "icon": "🏛️", "kw": "modus ponens"},
                    {"title": "Silogismo Disyuntivo (MTP) y Silogismo Hipotético Puro (SHP)", "short": "Silogismo Hipotético", "icon": "🔀", "kw": "silogismo hipotético"},
                    {"title": "Dilema Constructivo y Dilema Destructivo en Demostraciones", "short": "Dilemas Lógicos", "icon": "⚖️", "kw": "dilema"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Lógica de Clases y Álgebra Booleana",
                "topics": [
                    {"title": "Concepto de Clase, Conjunto Universal y Clase Vacía (∅)", "short": "Concepto de Clase", "icon": "⚪", "kw": "clases"},
                    {"title": "Operaciones entre Clases: Unión (A ∪ B), Intersección (A ∩ B) y Complemento", "short": "Operaciones de Clases", "icon": "⭕", "kw": "intersección"},
                    {"title": "Representación Gráfica de Proposiciones Categóricas con Diagramas de Venn", "short": "Diagramas de Venn", "icon": "📊", "kw": "venn"},
                    {"title": "Relaciones de Inclusión, Exclusión e Igualdad entre Clases", "short": "Relaciones de Clases", "icon": "🔗", "kw": "inclusión"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Proposiciones Categóricas y Silogismos Categóricos",
                "topics": [
                    {"title": "Las 4 Proposiciones Categóricas Típicas: A (Universal Afirmativa), E, I, O", "short": "Formas A, E, I, O", "icon": "🏷️", "kw": "categórica"},
                    {"title": "Cuadro de Boecio: Relaciones de Contradicción, Contrarias, Subcontrarias y Subalternas", "short": "Cuadro de Boecio", "icon": "🔲", "kw": "boecio"},
                    {"title": "Estructura del Silogismo Categórico: Término Mayor, Menor y Término Medio", "short": "Término Medio", "icon": "🏛️", "kw": "término medio"},
                    {"title": "Figuras y Modos Válidos del Silogismo y Validación con Diagramas de Venn", "short": "Validez del Silogismo", "icon": "✔️", "kw": "silogismo"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Lógica Cuantificacional",
                "topics": [
                    {"title": "Cuantificadores Lógicos: Universal (∀x) y Existencial (∃x)", "short": "Cuantificadores", "icon": "🌐", "kw": "cuantificador"},
                    {"title": "Formalización de Proposiciones con Cuantificadores y Funciones Proposicionales", "short": "Formalización de Predicados", "icon": "🔣", "kw": "predicado"},
                    {"title": "Negación de Cuantificadores: Equivalencia entre Universal y Existencial", "short": "Negación de Cuantificadores", "icon": "🔄", "kw": "negación"},
                    {"title": "Inferencias Cuantificacionales y Leyes de Instanciación", "short": "Instanciación", "icon": "⚡", "kw": "instanciación"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Falacias Lógicas Formales y No Formales",
                "topics": [
                    {"title": "Concepto de Falacia y Paralogismos en el Discurso Argumentativo", "short": "Concepto de Falacia", "icon": "🚫", "kw": "falacia"},
                    {"title": "Falacias Formales: Afirmación del Consecuente y Negación del Antecedente", "short": "Falacias Formales", "icon": "❌", "kw": "afirmación del consecuente"},
                    {"title": "Falacias de Atingencia: Ad Hominem, Ad Baculum, Ad Verecundiam y Ad Ignorantiam", "short": "Ad Hominem y Baculum", "icon": "⚠️", "kw": "ad hominem"},
                    {"title": "Falacias de Ambigüedad: Equívoco, Anfibología, Énfasis y Causa Falsa", "short": "Falacias de Ambigüedad", "icon": "🎭", "kw": "anfibología"}
                ]
            }
        ]
    },

    "Raz. Matemático": {
        "area": "General",
        "icon": "🧮",
        "color": "#F97316",
        "gradient": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        "desc": "Sucesiones, series, proporcionalidad, porcentajes, planteo de ecuaciones, edades, conteo y probabilidades.",
        "asigBanco": "Raz. Matemático",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Sucesiones Numéricas y Alfanuméricas",
                "topics": [
                    {"title": "Sucesiones Numéricas: Patrones Aritméticos, Geométricos y Cuadráticos", "short": "Sucesiones Numéricas", "icon": "🔢", "kw": "sucesión"},
                    {"title": "Término Enésimo (tn) en Sucesiones Lineales y de Segundo Orden", "short": "Término Enésimo", "icon": "📈", "kw": "enésimo"},
                    {"title": "Sucesiones Alfanuméricas y Equivalencia Posicional de Letras (sin CH ni LL)", "short": "Alfanuméricas", "icon": "🔤", "kw": "alfanumérico"},
                    {"title": "Sucesiones Especiales: Fibonacci, Lucas, Números Triangulares y Primos", "short": "Sucesiones Notables", "icon": "✨", "kw": "fibonacci"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Series Numéricas y Sumatorias Notables",
                "topics": [
                    {"title": "Serie Aritmética: Fórmula de la Suma (S = [(t1 + tn)/2] · n)", "short": "Serie Aritmética", "icon": "➕", "kw": "serie aritmética"},
                    {"title": "Serie Geométrica Finita e Infinita Decreciente (Suma Límite)", "short": "Serie Geométrica", "icon": "✖️", "kw": "serie geométrica"},
                    {"title": "Sumatorias Notables: Primeros 'n' Enteros, Cuadrados y Cubos Consecutivos", "short": "Sumatorias Notables", "icon": "Σ", "kw": "sumatoria"},
                    {"title": "Propiedades de la Notación Sigma (Σ) y Descomposición de Series", "short": "Notación Sigma", "icon": "📐", "kw": "sigma"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Magnitudes Proporcionales y Regla de Tres",
                "topics": [
                    {"title": "Magnitudes Directamente Proporcionales (D.P.): Cociente Constante", "short": "Magnitudes D.P.", "icon": "⚖️", "kw": "directamente proporcional"},
                    {"title": "Magnitudes Inversamente Proporcionales (I.P.): Producto Constante", "short": "Magnitudes I.P.", "icon": "🔄", "kw": "inversamente proporcional"},
                    {"title": "Reparto Proporcional Simple Directo, Inverso y Compuesto", "short": "Reparto Proporcional", "icon": "🍰", "kw": "reparto"},
                    {"title": "Regla de Tres Simple (Directa e Inversa) y Regla de Tres Compuesta", "short": "Regla de Tres", "icon": "🎯", "kw": "regla de tres"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Tanto por Ciento y Aplicaciones Comerciales",
                "topics": [
                    {"title": "Concepto de Porcentaje y Operaciones con Porcentajes (% de N)", "short": "Tanto por Ciento", "icon": "🏷️", "kw": "porcentaje"},
                    {"title": "Aumentos y Descuentos Sucesivos: Fórmula de Variación Única", "short": "Aumentos y Descuentos", "icon": "📉", "kw": "descuentos sucesivos"},
                    {"title": "Aplicaciones Comerciales: Precio de Costo (Pc), Venta (Pv) y Ganancia (G)", "short": "Comercio: Pv, Pc y G", "icon": "💰", "kw": "ganancia"},
                    {"title": "Precio de Lista (Pl), Descuento y Pérdida en Transacciones Reales", "short": "Precio de Lista", "icon": "🧾", "kw": "precio de lista"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Planteo de Ecuaciones",
                "topics": [
                    {"title": "Traducción del Lenguaje Verbal al Lenguaje Matemático", "short": "Traducción Verbal", "icon": "📝", "kw": "planteo"},
                    {"title": "Problemas de Números Consecutivos, Fracciones de Cantidades y Excesos", "short": "Números y Fracciones", "icon": "🔢", "kw": "consecutivos"},
                    {"title": "Problemas de Compra, Venta y Repartos con Ecuaciones Lineales", "short": "Compras y Repartos", "icon": "🛒", "kw": "compra"},
                    {"title": "Métodos Especiales de Resolución: Método del Rombo y del Cangrejo", "short": "Rombo y Cangrejo", "icon": "🦀", "kw": "rombo"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Problemas sobre Edades",
                "topics": [
                    {"title": "Estructura Temporal: Sujetos, Tiempos (Pasado, Presente, Futuro) y Condiciones", "short": "Tiempos y Sujetos", "icon": "⏳", "kw": "edades"},
                    {"title": "Problemas con un Solo Sujeto y Planteo Temporal Directo", "short": "Edades un Sujeto", "icon": "👤", "kw": "edad"},
                    {"title": "Problemas con Dos o Más Sujetos: Cuadros de Doble Entrada", "short": "Cuadro de Doble Entrada", "icon": "📊", "kw": "doble entrada"},
                    {"title": "Principio de la Diferencia de Edades Constante en el Tiempo y Aspas", "short": "Diferencia Constante", "icon": "⚖️", "kw": "diferencia de edades"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Razonamiento Geométrico - Perímetros y Áreas",
                "topics": [
                    {"title": "Perímetro de Figuras Planas y Longitud de Circunferencias", "short": "Perímetros", "icon": "📏", "kw": "perímetro"},
                    {"title": "Áreas de Regiones Triangulares: Fórmulas Básicas, Trigonométricas y Herón", "short": "Áreas Triangulares", "icon": "📐", "kw": "área del triángulo"},
                    {"title": "Áreas de Regiones Cuadrangulares y Circulares (Sectores y Coronas)", "short": "Áreas Circulares", "icon": "⚪", "kw": "círculo"},
                    {"title": "Cálculo de Áreas de Regiones Sombreadas por Traslado y Diferencia", "short": "Áreas Sombreadas", "icon": "🎨", "kw": "sombreada"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Principios de Conteo y Factoriales",
                "topics": [
                    {"title": "Factorial de un Número (n!) y Propiedades Operativas", "short": "Factoriales (n!)", "icon": "❗", "kw": "factorial"},
                    {"title": "Principio Fundamental de Adición: Eventos Mutuamente Excluyentes (O)", "short": "Principio de Adición", "icon": "➕", "kw": "adición"},
                    {"title": "Principio Fundamental de Multiplicación: Eventos Secuenciales (Y)", "short": "Principio Multiplicativo", "icon": "✖️", "kw": "multiplicación"},
                    {"title": "Conteo de Rutas, Caminos en Mallas y Número de Maneras de Vestir", "short": "Conteo de Rutas", "icon": "🧭", "kw": "rutas"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Análisis Combinatorio",
                "topics": [
                    {"title": "Diferenciación Clave: ¿Importa el Orden en la Agrupación?", "short": "¿Importa el Orden?", "icon": "🔍", "kw": "combinatorio"},
                    {"title": "Permutaciones Lineales y Permutaciones Circulares [(n - 1)!]", "short": "Permutaciones Lineales", "icon": "🔄", "kw": "permutación"},
                    {"title": "Permutaciones con Elementos Repetidos (Letras de Palabras)", "short": "Permutación con Repetición", "icon": "🔤", "kw": "repetición"},
                    {"title": "Combinaciones Simples (Cn,k): Elección de Grupos y Comités", "short": "Combinaciones (C n,k)", "icon": "🎲", "kw": "combinación"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Teoría de Probabilidades y Estadística",
                "topics": [
                    {"title": "Experimento Aleatorio, Espacio Muestral (Ω) y Eventos o Sucesos", "short": "Espacio Muestral", "icon": "🪙", "kw": "probabilidad"},
                    {"title": "Probabilidad Clásica de Laplace: Casos Favorables entre Casos Totales", "short": "Regla de Laplace", "icon": "🎯", "kw": "laplace"},
                    {"title": "Probabilidad de Eventos Independientes y Probabilidad Condicional", "short": "Eventos Independientes", "icon": "🔀", "kw": "independientes"},
                    {"title": "Estadística Básica: Medidas de Tendencia Central (Media, Mediana, Moda)", "short": "Media, Mediana y Moda", "icon": "📊", "kw": "mediana"}
                ]
            }
        ]
    },

    "Raz. Verbal": {
        "area": "General",
        "icon": "📖",
        "color": "#14B8A6",
        "gradient": "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
        "desc": "Sinonimia contextual, antonimia, polisemia, analogías, oraciones incompletas y comprensión de lectura.",
        "asigBanco": "Raz. Verbal",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Relaciones Semánticas Básicas - Sinonimia Contextual",
                "topics": [
                    {"title": "El Signo Lingüístico: Significante y Significado (Semas)", "short": "El Signo Lingüístico", "icon": "🔤", "kw": "semántica"},
                    {"title": "Sinonimia Contextual Denotativa: Precisión Semántica en el Texto", "short": "Sinonimia Denotativa", "icon": "📖", "kw": "sinónimo"},
                    {"title": "Sinonimia Contextual Connotativa: Sentido Figurado y Metáforas", "short": "Sinonimia Connotativa", "icon": "✨", "kw": "connotativa"},
                    {"title": "Criterios de Resolución: Misma Categoría Gramatical y Campo Semántico", "short": "Criterios de Sinonimia", "icon": "🎯", "kw": "campo semántico"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Antonimia Contextual y Oposición Semántica",
                "topics": [
                    {"title": "Antonimia Contextual Denotativa: Términos Opuestos en Oraciones", "short": "Antonimia Denotativa", "icon": "↔️", "kw": "antónimo"},
                    {"title": "Clases de Antónimos: Graduales, Complementarios y Recíprocos", "short": "Clases de Antónimos", "icon": "⚖️", "kw": "antónimos"},
                    {"title": "Antonimia Gramatical o Morfológica: Prefijos de Oposición (a-, in-, des-, contra-)", "short": "Antónimos por Prefijos", "icon": "🔣", "kw": "prefijo"},
                    {"title": "Criterios de Descarte de Antónimos en Preguntas de Admisión UNSA", "short": "Criterios de Antonimia", "icon": "🚫", "kw": "antonimia"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Polisemia, Homonimia y Paronimia",
                "topics": [
                    {"title": "Polisemia: Un Significante con Múltiples Significados emparentados", "short": "Polisemia Léxica", "icon": "🌿", "kw": "polisemia"},
                    {"title": "Homonimia: Homófonos (Mismo Sonido) y Homógrafos (Misma Grafía)", "short": "Homonimia y Homófonos", "icon": "🔊", "kw": "homófono"},
                    {"title": "Paronimia: Palabras con Significante Parecido pero Significados Distintos", "short": "Paronimia", "icon": "🪞", "kw": "parónimo"},
                    {"title": "Ambigüedades Léxicas y Doble Sentido en Textos Académicos", "short": "Ambigüedades Léxicas", "icon": "❓", "kw": "ambigüedad"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Precisión Léxica y Adecuación Semántica",
                "topics": [
                    {"title": "Principio de Precisión Semántica: Evitar Palabras Baúl ('Cosa', 'Hacer')", "short": "Precisión Léxica", "icon": "🎯", "kw": "precisión"},
                    {"title": "Adecuación Semántica: Elección del Término Exacto según el Registro", "short": "Adecuación Semántica", "icon": "📝", "kw": "adecuación"},
                    {"title": "Corrección de Imprecisiones Léxicas Frecuentes en el Habla Culta", "short": "Corrección Léxica", "icon": "✍️", "kw": "léxica"},
                    {"title": "Término Excluido: Identificación del Elemento Ajeno al Campo Semántico", "short": "Término Excluido", "icon": "❌", "kw": "excluido"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Analogías Verbales",
                "topics": [
                    {"title": "Estructura de la Analogía: Par Base o Premisa y Pares Opciones", "short": "Estructura de Analogías", "icon": "🔗", "kw": "analogía"},
                    {"title": "Relaciones Analógicas Notables: Parte-Todo, Causa-Efecto, Especie-Género", "short": "Relaciones Analógicas", "icon": "🧩", "kw": "relación"},
                    {"title": "Principios de Resolución: Relación (R), Orden (O) y Naturaleza (N)", "short": "Método R-O-N", "icon": "⚖️", "kw": "naturaleza"},
                    {"title": "Analogías Asimétricas y Paralelas en Exámenes de Admisión", "short": "Analogías Complejas", "icon": "📐", "kw": "paralelas"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Series Verbales y Clasificaciones",
                "topics": [
                    {"title": "Series Verbales: Continuación de Secuencias Léxicas por Campo Semántico", "short": "Series Verbales", "icon": "📑", "kw": "serie verbal"},
                    {"title": "Series Continuas, Alternas y Emparejadas: Detección del Patrón", "short": "Tipos de Series", "icon": "🔄", "kw": "secuencia"},
                    {"title": "Hiperonimia, Hiponimia y Cohiponimia en Relaciones de Conjunto", "short": "Hiperonimia e Hiponimia", "icon": "🌳", "kw": "hiperónimo"},
                    {"title": "Clasificaciones Semánticas Complejas en Preguntas CEPREUNSA", "short": "Clasificación Semántica", "icon": "📊", "kw": "clasificación"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Conectores Lógicos y Cohesión Textual",
                "topics": [
                    {"title": "Conectores Lógicos: Causa (Porque, Ya que) y Consecuencia (Por ende)", "short": "Causa y Consecuencia", "icon": "➡️", "kw": "conectores"},
                    {"title": "Conectores de Oposición o Contraste: Concesión (Aunque) y Adversación (Pero)", "short": "Contraste y Concesión", "icon": "🛑", "kw": "adversativo"},
                    {"title": "Conectores de Adición, Equivalencia, Orden y Evidencia", "short": "Adición y Orden", "icon": "➕", "kw": "adición"},
                    {"title": "Mecanismos de Cohesión: Anáfora, Catáfora, Elipsis y Sustitución Léxica", "short": "Mecanismos de Cohesión", "icon": "🪢", "kw": "anáfora"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Oraciones Incompletas y Coherencia Semántica",
                "topics": [
                    {"title": "Criterios de Resolución: Gramaticalidad (Concordancia de Género y Número)", "short": "Criterio Gramatical", "icon": "📐", "kw": "incompleta"},
                    {"title": "Criterio de Coherencia Contextual y Sentido Lógico del Enunciado", "short": "Coherencia Contextual", "icon": "🧩", "kw": "contexto"},
                    {"title": "Criterio de Precisión Léxica y Estilo Académico", "short": "Precisión en Enunciados", "icon": "✏️", "kw": "enunciados"},
                    {"title": "Estrategias de Rastro Verbal y Rastreo de Palabras Clave en la Oración", "short": "Rastreo de Claves", "icon": "🔍", "kw": "rastro verbal"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Comprensión Lectora I - Nivel Literal y Estructura",
                "topics": [
                    {"title": "Estructura del Texto: Tema General, Título y Campo Temático", "short": "Tema y Título", "icon": "📖", "kw": "tema"},
                    {"title": "La Idea Principal: Identificación de la Tesis Central del Autor", "short": "Idea Principal", "icon": "💡", "kw": "idea principal"},
                    {"title": "Ideas Secundarias: Argumentación, Ejemplificación y Contraste", "short": "Ideas Secundarias", "icon": "📑", "kw": "secundarias"},
                    {"title": "Tipología Textual según la Ubicación de la Idea Principal (Analizante, Sintetizante)", "short": "Texto Analizante/Sintetizante", "icon": "📊", "kw": "analizante"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Comprensión Lectora II - Nivel Inferencial y Crítico",
                "topics": [
                    {"title": "La Inferencia Textual: Deducción Lógica a partir de Premisas Explícitas", "short": "Inferencia Textual", "icon": "🔍", "kw": "inferencia"},
                    {"title": "Extrapolación Cognitiva: Situaciones Hipotéticas y Cambio de Condiciones", "short": "Extrapolación", "icon": "🌐", "kw": "extrapolación"},
                    {"title": "Intención del Autor, Tono del Texto (Irónico, Objetivo, Crítico) y Postura", "short": "Tono e Intención", "icon": "🎭", "kw": "tono"},
                    {"title": "Preguntas de Compatibilidad e Incompatibilidad con el Texto", "short": "Compatibilidad Textual", "icon": "✔️", "kw": "incompatible"}
                ]
            }
        ]
    },

    "Inglés": {
        "area": "General",
        "icon": "🇬🇧",
        "color": "#0284C7",
        "gradient": "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
        "desc": "Personal information, routines, past tenses, modal verbs, future plans and academic reading comprehension.",
        "asigBanco": "Inglés",
        "weeks": [
            {
                "sem": 1,
                "title": "Semana 1: Personal Information & Verb 'To Be'",
                "topics": [
                    {"title": "Subject Pronouns (I, you, he, she, it, we, they) and Possessives", "short": "Subject Pronouns", "icon": "👤", "kw": "pronouns"},
                    {"title": "Verb 'To Be': Affirmative, Negative and Interrogative Sentences", "short": "Verb To Be", "icon": "🇬🇧", "kw": "verb to be"},
                    {"title": "WH- Questions: What, Where, Who, When, Why and How in Context", "short": "WH- Questions", "icon": "❓", "kw": "questions"},
                    {"title": "Countries, Nationalities and Professional Occupations Vocabulary", "short": "Countries & Jobs", "icon": "🌍", "kw": "occupations"}
                ]
            },
            {
                "sem": 2,
                "title": "Semana 2: Demonstratives, Articles & Nouns",
                "topics": [
                    {"title": "Demonstrative Pronouns: This, That, These and Those", "short": "Demonstratives", "icon": "👉", "kw": "demonstratives"},
                    {"title": "Indefinite Articles (A / An) vs Definite Article (The)", "short": "Articles (A/An/The)", "icon": "📑", "kw": "articles"},
                    {"title": "Singular and Plural Nouns: Regular and Irregular Plurals", "short": "Plural Nouns", "icon": "👥", "kw": "plurals"},
                    {"title": "Classroom Objects, Colors and Everyday Life Vocabulary", "short": "Everyday Vocabulary", "icon": "🎒", "kw": "vocabulary"}
                ]
            },
            {
                "sem": 3,
                "title": "Semana 3: Simple Present Tense - Daily Routines",
                "topics": [
                    {"title": "Simple Present: Affirmative Rules for Third Person Singular (-s, -es, -ies)", "short": "Third Person Rules", "icon": "🕒", "kw": "present simple"},
                    {"title": "Auxiliary Verbs Do / Does in Negative and Question Forms", "short": "Auxiliaries Do/Does", "icon": "⚙️", "kw": "auxiliary"},
                    {"title": "Adverbs of Frequency: Always, Usually, Often, Sometimes, Never", "short": "Adverbs of Frequency", "icon": "📊", "kw": "frequency"},
                    {"title": "Telling Time, Days of the Week and Daily Routine Activities", "short": "Daily Routines", "icon": "⏰", "kw": "routine"}
                ]
            },
            {
                "sem": 4,
                "title": "Semana 4: Likes, Dislikes and Free Time",
                "topics": [
                    {"title": "Expressing Preferences: Like, Love, Enjoy, Dislike, Hate + -ing / Noun", "short": "Likes and Dislikes", "icon": "❤️", "kw": "preferences"},
                    {"title": "Sports and Hobbies: Play, Do and Go Collocations", "short": "Sports and Hobbies", "icon": "⚽", "kw": "hobbies"},
                    {"title": "Prepositions of Time: In, On, At (In July, On Monday, At 8:00)", "short": "Prepositions of Time", "icon": "📅", "kw": "prepositions time"},
                    {"title": "Modal Verb 'Can' for Ability, Permission and Possibility", "short": "Modal Verb Can", "icon": "💪", "kw": "can"}
                ]
            },
            {
                "sem": 5,
                "title": "Semana 5: Family Members & Physical Description",
                "topics": [
                    {"title": "Family Members Vocabulary and Genitive Case ('s for Possession)", "short": "Family and 's", "icon": "👨‍👩‍👧", "kw": "family"},
                    {"title": "Adjectives for Physical Appearance (Tall, Short, Slim, Curly Hair)", "short": "Physical Appearance", "icon": "👀", "kw": "appearance"},
                    {"title": "Personality Adjectives (Polite, Hardworking, Generous, Shy)", "short": "Personality Traits", "icon": "🧠", "kw": "personality"},
                    {"title": "Have Got / Has Got for Physical Characteristics and Possessions", "short": "Have Got / Has Got", "icon": "📦", "kw": "have got"}
                ]
            },
            {
                "sem": 6,
                "title": "Semana 6: Places in Town & Prepositions of Place",
                "topics": [
                    {"title": "City Places Vocabulary: Library, Hospital, Bank, Supermarket", "short": "Places in Town", "icon": "🏙️", "kw": "places"},
                    {"title": "There is / There are for Expressing Existence in Present", "short": "There is / There are", "icon": "📍", "kw": "there is"},
                    {"title": "Prepositions of Place: In, On, Under, Next to, Between, Opposite", "short": "Prepositions of Place", "icon": "🗺️", "kw": "prepositions place"},
                    {"title": "Giving and Asking for Directions (Turn left, Go straight on)", "short": "Giving Directions", "icon": "🧭", "kw": "directions"}
                ]
            },
            {
                "sem": 7,
                "title": "Semana 7: Simple Past Tense - Verb 'To Be' & Regular Verbs",
                "topics": [
                    {"title": "Past Tense of 'To Be': Was / Were in Affirmative, Negative and Questions", "short": "Was / Were", "icon": "⏳", "kw": "was were"},
                    {"title": "Past Time Expressions: Yesterday, Last Night, Two Days Ago", "short": "Past Expressions", "icon": "📆", "kw": "yesterday"},
                    {"title": "Regular Verbs in Simple Past: Spelling Rules for -ed Endings", "short": "Regular Verbs (-ed)", "icon": "📝", "kw": "regular verbs"},
                    {"title": "Pronunciation of -ed: /t/, /d/ and /ɪd/ Sound Distinctions", "short": "-ed Pronunciation", "icon": "🔊", "kw": "pronunciation"}
                ]
            },
            {
                "sem": 8,
                "title": "Semana 8: Irregular Past Verbs & Past Continuous",
                "topics": [
                    {"title": "Common Irregular Verbs in Simple Past (Went, Saw, Had, Bought)", "short": "Irregular Verbs", "icon": "⚡", "kw": "irregular verbs"},
                    {"title": "Did / Didn't in Negative Sentences and Questions in the Past", "short": "Did / Didn't Questions", "icon": "❓", "kw": "did"},
                    {"title": "Past Continuous Tense: Was / Were + Verb-ing for Ongoing Past Actions", "short": "Past Continuous", "icon": "🔄", "kw": "past continuous"},
                    {"title": "Connecting Clauses with 'When' and 'While' in Past Narratives", "short": "When and While", "icon": "🔗", "kw": "while"}
                ]
            },
            {
                "sem": 9,
                "title": "Semana 9: Future Forms & Modal Verbs",
                "topics": [
                    {"title": "Future with 'Be Going to' for Prior Plans and Intentions", "short": "Be Going to", "icon": "🎯", "kw": "going to"},
                    {"title": "Future with 'Will': Instant Decisions, Promises and Predictions", "short": "Future with Will", "icon": "🔮", "kw": "will"},
                    {"title": "First Conditional: If + Present Simple, Will + Verb for Real Possibility", "short": "First Conditional", "icon": "🔀", "kw": "conditional"},
                    {"title": "Modal Verbs: Should (Advice), Must (Obligation) and Have to", "short": "Modal Verbs", "icon": "⚖️", "kw": "should"}
                ]
            },
            {
                "sem": 10,
                "title": "Semana 10: Academic Reading Comprehension for UNSA Admission",
                "topics": [
                    {"title": "Skimming Techniques: Getting the Main Idea of an Academic Passage", "short": "Skimming Techniques", "icon": "🔍", "kw": "reading"},
                    {"title": "Scanning Techniques: Finding Specific Data, Dates and Facts", "short": "Scanning for Facts", "icon": "🎯", "kw": "scanning"},
                    {"title": "Context Clues: Deducing Unknown English Words in Pre-University Texts", "short": "Context Clues", "icon": "💡", "kw": "context clues"},
                    {"title": "UNSA Reading Test Strategy: Answering Multiple Choice Questions with Precision", "short": "UNSA Reading Strategy", "icon": "🏆", "kw": "comprehension"}
                ]
            }
        ]
    }
}
