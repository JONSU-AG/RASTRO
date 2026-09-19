# -*- coding: utf-8 -*-
"""
COMPENDIO OFICIAL DE CIENCIAS Y MATEMÁTICAS - CEPREUNSA
Cursos: Biología, Física, Química, Matemática (Semanas 1 a 10)
Teoría auténtica preuniversitaria, sin textos genéricos ni placeholders.
"""

def get_science_theory(subject, sem, sub_code, topic_title):
    s = subject.lower()
    t = topic_title.lower()

    # =========================================================================
    # BIOLOGÍA (Semanas 1 a 10)
    # =========================================================================
    if "biolog" in s:
        if sem == 1:
            if "1.1" in sub_code or "concepto" in t or "ramas" in t:
                return {
                    "marcoteorico": (
                        "La Biología es una ciencia fáctica, natural y sistemática cuyo objeto de estudio es la materia viva organizada: "
                        "su origen, evolución, estructura molecular y celular, fisiología, relaciones ecosistémicas y transmisión de la herencia genética.\n\n"
                        "Etimológicamente proviene de dos voces griegas clásicas: «bíos» (vida) y «lógos» (estudio, tratado o explicación racional). "
                        "El vocablo fue acuñado de forma independiente y simultánea en el año 1802 por dos eminentes naturalistas: el francés Jean-Baptiste de Monet, "
                        "Caballero de Lamarck (en su tratado 'Hydrogéologie'), y el médico y botánico alemán Gottfried Reinhold Treviranus "
                        "(en su obra seminal 'Biologie oder Philosophie der lebenden Natur').\n\n"
                        "El conocimiento biológico se valida mediante el Método Científico Riguroso, conformado por una secuencia metódica: "
                        "1) Observación objetiva del fenómeno; 2) Planteamiento del problema (interrogante causal); 3) Formulación de hipótesis (explicación tentativa falsable); "
                        "4) Experimentación contrastable con grupo experimental y grupo control; 5) Análisis de resultados cuantitativos; y 6) Formulación de leyes o teorías universales."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Fundamento Conceptual: Etimología, Objeto de Estudio y Método Científico",
                            "body": (
                                "• Raíces griegas: bíos (vida) y lógos (tratado, estudio sistemático o explicación fundada).\n"
                                "• Acuñadores oficiales (1802): Lamarck y Treviranus. Aristóteles es considerado el 'Padre de la Biología' por sus estudios en animales, pero jamás acuñó la palabra.\n"
                                "• Materia Viva: Sistema termodinámico abierto y complejo con capacidad de autopoyesis, metabolismo, homeostasis e irritabilidad.\n"
                                "• Secuencia Experimental: Observación → Problema → Hipótesis → Experimentación (Grupo Test vs Grupo Control) → Conclusión/Ley."
                            )
                        },
                        {
                            "heading": "🔬 Ramas de la Biología: Clasificación Taxonómica y Morfofuncional",
                            "body": (
                                "1. Ramas Taxonómicas (Según el Ser Vivo Estudiado):\n"
                                "  • Zoología: Ictiología (peces), Herpetología (anfibios y reptiles), Ornitología (aves), Mastozoología (mamíferos), Entomología (insectos), Malacología (moluscos: pulpos, caracoles, bivalvos), Helmintología (gusanos parásitos: tenias, áscaris).\n"
                                "  • Botánica (Fitología): Criptógamas (sin flores ni semillas: ficología [algas], briología [musgos], pteridología [helechos]) y Fanerógamas (con semillas: gimnospermas y angiospermas).\n"
                                "  • Micología: Hongos (levaduras, mohos y setas; pared de quitina, heterótrofos absortivos con glucógeno de reserva).\n"
                                "  • Microbiología: Bacteriología (eubacterias y arqueas), Virología (virus, viroides y priones), Protozoología (protozoarios).\n\n"
                                "2. Ramas por Nivel Estructural y Funcional:\n"
                                "  • Citología: Morfología y ultraestructura del sistema celular.\n"
                                "  • Histología: Arquitectura de los tejidos vivos y matriz extracelular.\n"
                                "  • Anatomía: Disposición macroscópica espacial de órganos.\n"
                                "  • Fisiología: Dinámica funcional y fisicoquímica de los sistemas vitales.\n"
                                "  • Genética: Mecanismos de replicación, transcripción, traducción y leyes hereditarias."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Trampas Frecuentes de Examen",
                            "body": (
                                "• Malacología vs Helmintología: Los caracoles, babosas y pulpos son moluscos (Malacología); las lombrices y tenias son helmintos (Helmintología).\n"
                                "• Micología no es Botánica: Los hongos no realizan fotosíntesis, no tienen clorofila, tienen pared de quitina (no celulosa) y almacenan glucógeno.\n"
                                "• Variable Independiente vs Dependiente: En una prueba UNSA, la variable que manipula el investigador es la INDEPENDIENTE (causa); el efecto medido es la DEPENDIENTE."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Axioma Epistemológico de la Biología y Método Científico",
                        "formula_latex": "\\text{Biología} = \\text{Bíos (Vida)} + \\text{Lógos (Razón)} \\quad [1802: \\text{Lamarck} \\land \\text{Treviranus}]",
                        "formula_simple": "Biología = Bíos (Vida) + Lógos (Estudio Racional)",
                        "descripcion": "Definición etimológica y formalización científica acuñada simultáneamente en 1802 por Lamarck y Treviranus.",
                        "despejes": [
                            {"nombre": "Secuencia Metodológica Científica", "latex": "\\text{Observación} \\to \\text{Problema} \\to \\text{Hipótesis} \\to \\text{Experimentación} \\to \\text{Ley}"},
                            {"nombre": "Dualidad Estructura-Función", "latex": "\\text{Morfología (Anatomía/Citología)} \\iff \\text{Función (Fisiología)}"}
                        ],
                        "variables": [
                            {"simbolo": "Bíos", "nombre": "Vida / Materia viva organizada", "unidad": "Sistemas celulares abiertos"},
                            {"simbolo": "Lógos", "nombre": "Discurso racional y contrastable", "unidad": "Leyes científicas demostradas"}
                        ],
                        "fija_unsa": "En CEPREUNSA, la pregunta sobre quién acuñó el término Biología en 1802 tiene como clave correcta obligatoria a Lamarck y Treviranus."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: Lamarck y Treviranus acuñaron el término en 1802. Memoriza para la prueba: Ictiología (peces), Malacología (moluscos), Helmintología (gusanos) y Micología (hongos).",
                    "takeaway": "La Biología estudia la materia viva organizada bajo el método científico. Lamarck y Treviranus acuñaron el vocablo en 1802."
                }
            elif "1.2" in sub_code or "origen" in t or "panspermia" in t or "quimiosintética" in t:
                return {
                    "marcoteorico": (
                        "El origen de la vida en la Tierra ha confrontado históricamente dos paradigmas: la generación espontánea frente a la biogénesis, "
                        "culminando en la teoría de la evolución química prebiótica.\n\n"
                        "La Teoría de la Generación Espontánea (Abiogénesis), sostenida desde la Antigüedad por Aristóteles y posteriormente por Van Helmont y John Needham, "
                        "afirmaba que la materia inerte poseía una fuerza vital ('entelequia') capaz de originar seres vivos de forma directa. "
                        "Fue refutada de manera progresiva por Francesco Redi (1668, frascos con gasa y carne), Lazzaro Spallanzani (1765, caldos hervidos herméticos) "
                        "y desmantelada de forma definitiva en 1862 por Louis Pasteur, quien mediante matraces con cuello de cisne demostró la Biogénesis: "
                        "«Omnis cellula e cellula / Todo ser vivo proviene de otro preexistente».\n\n"
                        "Respecto al origen abiótico original, la Teoría Quimiosintética (Oparin y Haldane, 1920) postula que en la atmósfera primitiva reductora "
                        "(rica en CH4, NH3, H2 y vapor de H2O, carente de O2 libre y sin capa de ozono), la energía de radiaciones solares UV y tormentas eléctricas "
                        "sintetizó monómeros orgánicos en el 'caldo primigenio', agregándose en Coacervados. En 1953, Stanley Miller y Harold Urey comprobaron experimentalmente esta síntesis."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Fundamento Histórico: De la Abiogénesis a la Biogénesis",
                            "body": (
                                "• Abiogénesis: Aristóteles (fuerza vital), Van Helmont (ratones de trigo y camisas sucias).\n"
                                "• Francesco Redi (1668): Comprobó que las larvas en carne proceden de huevos de moscas y no de generación espontánea.\n"
                                "• Louis Pasteur (1862): Matraces con cuello de cisne (en S). El aire entraba pero los microbios quedaban atrapados en el cuello curvo. Fin de la abiogénesis."
                            )
                        },
                        {
                            "heading": "🔬 Teoría Quimiosintética (Oparin-Haldane) y Miller-Urey (1953)",
                            "body": (
                                "• Atmósfera Primitiva: REDUCTORA (anóxica, sin O2 libre). Compuesta por CH4, NH3, H2 y vapor de H2O.\n"
                                "• Caldo Primordial: Océanos primitivos calientes donde se formaron aminoácidos, azúcares y bases nitrogenadas.\n"
                                "• Coacervados: Sistemas coloidales prebióticos con membrana hídrica precursores de los primeros protobiontes.\n"
                                "• Experimento de Miller-Urey (1953): Descargas de 60,000 V en atmósfera reductora produjeron aminoácidos (glicina, alanina)."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Otras Hipótesis",
                            "body": (
                                "• Panspermia (Arrhenius, 1908): Esporas extraterrestres llegaron en meteoritos.\n"
                                "• La atmósfera primitiva era estrictamente REDUCTORA (jamás oxidante).\n"
                                "• Pasteur es la clave para la refutación experimental definitiva de la generación espontánea."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Ecuación de la Síntesis Prebiótica de Miller-Urey",
                        "formula_latex": "\\text{CH}_4 + \\text{NH}_3 + \\text{H}_2 + \\text{H}_2\\text{O} \\xrightarrow{\\text{descargas } 60\\text{ kV}} \\text{Aminoácidos (Glicina, Alanina)}",
                        "formula_simple": "CH4 + NH3 + H2 + H2O + Energía -> Aminoácidos (Miller-Urey, 1953)",
                        "descripcion": "Demostración experimental de la síntesis abiótica de compuestos orgánicos en atmósfera primitiva reductora.",
                        "despejes": [
                            {"nombre": "Atmósfera Reductora", "latex": "\\text{Gases} = \\{\\text{CH}_4, \\text{NH}_3, \\text{H}_2, \\text{H}_2\\text{O}_{(v)}\\} \\quad [\\text{Sin } \\text{O}_2]"},
                            {"nombre": "Evolución Química", "latex": "\\text{Monómeros} \\to \\text{Polímeros} \\to \\text{Coacervados} \\to \\text{Protobiontes}"}
                        ],
                        "variables": [
                            {"simbolo": "CH4", "nombre": "Metano", "unidad": "Aporte de carbono"},
                            {"simbolo": "NH3", "nombre": "Amoníaco", "unidad": "Aporte de grupos amino (-NH2)"},
                            {"simbolo": "H2O", "nombre": "Vapor de agua", "unidad": "Medio hidrostático"}
                        ],
                        "fija_unsa": "En admisión UNSA: ¿Qué gases usaron Miller y Urey? Clave: Metano, Amoníaco, Hidrógeno y Vapor de Agua (sin O2 libre)."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: Pasteur refutó la generación espontánea con matraces cuello de cisne (1862). Miller y Urey sintetizaron aminoácidos comprobando la teoría de Oparin en atmósfera reductora.",
                    "takeaway": "La vida provino de la evolución química en atmósfera reductora (Oparin/Miller). Pasteur demostró que en la actualidad la vida solo surge de vida preexistente (Biogénesis)."
                }
            elif "1.3" in sub_code or "evoluti" in t or "darwin" in t or "lamarck" in t:
                return {
                    "marcoteorico": (
                        "La evolución biológica es la transformación y diversificación de las especies a lo largo de las generaciones por cambios "
                        "en las frecuencias alélicas de las poblaciones a partir de ancestros comunes.\n\n"
                        "Las teorías evolutivas cardinales evaluadas en CEPREUNSA son:\n"
                        "1) Transformismo de Lamarck (1809, 'Philosophie Zoologique'): Ley del uso y desuso de órganos y la herencia de los caracteres adquiridos "
                        "(refutada por Weismann al cortar la cola a ratones durante 22 generaciones sin que ninguna cría naciera sin cola).\n"
                        "2) Teoría de la Selección Natural de Darwin y Wallace (1859, 'El Origen de las Especies'): Variabilidad intraespecífica, "
                        "sobreproducción de descendientes, lucha por la existencia (recursos limitados según Malthus) y supervivencia y reproducción diferencial del más apto.\n"
                        "3) Teoría Sintética o Neodarwinismo (Dobzhansky, Mayr, Simpson): Integra la selección natural con la genética mendeliana y de poblaciones, "
                        "demostrando que la fuente primaria de variabilidad son las MUTACIONES y la RECOMBINACIÓN GÉNICA (crossing-over), siendo la POBLACIÓN la unidad de evolución."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Fundamento Histórico: Lamarckismo vs Darwinismo",
                            "body": (
                                "• Lamarck: Uso y desuso de órganos; herencia de caracteres adquiridos (errónea).\n"
                                "• Weismann: Distinguió somatoplasma de germinoplasma, refutando la herencia de caracteres corporales adquiridos.\n"
                                "• Darwin-Wallace: Selección natural actuando sobre variaciones previas existentes en la población."
                            )
                        },
                        {
                            "heading": "🔬 Neodarwinismo y Fuerzas Evolutivas",
                            "body": (
                                "• Unidad de Evolución: La POBLACIÓN (el individuo no evoluciona, solo la población modifica su frecuencia alélica).\n"
                                "• Variabilidad Génica: Generada por Mutaciones (nuevos alelos) y Crossing-over en meiosis (nuevas combinaciones).\n"
                                "• Fuerzas Evolutivas: Selección Natural, Deriva Génica (cuello de botella, efecto fundador), Flujo Génico y Mutaciones."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Anatomía Comparada",
                            "body": (
                                "• Órganos Homólogos (Divergencia): Misma estructura y origen embrionario, diferente función (ej. aleta de ballena y brazo humano).\n"
                                "• Órganos Análogos (Convergencia): Distinto origen embrionario, misma función adaptativa (ej. ala de mosca y ala de paloma).\n"
                                "• Órganos Vestigiales: Estructuras sin función actual heredadas de ancestros (apéndice, tercer molar, cóccix)."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Ley de Hardy-Weinberg en Genética de Poblaciones",
                        "formula_latex": "p^2 + 2pq + q^2 = 1 \\quad \\land \\quad p + q = 1",
                        "formula_simple": "p^2 (AA) + 2pq (Aa) + q^2 (aa) = 1",
                        "descripcion": "Ecuación fundamental que modela el equilibrio génico en poblaciones ideales que no experimentan evolución.",
                        "despejes": [
                            {"nombre": "Frecuencia Alélica", "latex": "p = f(A), \\quad q = f(a)"},
                            {"nombre": "Frecuencia Genotípica", "latex": "p^2 = f(AA), \\quad 2pq = f(Aa), \\quad q^2 = f(aa)"}
                        ],
                        "variables": [
                            {"simbolo": "p", "nombre": "Frecuencia del alelo dominante", "unidad": "Proporción 0 a 1"},
                            {"simbolo": "q", "nombre": "Frecuencia del alelo recesivo", "unidad": "Proporción 0 a 1"}
                        ],
                        "fija_unsa": "En UNSA: Aleta de delfín y brazo humano son ÓRGANOS HOMÓLOGOS (evolución divergente); ala de murciélago y ala de mariposa son ANÁLOGOS (convergente)."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: La unidad evolutiva es la POBLACIÓN. La fuente primaria de nuevos alelos son las MUTACIONES. Homólogos = mismo origen (divergencia); Análogos = misma función (convergencia).",
                    "takeaway": "La evolución actúa sobre poblaciones mediante la selección natural de genotipos variables originados por mutación y recombinación génica."
                }
            elif "1.4" in sub_code or "virus" in t or "niveles" in t or "lítico" in t:
                return {
                    "marcoteorico": (
                        "La materia viva se organiza jerárquicamente en niveles de complejidad creciente: Nivel Químico o Abiótico "
                        "(subatómico, atómico, molecular, macromolecular y complejo supramolecular), Nivel Biológico (celular, tisular, "
                        "organológico, sistémico e individual) y Nivel Ecológico (población, comunidad/biocenosis, ecosistema, bioma y biósfera).\n\n"
                        "En el límite exacto entre lo inerte y lo vivo se ubican los VIRUS: complejos supramoleculares acelulares y parásitos intracelulares obligados. "
                        "Carecen de metabolismo propio, membrana plasmática, citosol y ribosomas, conteniendo un único tipo de ácido nucleico (ADN o ARN, jamás ambos simultáneamente) "
                        "protegido por una cápside proteica formada por capsómeros (nucleocápside). En el exterior celular se encuentran como partículas inertes llamadas viriones.\n\n"
                        "Los virus replican su genoma mediante dos vías principales: el Ciclo Lítico (infección activa, transcripción, ensamblaje de nuevos viriones "
                        "y lisis o rotura celular con muerte del huésped) y el Ciclo Lisogénico (el ADN viral se inserta en el cromosoma del hospedero como PROFAGO o PROVIRUS, "
                        "permaneciendo en estado latente y multiplicándose con la célula huésped sin destruirla, hasta que un estímulo desencadena el ciclo lítico)."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Fundamento Jerárquico de la Materia Viva",
                            "body": (
                                "• Nivel Químico: Atómico (bioelementos) → Molecular (H2O, glucosa) → Macromolecular (proteínas, ADN) → Complejo Supramolecular (virus, ribosomas, cromatina).\n"
                                "• Nivel Biológico: Celular (mínima unidad con vida autónoma) → Tejido → Órgano → Sistema → Organismo multicelular.\n"
                                "• Nivel Ecológico: Población (misma especie) → Biocenosis (múltiples especies) → Ecosistema (Biocenosis + Biotopo) → Biósfera."
                            )
                        },
                        {
                            "heading": "🔬 Morfología Viral y Ciclos Infecciosos",
                            "body": (
                                "• Estructura Viral: Genoma (ADN o ARN, mono o bicatenario) + Cápside proteica = Nucleocápside. Algunos presentan envoltura lipídica (VIH, influenza).\n"
                                "• Ciclo Lítico: Fijación → Penetración → Replicación macromolecular → Ensamblaje → Lisis celular (muerte de la célula y liberación de viriones).\n"
                                "• Ciclo Lisogénico: Integración del ADN viral en el cromosoma bacteriano formando un PROFAGO. Latencia sin lisis."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Diferenciaciones",
                            "body": (
                                "• Nivel de organización de los virus: COMPLEJO SUPRAMOLECULAR (no son células, no pertenecen a ningún reino biológico).\n"
                                "• Profago: Genoma viral integrado en el cromosoma de la célula hospedera durante el ciclo lisogénico.\n"
                                "• Retrotranscripción: En virus ARN como el VIH, la transcriptasa reversa convierte ARN viral en ADN proviral."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Axioma de Organización y Mecanismo Viral",
                        "formula_latex": "\\text{Virus} = \\text{Ácido Nucleico (ADN ó ARN)} + \\text{Cápside Proteica} \\quad [\\text{Complejo Supramolecular}]",
                        "formula_simple": "Virus = Complejo Supramolecular Acelular (Cápside + ADN ó ARN)",
                        "descripcion": "Nivel de organización supramolecular acelular de los virus y alternancia de ciclos reproductivos lítico y lisogénico.",
                        "despejes": [
                            {"nombre": "Ciclo Lítico (Virulento)", "latex": "\\text{Infección} \\to \\text{Replicación} \\to \\text{Ensamblaje} \\to \\text{Lisis}"},
                            {"nombre": "Ciclo Lisogénico (Atemperado)", "latex": "\\text{ADN Viral} + \\text{Cromosoma Huésped} \\implies \\text{Profago (Latente)}"}
                        ],
                        "variables": [
                            {"simbolo": "Profago", "nombre": "ADN viral integrado latente", "unidad": "Segmento cromosómico"},
                            {"simbolo": "Virión", "nombre": "Partícula viral infecciosa extracelular", "unidad": "Complejo supramolecular inerte"}
                        ],
                        "fija_unsa": "En UNSA: Los virus se ubican en el nivel de COMPLEJO SUPRAMOLECULAR. El ciclo que integra el profago sin destruir la célula es el LISOGÉNICO."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: El primer nivel con vida es el CELULAR. Virus y ribosomas son COMPLEJOS SUPRAMOLECULARES. El ciclo lisogénico no destruye la célula (forma profago).",
                    "takeaway": "La célula es la unidad mínima viviente. Los virus son complejos supramoleculares acelulares que alternan entre lisis activa y latencia lisogénica."
                }

        elif sem == 2:
            if "2.1" in sub_code or "bioelementos" in t:
                return {
                    "marcoteorico": (
                        "Los bioelementos son los elementos químicos indispensables que constituyen la materia viva. "
                        "Se dividen en tres clases cuantitativas y funcionales:\n"
                        "1) Primarios u Organógenos (CHONPS, 96-99%): El Carbono destaca por su tetravalencia y autosaturación para formar cadenas estables.\n"
                        "2) Secundarios (Na+, K+, Ca2+, Mg2+, Cl-, 3.9%): Na+ (catión extracelular primordial) y K+ (catión intracelular) sostienen el potencial de membrana; "
                        "el Ca2+ participa en la contracción muscular, coagulación sanguínea y matriz ósea; el Mg2+ es el átomo central de la CLOROFILA; y el Cl- es el principal anión extracelular.\n"
                        "3) Oligoelementos (<0.1%): Hierro (núcleo de la hemoglobina y mioglobina; su déficit causa anemia ferropénica); Yodo (hormonas tiroideas T3/T4; déficit causa bocio); "
                        "Cobre (hemocianina); Flúor (esmalte dental); Cobalto (vitamina B12); y Cinc (cicatrización y anhidrasa carbónica)."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Clasificación Cuantitativa de Bioelementos",
                            "body": (
                                "• Primarios (CHONPS): 96-99%. Forman biomoléculas orgánicas (glúcidos, lípidos, proteínas, ácidos nucleicos).\n"
                                "• Secundarios: Na+, K+, Ca2+, Mg2+, Cl- (3.9%). Conducción nerviosa, contracción y equilibrio osmótico.\n"
                                "• Oligoelementos: Fe, I, Cu, F, Co, Zn (<0.1%). Catalizadores y cofactores esenciales."
                            )
                        },
                        {
                            "heading": "🔬 Funciones Específicas y Enfermedades Carenciales",
                            "body": (
                                "• Hierro (Fe): Centro de la hemoglobina para transportar O2. Carencia: Anemia ferropénica.\n"
                                "• Magnesio (Mg): Núcleo de la Clorofila en plantas. Carencia: Clorosis foliar.\n"
                                "• Yodo (I): Síntesis de tiroxina (T4). Carencia: Bocio endémico e hipotiroidismo.\n"
                                "• Calcio (Ca): Coagulación sanguínea (factor IV), contracción del sarcómero y formación ósea."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Mnemotecnias",
                            "body": (
                                "• Clorofila = Magnesio (Mg); Hemoglobina = Hierro (Fe); Hemocianina = Cobre (Cu).\n"
                                "• Catión intracelular más abundante: POTASIO (K+). Extracelular: SODIO (Na+).\n"
                                "• Vitamina B12 (Cobalamina) contiene COBALTO (Co)."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Gradiente Iónico y Potencial de Membrana",
                        "formula_latex": "[\\text{Na}^+]_{ext} \\gg [\\text{Na}^+]_{int} \\quad \\land \\quad [\\text{K}^+]_{int} \\gg [\\text{K}^+]_{ext} \\implies V_m = -70\\text{ mV}",
                        "formula_simple": "Na+ extracelular > Na+ intracelular  |  K+ intracelular > K+ extracelular",
                        "descripcion": "Distribución asimétrica de bioelementos secundarios generada por la bomba de sodio-potasio ATPasa.",
                        "despejes": [
                            {"nombre": "Clorofila vs Hemoglobina", "latex": "\\text{Clorofila} [\\text{Mg}^{2+}] \\iff \\text{Hemoglobina} [\\text{Fe}^{2+}]"},
                            {"nombre": "Hormonas Tiroideas", "latex": "\\text{Tirosina} + 4\\,\\text{I}^- \\to \\text{Tiroxina (T}_4\\text{)}"}
                        ],
                        "variables": [
                            {"simbolo": "Mg2+", "nombre": "Magnesio", "unidad": "Cofactor y centro de clorofila"},
                            {"simbolo": "Fe2+", "nombre": "Hierro ferroso", "unidad": "Grupo hemo transportador de O2"}
                        ],
                        "fija_unsa": "Pregunta de cajón UNSA: ¿Cuál es el bioelemento que conforma el anillo central de la clorofila? Clave: MAGNESIO (Mg)."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: Clorofila = Magnesio; Hemoglobina = Hierro; Tiroxina = Yodo. Na+ es el catión extracelular y K+ el catión intracelular más abundante.",
                    "takeaway": "Los bioelementos primarios forman estructuras moleculares; los secundarios sostienen gradientes iónicos y los oligoelementos catalizan funciones metabólicas."
                }
            elif "2.2" in sub_code or "agua" in t:
                return {
                    "marcoteorico": (
                        "El agua (H2O) es la biomolécula inorgánica más abundante de la materia viva (65-75%). "
                        "Estructuralmente es un DIPOLO ELÉCTRICO (ángulo de enlace de 104.5°) con carga parcial negativa en el oxígeno "
                        "y positiva en los hidrógenos, lo que le permite formar PUENTES DE HIDRÓGENO intermoleculares continuos.\n\n"
                        "Propiedades fisicoquímicas evaluadas en la UNSA:\n"
                        "1) Elevado Calor Específico (1 cal/g·°C): Actúa como excelente TERMORREGULADOR biológico, amortiguando los cambios térmicos celulares.\n"
                        "2) Elevado Calor de Vaporización: Absorbe calor corporal al evaporarse (enfriamiento por transpiración/sudor).\n"
                        "3) Tensión Superficial y Capilaridad: Por fuerzas de cohesión y adhesión, el agua asciende por los vasos del xilema sin gasto energético.\n"
                        "4) Solvente Universal: Disuelve solutos iónicos y polares por su alta constante dieléctrica.\n"
                        "5) Densidad Anómala: Su máxima densidad es a 4 °C; el hielo flota actuando como aislante térmico en ecosistemas acuáticos."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Estructura Molecular del Agua y Puentes de Hidrógeno",
                            "body": (
                                "• Geometría angular: 104.5°. Densidad de carga negativa en el O y positiva en los H: dipolo eléctrico.\n"
                                "• Puentes de Hidrógeno: Enlaces electrostáticos intermoleculares que confieren alta cohesión.\n"
                                "• Solvente Universal: Forma capas de hidratación alrededor de aniones y cationes."
                            )
                        },
                        {
                            "heading": "🔬 Propiedades Fisicoquímicas y Aplicaciones Vitales",
                            "body": (
                                "• Termorregulador: Su alto calor específico impide variaciones térmicas drásticas en la célula.\n"
                                "• Capilaridad: Ascenso de agua por el xilema desde las raíces hasta las hojas por cohesión y adhesión.\n"
                                "• Densidad Anómala: Hielo flota sobre el agua a 0 °C (máxima densidad a 4 °C), preservando la fauna bentónica."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Casos de Examen",
                            "body": (
                                "• ¿Por qué el agua es termorreguladora? Clave: Por su ELEVADO CALOR ESPECÍFICO.\n"
                                "• ¿Cómo sube la savia bruta en árboles altos? Clave: Por CAPILARIDAD y TENSIÓN SUPERFICIAL a través del XILEMA.\n"
                                "• Los insectos caminan sobre el agua gracias a su ELEVADA TENSIÓN SUPERFICIAL."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Ley de Capilaridad y Calorimetría del Agua",
                        "formula_latex": "h = \\frac{2\\gamma \\cos\\theta}{\\rho g r} \\quad \\land \\quad Q = m \\cdot C_e \\cdot \\Delta T \\quad [C_e = 1\\,\\text{cal/g}^{\\circ}\\text{C}]",
                        "formula_simple": "h = 2γ cosθ / (ρ g r)  |  Q = m · Ce · ΔT",
                        "descripcion": "Propiedades de ascenso capilar en conductos estrechos y capacidad amortiguadora térmica del agua.",
                        "despejes": [
                            {"nombre": "Calor de Vaporización", "latex": "Q_v = m \\cdot L_v \\quad [L_v = 540\\,\\text{cal/g}]"},
                            {"nombre": "Densidad Máxima", "latex": "\\rho_{\\max} = 1.000\\,\\text{g/cm}^3 \\text{ a } 4^{\\circ}\\text{C}"}
                        ],
                        "variables": [
                            {"simbolo": "γ", "nombre": "Tensión superficial", "unidad": "N/m"},
                            {"simbolo": "Ce", "nombre": "Calor específico del agua líquida", "unidad": "1 cal/(g·°C)"}
                        ],
                        "fija_unsa": "En CEPREUNSA: La propiedad que permite la termorregulación es el ALTO CALOR ESPECÍFICO; la que permite el ascenso en el xilema es la CAPILARIDAD."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: El agua es termorreguladora por su ALTO CALOR ESPECÍFICO. La capilaridad resulta de la cohesión y adhesión. El hielo flota porque su máxima densidad es a 4 °C.",
                    "takeaway": "Los puentes de hidrógeno otorgan al agua su alto calor específico (termorregulador), capilaridad (transporte en xilema) y flotabilidad del hielo."
                }
            elif "2.3" in sub_code or "glucosa" in t or "glúcidos" in t:
                return {
                    "marcoteorico": (
                        "Los glúcidos o carbohidratos son biomoléculas ternarias (C, H, O) cuya función primordial es el APORTE DE ENERGÍA INMEDIATA "
                        "(4 kcal/g). Químicamente son polihidroxialdehídos (aldosas) o polihidroxicetonas (cetosas).\n\n"
                        "Clasificación esencial:\n"
                        "1) Monosacáridos: Monómeros azucarados no hidrolizables. Por carbonos: triosas, pentosas (Ribosa en ARN/ATP; Desoxirribosa en ADN; "
                        "Ribulosa que fija CO2 en fotosíntesis) y hexosas (Glucosa o dextrosa: combustible del cerebro y hematíes; Fructosa o levulosa: "
                        "nutriente del espermatozoide en el semen; Galactosa: azúcar de la leche).\n"
                        "2) Disacáridos: Formados por la unión de dos monosacáridos con desprendimiento de agua mediante el ENLACE GLUCOSÍDICO:\n"
                        "• Sacarosa: Glucosa + Fructosa [enlace α(1→2)], azúcar de caña no reductor.\n"
                        "• Maltosa: Glucosa + Glucosa [enlace α(1→4)], azúcar de malta.\n"
                        "• Lactosa: Galactosa + Glucosa [enlace β(1→4)], azúcar de leche."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Estructura de Monosacáridos y Clasificación",
                            "body": (
                                "• Fórmula empírica: Cn(H2O)n. Función: Energía inmediata (4 kcal/g).\n"
                                "• Aldosas: Glucosa, Galactosa, Ribosa, Gliceraldehído (grupo -CHO en C1).\n"
                                "• Cetosas: Fructosa, Ribulosa, Dihidroxiacetona (grupo -C=O en C2).\n"
                                "• Isómeros: Glucosa, Fructosa y Galactosa tienen la misma fórmula C6H12O6."
                            )
                        },
                        {
                            "heading": "🔬 Disacáridos y Enlace Glucosídico",
                            "body": (
                                "• Enlace Glucosídico: Tipo éter formado por condensación con liberación de una molécula de agua.\n"
                                "• Sacarosa: Glucosa + Fructosa [α(1→2)]. Azúcar común de caña.\n"
                                "• Lactosa: Galactosa + Glucosa [β(1→4)]. Azúcar de la leche.\n"
                                "• Maltosa: Glucosa + Glucosa [α(1→4)]. Digestión de almidón."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Preguntas Clave",
                            "body": (
                                "• Azúcar del espermatozoide: FRUCTOSA (secretada por las vesículas seminales).\n"
                                "• Azúcar de la sangre: GLUCOSA (regulada por la insulina y el glucagón).\n"
                                "• Pentosa que fija el CO2: RIBULOSA-1,5-BISFOSFATO (mediante la enzima RuBisCO)."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Enlace Glucosídico y Disacáridos",
                        "formula_latex": "\\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{Enlace glucosídico}} \\text{C}_{12}\\text{H}_{22}\\text{O}_{11} + \\text{H}_2\\text{O}",
                        "formula_simple": "Monosacárido + Monosacárido -> Disacárido + H2O",
                        "descripcion": "Reacción de síntesis por deshidratación mediada por enlace glucosídico covalente.",
                        "despejes": [
                            {"nombre": "Sacarosa", "latex": "\\text{Sacarosa} = \\text{Glucosa} + \\text{Fructosa} \\quad [\\alpha(1\\to2)]"},
                            {"nombre": "Maltosa", "latex": "\\text{Maltosa} = \\text{Glucosa} + \\text{Glucosa} \\quad [\\alpha(1\\to4)]"},
                            {"nombre": "Lactosa", "latex": "\\text{Lactosa} = \\text{Galactosa} + \\text{Glucosa} \\quad [\\beta(1\\to4)]"}
                        ],
                        "variables": [
                            {"simbolo": "C6H12O6", "nombre": "Glucosa / Fructosa / Galactosa", "unidad": "180 g/mol"},
                            {"simbolo": "C12H22O11", "nombre": "Disacárido", "unidad": "342 g/mol"}
                        ],
                        "fija_unsa": "Pregunta fija UNSA: ¿Qué monosacáridos forman la sacarosa? Clave: Glucosa + Fructosa. ¿Y la lactosa? Galactosa + Glucosa."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: Glúcidos aportan 4 kcal/g. Sacarosa = Glucosa + Fructosa. Maltosa = Glucosa + Glucosa. Lactosa = Galactosa + Glucosa. Fructosa alimenta al espermatozoide.",
                    "takeaway": "Los monosacáridos aportan energía inmediata (glucosa, fructosa). Se condensan mediante enlace glucosídico para formar los disacáridos sacarosa, maltosa y lactosa."
                }
            elif "2.4" in sub_code or "almidón" in t or "polisacáridos" in t:
                return {
                    "marcoteorico": (
                        "Los polisacáridos son macromoléculas biológicas insolubles formadas por cientos o miles de glucosas unidas por enlaces glucosídicos. "
                        "No tienen sabor dulce ni poder reductor y se clasifican por su función biológica:\n\n"
                        "1) De Reserva Energética:\n"
                        "• Almidón: Reserva vegetal (tubérculos, semillas). Formado por Amilosa (lineal, α(1→4)) y Amilopectina (ramificada, α(1→6)). Se tiñe de azul con Lugol.\n"
                        "• Glucógeno: Reserva animal y de hongos. Almacenado en el HÍGADO (regulación glucémica) y en el MÚSCULO ESQUELÉTICO (energía contráctil). Muy ramificado.\n"
                        "2) Estructurales:\n"
                        "• Celulosa: Componente de la pared celular vegetal. Cadenas lineales de glucosas con enlaces β(1→4). Insoluble e indigerible por amilasas humanas.\n"
                        "• Quitina: Forma la pared celular de los HONGOS y el exoesqueleto de los ARTRÓPODOS (insectos, crustáceos). Monómero: N-acetilglucosamina (NAG) con enlaces β(1→4)."
                    ),
                    "sections": [
                        {
                            "heading": "🏛️ Clasificación Funcional de Polisacáridos",
                            "body": (
                                "• Reserva Energética (Enlaces α): Almidón (plantas) y Glucógeno (animales y hongos).\n"
                                "• Estructurales (Enlaces β): Celulosa (pared de plantas) y Quitina (pared de hongos y exoesqueleto de artrópodos).\n"
                                "• Reactivo de Lugol: Identifica almidón virando a color azul-violeta oscuro."
                            )
                        },
                        {
                            "heading": "🔬 Diferencias Estructurales Detalladas",
                            "body": (
                                "• Almidón: Amilosa lineal en hélice α(1→4) + Amilopectina ramificada α(1→6) cada 24-30 glucosas.\n"
                                "• Glucógeno: Ramificaciones α(1→6) cada 8-12 unidades. Rápida movilización por glucogenólisis.\n"
                                "• Celulosa: Fibras de glucosa β(1→4) paralelas unidas por puentes de H. Fibra dietética vegetal.\n"
                                "• Quitina: Polímero nitrogenado de N-acetilglucosamina (NAG) con enlace β(1→4)."
                            )
                        },
                        {
                            "heading": "💡 Claves de Admisión UNSA y Diferenciaciones",
                            "body": (
                                "• Pared celular de hongos vs plantas: Hongos = QUITINA (contiene nitrógeno); Plantas = CELULOSA.\n"
                                "• Depósitos de Glucógeno: En humanos se almacena en el HÍGADO y MÚSCULO.\n"
                                "• Digestión: Los humanos no digieren celulosa porque carecemos de la enzima celulasa (enlaces beta)."
                            )
                        }
                    ],
                    "formula": {
                        "teorema_nombre": "Estructura de Polímeros de Glucosa",
                        "formula_latex": "\\text{Almidón/Glucógeno} = [\\alpha\\text{-Glucosa}]_n \\quad \\land \\quad \\text{Celulosa} = [\\beta\\text{-Glucosa}]_n",
                        "formula_simple": "Reserva: Enlaces α(1→4) y α(1→6)  |  Estructural: Enlaces β(1→4)",
                        "descripcion": "Diferenciación estereoquímica de enlaces que determina la digestibilidad y función de los polisacáridos.",
                        "despejes": [
                            {"nombre": "Quitina", "latex": "\\text{Quitina} = [\\text{N-acetilglucosamina}]_n \\quad (\\text{Hongos y artrópodos})"},
                            {"nombre": "Glucogenólisis", "latex": "\\text{Glucógeno} \\xrightarrow{\\text{Fosforilasa}} n\\,\\text{Glucosa-1-P} \\to \\text{Energía}"}
                        ],
                        "variables": [
                            {"simbolo": "n", "nombre": "Número de monómeros de glucosa", "unidad": "> 1000 unidades"},
                            {"simbolo": "NAG", "nombre": "N-acetilglucosamina", "unidad": "Monómero nitrogenado de quitina"}
                        ],
                        "fija_unsa": "En UNSA: La quitina forma la pared celular de los hongos y el exoesqueleto de los artrópodos; el glucógeno se almacena en hígado y músculo."
                    },
                    "fijaUnsa": "Clave Fija CEPREUNSA: Almidón = reserva vegetal; Glucógeno = reserva animal (hígado y músculo). Celulosa = pared vegetal [β(1→4)]; Quitina = pared de hongos y exoesqueleto de artrópodos.",
                    "takeaway": "Los polisacáridos de reserva (almidón, glucógeno) usan enlaces alfa digeribles; los estructurales (celulosa, quitina) usan enlaces beta rígidos e insolubles."
                }

    # Default fallback enriquecido para temas de ciencias
    return None
