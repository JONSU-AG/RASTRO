import sys
import os

# Read cepreunsa_syllabus_data.py
path = os.path.join('scripts', 'cepreunsa_syllabus_data.py')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. BIOLOGÍA:
# In Week 9, add Biotecnología y Bioética
old_bio_w9 = '''            {
                "sem": 9,
                "title": "Semana 9: Genética Mendeliana, Herencia Post-mendeliana y Cariotipo",
                "topics": [
                    {"title": "Leyes de Mendel: Ley de la Segregación y Distribución Independiente", "short": "Leyes de Mendel", "icon": "🌱", "kw": "mendel"},
                    {"title": "Herencia Post-mendeliana: Codominancia y Dominancia Incompleta", "short": "Codominancia", "icon": "🔀", "kw": "alelos"},
                    {"title": "Herencia Ligada al Sexo: Daltonismo, Hemofilia y Cromosoma X", "short": "Ligada al Sexo", "icon": "🧬", "kw": "daltonismo"},
                    {"title": "Anomalías Cromosómicas: Síndrome de Down, Turner y Klinefelter", "short": "Mutaciones y Síndromes", "icon": "📊", "kw": "cromosoma"}
                ]
            },'''

new_bio_w9 = '''            {
                "sem": 9,
                "title": "Semana 9: Genética Mendeliana, Biotecnología y Bioética",
                "topics": [
                    {"title": "Leyes de Mendel: Ley de la Segregación y Distribución Independiente", "short": "Leyes de Mendel", "icon": "🌱", "kw": "mendel"},
                    {"title": "Herencia Post-mendeliana: Codominancia y Dominancia Incompleta", "short": "Codominancia", "icon": "🔀", "kw": "alelos"},
                    {"title": "Herencia Ligada al Sexo y Anomalías Cromosómicas (Down, Turner, Klinefelter)", "short": "Ligada al Sexo y Cariotipo", "icon": "🧬", "kw": "daltonismo"},
                    {"title": "Biotecnología y Bioética: ADN Recombinante, Transgénicos, Clonación y CRISPR", "short": "Biotecnología y Bioética", "icon": "🧪", "kw": "biotecnología"}
                ]
            },'''

# In Week 10, add Ecorregiones de Antonio Brack Egg y ODS
old_bio_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Ecología, Ecosistemas y Conservación Ambiental",
                "topics": [
                    {"title": "Ecosistemas: Factores Bióticos, Abióticos, Hábitat y Nicho Ecológico", "short": "Ecosistemas y Nicho", "icon": "🌲", "kw": "ecosistema"},
                    {"title": "Dinámica Trófica: Productores, Consumidores y Pirámides de Biomasa", "short": "Redes Tróficas", "icon": "🦊", "kw": "trófica"},
                    {"title": "Relaciones Interespecíficas: Mutualismo, Comensalismo y Parasitismo", "short": "Relaciones Bióticas", "icon": "🤝", "kw": "parasitismo"},
                    {"title": "Impacto Ambiental, Contaminación y Áreas Naturales Protegidas (ANP)", "short": "Conservación y ANP", "icon": "🛡️", "kw": "conservación"}
                ]
            }'''

new_bio_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Ecología, Ecorregiones, Sostenibilidad y ODS",
                "topics": [
                    {"title": "Ecosistemas: Factores Bióticos, Abióticos, Hábitat y Nicho Ecológico", "short": "Ecosistemas y Nicho", "icon": "🌲", "kw": "ecosistema"},
                    {"title": "Dinámica Trófica y Relaciones Bióticas (Mutualismo, Parasitismo)", "short": "Redes Tróficas", "icon": "🦊", "kw": "trófica"},
                    {"title": "Las 11 Ecorregiones del Perú (Brack Egg) y Áreas Naturales Protegidas (ANP)", "short": "Ecorregiones y ANP", "icon": "🇵🇪", "kw": "ecorregiones"},
                    {"title": "Impacto Ambiental, Cambio Climático, Sostenibilidad y Objetivos de Desarrollo Sostenible (ODS)", "short": "Sostenibilidad y ODS", "icon": "🌍", "kw": "sostenibilidad"}
                ]
            }'''

# 2. FÍSICA:
# In Week 10, add Magnetismo e Inducción Electromagnética
old_fis_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Electrocinética - Circuitos Eléctricos y Ley de Ohm",
                "topics": [
                    {"title": "Corriente Eléctrica, Intensidad y Ley de Resistencia de Pouillet", "short": "Corriente y Pouillet", "icon": "⚡", "kw": "corriente"},
                    {"title": "Ley de Ohm (V = I · R) y Circuitos con Resistencias en Serie y Paralelo", "short": "Ley de Ohm y Circuitos", "icon": "💡", "kw": "resistencia"},
                    {"title": "Efecto Joule, Potencia Eléctrica y Energía Disipada en Circuitos", "short": "Efecto Joule", "icon": "🔥", "kw": "joule"},
                    {"title": "Leyes de Kirchhoff: Regla de Nudos y Regla de Mallas Eléctricas", "short": "Leyes de Kirchhoff", "icon": "🔀", "kw": "kirchhoff"}
                ]
            }'''

new_fis_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Electrocinética, Magnetismo e Inducción Electromagnética",
                "topics": [
                    {"title": "Corriente Eléctrica, Intensidad y Ley de Ohm (V = I · R) en Circuitos", "short": "Corriente y Ley de Ohm", "icon": "⚡", "kw": "corriente"},
                    {"title": "Leyes de Kirchhoff: Regla de Nudos y Regla de Mallas Eléctricas", "short": "Leyes de Kirchhoff", "icon": "🔀", "kw": "kirchhoff"},
                    {"title": "Magnetismo: Campo Magnético (B), Fuerza Magnética de Lorentz y Regla de la Palma Derecha", "short": "Campo Magnético y Lorentz", "icon": "🧲", "kw": "magnetismo"},
                    {"title": "Inducción Electromagnética: Flujo Magnético, Ley de Faraday y Ley de Lenz", "short": "Inducción y Faraday-Lenz", "icon": "🔄", "kw": "inducción"}
                ]
            }'''

# 3. QUÍMICA:
# In Week 10, add Funciones Oxigenadas y Nitrogenadas
old_qui_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Gases Ideales, Soluciones y Química del Carbono",
                "topics": [
                    {"title": "Gases Ideales: Ecuación Universal (P·V = n·R·T) y Leyes de Gases", "short": "Gases Ideales", "icon": "🎈", "kw": "gases"},
                    {"title": "Soluciones Químicas: Porcentaje en Masa, Volumen y Molaridad (M)", "short": "Soluciones y Molaridad", "icon": "☕", "kw": "molaridad"},
                    {"title": "Propiedades del Átomo de Carbono: Tetravalencia, Autosaturación e Hibridación", "short": "Átomo de Carbono", "icon": "⚫", "kw": "carbono"},
                    {"title": "Hidrocarburos Alifáticos: Alcanos, Alquenos, Alquinos y Nomenclatura", "short": "Alcanos y Alquenos", "icon": "⛽", "kw": "alcanos"}
                ]
            }'''

new_qui_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Estado Gaseoso, Soluciones, Hidrocarburos y Funciones Orgánicas",
                "topics": [
                    {"title": "Estado Gaseoso: Ecuación Universal de Gases Ideales (P·V = n·R·T) y Leyes de Boyle/Charles", "short": "Gases Ideales (PV=nRT)", "icon": "🎈", "kw": "gaseoso"},
                    {"title": "Soluciones Químicas: Unidades Físicas (% m/m, % v/v) y Químicas (Molaridad M y Normalidad N)", "short": "Soluciones y Molaridad", "icon": "☕", "kw": "soluciones"},
                    {"title": "Química del Carbono e Hidrocarburos: Tetravalencia, Alcanos, Alquenos, Alquinos y Benceno", "short": "Hidrocarburos Alifáticos", "icon": "⛽", "kw": "hidrocarburos"},
                    {"title": "Funciones Químicas Oxigenadas (Alcoholes, Cetonas, Ácidos) y Nitrogenadas (Aminas, Amidas)", "short": "Funciones Oxigenadas y Nitrogenadas", "icon": "🧪", "kw": "oxigenadas"}
                ]
            }'''

# 4. FILOSOFÍA:
# In Week 8 add Epistemología y Filosofía de la Ciencia (Popper, Kuhn, Feyerabend)
old_fil_w8 = '''            {
                "sem": 8,
                "title": "Semana 8: Disciplinas Filosóficas - Gnoseología y Epistemología",
                "topics": [
                    {"title": "Gnoseología: El Problema de la Posibilidad del Conocimiento (Dogmatismo, Escepticismo)", "short": "Escepticismo y Dogmatismo", "icon": "🧩", "kw": "gnoseología"},
                    {"title": "El Origen del Conocimiento: Racionalismo, Empirismo y Apriorismo", "short": "Origen del Conocimiento", "icon": "🌱", "kw": "apriorismo"},
                    {"title": "Teorías de la Verdad: Correspondencia (Aristóteles), Coherencia y Pragmática", "short": "Teorías de la Verdad", "icon": "✔️", "kw": "verdad"},
                    {"title": "Epistemología: Karl Popper (Falsacionismo) y Thomas Kuhn (Paradigmas Científicos)", "short": "Popper y Kuhn", "icon": "🔬", "kw": "popper"}
                ]
            },'''

new_fil_w8 = '''            {
                "sem": 8,
                "title": "Semana 8: Gnoseología, Epistemología y Filosofía de la Ciencia",
                "topics": [
                    {"title": "Gnoseología: Posibilidad del Conocimiento (Dogmatismo, Escepticismo, Criticismo)", "short": "Gnoseología y Verdad", "icon": "🧩", "kw": "gnoseología"},
                    {"title": "El Origen y Naturaleza del Conocimiento: Racionalismo, Empirismo y Apriorismo", "short": "Origen del Conocimiento", "icon": "🌱", "kw": "apriorismo"},
                    {"title": "Epistemología y Filosofía de la Ciencia: El Método Científico y Problema de la Demarcación", "short": "Filosofía de la Ciencia", "icon": "🔬", "kw": "ciencia"},
                    {"title": "Teorías Científicas Contemporáneas: Popper (Falsacionismo), Kuhn (Paradigmas) y Feyerabend", "short": "Popper, Kuhn y Paradigmas", "icon": "💡", "kw": "popper"}
                ]
            },'''

# In Week 9 add Filosofía Política
old_fil_w9 = '''            {
                "sem": 9,
                "title": "Semana 9: Axiología y Ética",
                "topics": [
                    {"title": "Axiología: Naturaleza del Valor y Características (Polaridad y Jerarquía)", "short": "Teoría de los Valores", "icon": "💎", "kw": "valor"},
                    {"title": "Posturas Axiológicas: Subjetivismo (Hedonismo) vs Objetivismo (Scheler)", "short": "Subjetivismo vs Objetivismo", "icon": "⚖️", "kw": "axiológico"},
                    {"title": "Ética: Moral, Norma Moral, Acto Moral y la Persona Moral", "short": "Moral y Ética", "icon": "🕊️", "kw": "moral"},
                    {"title": "Doctrinas Éticas: Eudemonismo (Aristóteles), Deontología (Kant) y Utilitarismo", "short": "Deontología y Utilitarismo", "icon": "🏛️", "kw": "ética"}
                ]
            },'''

new_fil_w9 = '''            {
                "sem": 9,
                "title": "Semana 9: Axiología, Ética y Filosofía Política",
                "topics": [
                    {"title": "Axiología: Naturaleza del Valor, Polaridad, Jerarquía y Posturas (Subjetivismo vs Objetivismo)", "short": "Teoría de los Valores", "icon": "💎", "kw": "valor"},
                    {"title": "Ética: Moral, Acto Moral y Doctrinas Éticas (Eudemonismo, Deontología Kantiana, Utilitarismo)", "short": "Ética y Deontología", "icon": "🕊️", "kw": "moral"},
                    {"title": "Filosofía Política: Origen del Estado, Poder Político, Soberanía y el Contrato Social (Hobbes, Locke, Rousseau)", "short": "Filosofía Política y Estado", "icon": "⚖️", "kw": "política"},
                    {"title": "Justicia y Democracia: Karl Marx (Crítica del Estado) y John Rawls (Teoría de la Justicia)", "short": "Justicia y Democracia", "icon": "🏛️", "kw": "justicia"}
                ]
            },'''

# 5. PSICOLOGÍA:
# In Week 2 add Hábitos de Estudio
old_psi_w2 = '''            {
                "sem": 2,
                "title": "Semana 2: Proyecto de Vida y Orientación Vocacional",
                "topics": [
                    {"title": "El Proyecto de Vida Individual: Importancia, Metas y Valores", "short": "Proyecto de Vida", "icon": "🎯", "kw": "proyecto de vida"},
                    {"title": "Análisis FODA Personal: Fortalezas, Oportunidades, Debilidades y Amenazas", "short": "Análisis FODA", "icon": "📊", "kw": "foda"},
                    {"title": "Orientación Vocacional: Aptitudes, Intereses Vocacionales y Personalidad", "short": "Orientación Vocacional", "icon": "🧭", "kw": "vocación"},
                    {"title": "Uso Eficiente del Tiempo y Estrategias de Estudio Preuniversitario", "short": "Estrategias de Estudio", "icon": "⏱️", "kw": "estudio"}
                ]
            },'''

new_psi_w2 = '''            {
                "sem": 2,
                "title": "Semana 2: Proyecto de Vida, Orientación Vocacional y Hábitos de Estudio",
                "topics": [
                    {"title": "El Proyecto de Vida Individual: Metas SMART, Misión, Visión y FODA Personal", "short": "Proyecto de Vida y FODA", "icon": "🎯", "kw": "proyecto de vida"},
                    {"title": "Orientación Vocacional: Elección Profesional, Aptitudes e Intereses Vocacionales", "short": "Orientación Vocacional", "icon": "🧭", "kw": "vocación"},
                    {"title": "Hábitos de Estudio, Estilos de Aprendizaje y Metacognición en la Preparación", "short": "Hábitos de Estudio", "icon": "📚", "kw": "hábitos de estudio"},
                    {"title": "Gestión del Tiempo, Técnica Pomodoro y Curva del Olvido (Hermann Ebbinghaus)", "short": "Gestión del Tiempo", "icon": "⏱️", "kw": "tiempo"}
                ]
            },'''

# In Week 7 add Sexualidad Humana
old_psi_w7 = '''            {
                "sem": 7,
                "title": "Semana 7: Procesos Afectivos - Emociones y Sentimientos",
                "topics": [
                    {"title": "La Afectividad Humana: Características (Intensidad, Polaridad, Nivel)", "short": "Afectividad Humana", "icon": "❤️", "kw": "afectividad"},
                    {"title": "Emociones Básicas y Secundarias: Componentes Fisiológicos y Expresivos", "short": "Emociones", "icon": "😊", "kw": "emociones"},
                    {"title": "Sentimientos y Pasiones: Diferencias, Tipos y Manejo Afectivo", "short": "Sentimientos y Pasiones", "icon": "🎭", "kw": "sentimientos"},
                    {"title": "Estrés, Manejo de la Ansiedad y Resiliencia en Situaciones de Examen", "short": "Estrés y Resiliencia", "icon": "🛡️", "kw": "estrés"}
                ]
            },'''

new_psi_w7 = '''            {
                "sem": 7,
                "title": "Semana 7: Afectividad, Emociones y Sexualidad Humana Responsable",
                "topics": [
                    {"title": "La Afectividad Humana: Emociones Básicas, Sentimientos y Pasiones", "short": "Afectividad y Emociones", "icon": "❤️", "kw": "afectividad"},
                    {"title": "Manejo del Estrés, Ansiedad Preuniversitaria y Resiliencia", "short": "Estrés y Resiliencia", "icon": "🛡️", "kw": "estrés"},
                    {"title": "Sexualidad Humana: Dimensiones Biológica, Psicológica y Sociocultural", "short": "Sexualidad Humana", "icon": "✨", "kw": "sexualidad"},
                    {"title": "Salud Sexual y Reproductiva, Afectividad en Pareja y Prevención de ITS", "short": "Salud Sexual y Pareja", "icon": "🤝", "kw": "reproductiva"}
                ]
            },'''

# In Week 10 add Factores de Protección y Conductas de Riesgo
old_psi_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Personalidad y Trastornos de la Personalidad",
                "topics": [
                    {"title": "La Personalidad: Definición, Factores y Componentes (Temperamento y Carácter)", "short": "Personalidad y Factores", "icon": "🪞", "kw": "personalidad"},
                    {"title": "Teorías Tipológicas (Kretschmer, Jung) y Teoría de Rasgos (Allport, Cattell)", "short": "Tipologías de Personalidad", "icon": "📊", "kw": "rasgos"},
                    {"title": "Teoría Psicoanalítica de Sigmund Freud: El Ello, Yo y Superyó", "short": "Psicoanálisis (Freud)", "icon": "🛋️", "kw": "freud"},
                    {"title": "Mecanismos de Defensa del Yo y Trastornos de la Personalidad", "short": "Mecanismos de Defensa", "icon": "🛡️", "kw": "mecanismos de defensa"}
                ]
            }'''

new_psi_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Personalidad, Factores de Protección y Conductas de Riesgo",
                "topics": [
                    {"title": "La Personalidad: Estructura, Temperamento, Carácter y Teoría Psicoanalítica (Freud)", "short": "Personalidad y Psicoanálisis", "icon": "🪞", "kw": "personalidad"},
                    {"title": "Teorías de la Personalidad: Rasgos (Allport, Cattell) y Mecanismos de Defensa del Yo", "short": "Teorías de la Personalidad", "icon": "📊", "kw": "mecanismos de defensa"},
                    {"title": "Factores de Protección: Autoestima, Habilidades Sociales, Asertividad y Redes de Apoyo", "short": "Factores de Protección", "icon": "🛡️", "kw": "autoestima"},
                    {"title": "Conductas de Riesgo en Adolescentes: Adicciones, Trastornos de Conducta Alimentaria (TCA) y Depresión", "short": "Conductas de Riesgo", "icon": "⚠️", "kw": "adicciones"}
                ]
            }'''

# 6. LITERATURA:
# In Week 4 add Franz Kafka (La metamorfosis) y Jorge Luis Borges (Ficciones)
old_lit_w4 = '''            {
                "sem": 4,
                "title": "Semana 4: Literatura Medieval y Renacentista Europea",
                "topics": [
                    {"title": "Cantar de Gesta Medieval: Cantar de Mío Cid (Estructura y Honor)", "short": "Cantar de Mío Cid", "icon": "🛡️", "kw": "mio cid"},
                    {"title": "Dante Alighieri y la Divina Comedia: Infierno, Purgatorio y Paraíso", "short": "Divina Comedia (Dante)", "icon": "🔥", "kw": "dante"},
                    {"title": "El Renacimiento Inglés: William Shakespeare y el Teatro Isabelino", "short": "William Shakespeare", "icon": "🎭", "kw": "shakespeare"},
                    {"title": "Tragedias Shakespearianas: Hamlet (La Duda) y Romeo y Julieta", "short": "Hamlet y Tragedias", "icon": "💀", "kw": "hamlet"}
                ]
            },'''

new_lit_w4 = '''            {
                "sem": 4,
                "title": "Semana 4: Narrativa Universal Moderna - Kafka, Borges y Vanguardia",
                "topics": [
                    {"title": "Dante Alighieri y la Divina Comedia / Cantar de Mío Cid: Épica Medieval", "short": "Divina Comedia y Mío Cid", "icon": "🔥", "kw": "dante"},
                    {"title": "William Shakespeare: El Teatro Isabelino, 'Hamlet' y la Condición Humana", "short": "Shakespeare y Hamlet", "icon": "💀", "kw": "shakespeare"},
                    {"title": "Franz Kafka: 'La Metamorfosis' - Gregorio Samsa, Alienación y Absurdo", "short": "La Metamorfosis (Kafka)", "icon": "🪲", "kw": "metamorfosis"},
                    {"title": "Jorge Luis Borges: 'Ficciones' y 'El Aleph' - Laberintos, Tiempo y Fantasía", "short": "Borges (Ficciones)", "icon": "🌀", "kw": "borges"}
                ]
            },'''

# In Week 8 add Clorinda Matto de Turner (Aves sin nido)
old_lit_w8 = '''            {
                "sem": 8,
                "title": "Semana 8: Literatura Peruana Republicana - Costumbrismo y Romanticismo",
                "topics": [
                    {"title": "Costumbrismo Peruano: Criollismo (Manuel Ascencio Segura) vs Anticriollismo", "short": "Costumbrismo Peruano", "icon": "🎭", "kw": "costumbrismo"},
                    {"title": "Teatro Costumbrista: 'Ña Catita' de Manuel Ascencio Segura", "short": "Ña Catita (Segura)", "icon": "👵", "kw": "ña catita"},
                    {"title": "Romanticismo Peruano: Contexto del Guano y Tradiciones de Ricardo Palma", "short": "Ricardo Palma", "icon": "📚", "kw": "ricardo palma"},
                    {"title": "Tradiciones Peruanas: Estructura, Ironía e Historia Costumbrista", "short": "Tradiciones Peruanas", "icon": "✍️", "kw": "tradiciones peruanas"}
                ]
            },'''

new_lit_w8 = '''            {
                "sem": 8,
                "title": "Semana 8: Costumbrismo, Tradiciones y Realismo Peruano",
                "topics": [
                    {"title": "Costumbrismo Peruano y Teatro: 'Ña Catita' de Manuel Ascencio Segura", "short": "Ña Catita (Segura)", "icon": "👵", "kw": "ña catita"},
                    {"title": "Romanticismo Peruano: Ricardo Palma y las 'Tradiciones Peruanas'", "short": "Tradiciones Peruanas", "icon": "📚", "kw": "ricardo palma"},
                    {"title": "Realismo Peruano Post-Guerra: Manuel González Prada ('Discurso en el Politeama')", "short": "González Prada (Politeama)", "icon": "📢", "kw": "gonzález prada"},
                    {"title": "Novela Indigenista Pionera: 'Aves sin nido' de Clorinda Matto de Turner", "short": "Aves sin nido (Matto de Turner)", "icon": "🕊️", "kw": "aves sin nido"}
                ]
            },'''

# In Week 10 add Mario Vargas Llosa (La ciudad y los perros) y Oswaldo Reynoso (Los inocentes)
old_lit_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Vanguardismo e Indigenismo Peruano",
                "topics": [
                    {"title": "César Vallejo: Etapa Modernista ('Los Heraldos Negros') y Poética Humana", "short": "Heraldos Negros", "icon": "✒️", "kw": "heraldos negros"},
                    {"title": "César Vallejo: Etapa Vanguardista ('Trilce') y Social ('Poemas Humanos')", "short": "Trilce y Poemas Humanos", "icon": "📜", "kw": "trilce"},
                    {"title": "Indigenismo Peruano: Ciro Alegría ('El Mundo es Ancho y Ajeno')", "short": "Ciro Alegría", "icon": "🏔️", "kw": "ciro alegría"},
                    {"title": "José María Arguedas: 'Los Ríos Profundos' y el Encuentro de Dos Mundos", "short": "Arguedas y Ríos Profundos", "icon": "🌊", "kw": "arguedas"}
                ]
            }'''

new_lit_w10 = '''            {
                "sem": 10,
                "title": "Semana 10: Indigenismo, Narrativa Contemporánea y Boom",
                "topics": [
                    {"title": "José María Arguedas: 'Los Ríos Profundos', 'Yawar Fiesta' y el Neoindigenismo", "short": "Arguedas (Ríos Profundos)", "icon": "🌊", "kw": "arguedas"},
                    {"title": "Ciro Alegría: 'El Mundo es Ancho y Ajeno' y la Comunidad Indígena", "short": "Ciro Alegría", "icon": "🏔️", "kw": "ciro alegría"},
                    {"title": "Mario Vargas Llosa: 'La Ciudad y los Perros' y las Técnicas Narrativas del Boom", "short": "Vargas Llosa (Ciudad y Perros)", "icon": "🐕", "kw": "vargas llosa"},
                    {"title": "Oswaldo Reynoso: 'Los Inocentes' (Lima en Rock) y la Narrativa Juvenil Urbana", "short": "Reynoso (Los Inocentes)", "icon": "🎸", "kw": "reynoso"}
                ]
            }'''

# Replace all occurrences
replacements = [
    (old_bio_w9, new_bio_w9),
    (old_bio_w10, new_bio_w10),
    (old_fis_w10, new_fis_w10),
    (old_qui_w10, new_qui_w10),
    (old_fil_w8, new_fil_w8),
    (old_fil_w9, new_fil_w9),
    (old_psi_w2, new_psi_w2),
    (old_psi_w7, new_psi_w7),
    (old_psi_w10, new_psi_w10),
    (old_lit_w4, new_lit_w4),
    (old_lit_w8, new_lit_w8),
    (old_lit_w10, new_lit_w10),
]

success = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        success += 1
    else:
        print("Warning: could not find snippet in content!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Applied {success} of {len(replacements)} curriculum expansions successfully!")
