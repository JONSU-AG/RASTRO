import sys
import os

path = os.path.join('scripts', 'cepreunsa_syllabus_data.py')
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. BIOLOGÍA: Virus y ciclos lítico/lisogénico en Semana 1
code = code.replace(
    '{"title": "Niveles de Organización de la Materia Viva y Taxonomía", "short": "Niveles y Taxonomía", "icon": "📊", "kw": "niveles"}',
    '{"title": "Niveles de Organización de la Materia Viva, Taxonomía y Virus (Ciclo Lítico y Lisogénico)", "short": "Niveles, Virus y Ciclos", "icon": "📊", "kw": "virus"}'
)

# 2. FILOSOFÍA: Disciplinas completas (Metafísica, Ontología, Estética, Lógica) en Semana 1
code = code.replace(
    '{"title": "Disciplinas Filosóficas: Ontología, Gnoseología, Epistemología, Ética y Axiología", "short": "Disciplinas Filosóficas", "icon": "⚖️", "kw": "disciplinas"}',
    '{"title": "Disciplinas Filosóficas: Metafísica, Ontología, Gnoseología, Epistemología, Lógica, Ética y Estética", "short": "Disciplinas Filosóficas", "icon": "⚖️", "kw": "metafísica"}'
)

# 3. MATEMÁTICA: Integrar Aritmética (Divisibilidad, Primos, MCD/MCM) y Geometría/Trigonometría
# In Semana 4:
code = code.replace(
    '{"title": "División Algebraica: Método de Horner, Ruffini y Teorema del Resto", "short": "Horner y Ruffini", "icon": "➗", "kw": "división"}',
    '{"title": "División Algebraica (Horner, Ruffini, Resto) y Aritmética: Divisibilidad, Multiplicidad y Teorema de Arquímedes", "short": "División y Divisibilidad", "icon": "➗", "kw": "divisibilidad"}'
)
# In Semana 5:
code = code.replace(
    '{"title": "Factorización: Factor Común, Identidades y Aspa Simple y Doble", "short": "Factorización", "icon": "🧩", "kw": "factorización"}',
    '{"title": "Factorización (Aspa Simple/Doble) y Aritmética: Números Primos, Criba de Eratóstenes, MCD y MCM", "short": "Factorización y Primos", "icon": "🧩", "kw": "números primos"}'
)
# In Semana 9:
code = code.replace(
    '{"title": "Matrices: Operaciones, Transpuesta y Matriz Inversa", "short": "Matrices", "icon": "🔲", "kw": "matrices"}',
    '{"title": "Geometría Plana y del Espacio: Triángulos, Circunferencias, Áreas y Sólidos Geométricos", "short": "Geometría y Sólidos", "icon": "📐", "kw": "geometría"}'
)
# In Semana 10:
code = code.replace(
    '{"title": "Progresiones Aritméticas y Geométricas: Término Enésimo y Suma", "short": "Progresiones", "icon": "📈", "kw": "progresiones"}',
    '{"title": "Trigonometría: Razones Trigonométricas de Ángulos Notables, Identidades Fundamentales y Ley de Senos", "short": "Trigonometría e Identidades", "icon": "📐", "kw": "trigonometría"}'
)

# 4. HISTORIA: Categorías temporales en Semana 1, Enciclopedismo en Semana 5, Destrucción del mundo andino en Semana 6
code = code.replace(
    '{"title": "La Historia: Objeto de Estudio, Métodos y Fuentes Históricas", "short": "Historia y Fuentes", "icon": "📜", "kw": "fuentes"}',
    '{"title": "La Historia: Objeto de Estudio, Fuentes y Categorías Temporales (Diacronía y Sincronía)", "short": "Historia y Categorías", "icon": "📜", "kw": "diacronía"}'
)
code = code.replace(
    '{"title": "Humanismo y Renacimiento: Retorno a los Clásicos y Nuevas Artes", "short": "Humanismo y Renacimiento", "icon": "🎨", "kw": "renacimiento"}',
    '{"title": "Humanismo, Renacimiento, Mercantilismo e Ilustración (El Enciclopedismo Francés)", "short": "Renacimiento y Enciclopedia", "icon": "🎨", "kw": "enciclopedismo"}'
)
code = code.replace(
    '{"title": "Invasión al Tahuantinsuyo: Factores de la Caída y Captura de Atahualpa", "short": "Invasión y Captura", "icon": "⚔️", "kw": "cajamarca"}',
    '{"title": "Invasión Española, Caída del Tahuantinsuyo y Resistencia Andina de Vilcabamba (Manco Inca)", "short": "Invasión y Resistencia Vilcabamba", "icon": "⚔️", "kw": "vilcabamba"}'
)

# 5. CÍVICA: Identidad Arequipeña en Semana 1, Proceso Legislativo en Semana 3
code = code.replace(
    '{"title": "Identidad Regional y Local: Costumbres, Tradiciones y Pertenencia", "short": "Identidad Regional", "icon": "🌄", "kw": "regional"}',
    '{"title": "Identidad Regional y Local: La Identidad Arequipeña (Patrimonio, Historia y Símbolos de Arequipa)", "short": "Identidad Arequipeña", "icon": "🌋", "kw": "arequipa"}'
)
code = code.replace(
    '{"title": "Poder Legislativo: Estructura del Congreso, Funciones y Atribuciones", "short": "Poder Legislativo", "icon": "🏛️", "kw": "congreso"}',
    '{"title": "Poder Legislativo: Estructura del Congreso, Atribuciones y Procedimiento de Aprobación de Leyes", "short": "Congreso y Proceso Leyes", "icon": "🏛️", "kw": "leyes"}'
)

# 6. PSICOLOGÍA: Tipos de Familia y Prevención de Violencia
code = code.replace(
    '{"title": "Conductas de Riesgo en Adolescentes: Adicciones, Trastornos de Conducta Alimentaria (TCA) y Depresión", "short": "Conductas de Riesgo", "icon": "⚠️", "kw": "adicciones"}',
    '{"title": "Tipos de Familia (Nuclear, Extensa, Monoparental) y Prevención de Violencia Familiar y Cyberbullying", "short": "Familia y Prevención Violencia", "icon": "👨‍👩‍👧", "kw": "familia"}'
)

# 7. QUÍMICA: Dualidad onda-corpúsculo e incertidumbre en Semana 4, Nomenclatura Tradicional, Stock y Sistemática en Semana 7
code = code.replace(
    '{"title": "Modelos Atómicos Históricos: Dalton, Thomson, Rutherford y Bohr", "short": "Modelos Atómicos", "icon": "⚛️", "kw": "modelos atómicos"}',
    '{"title": "Modelos Atómicos: Dalton, Thomson, Rutherford, Bohr y Dualidad Onda-Corpúsculo de De Broglie", "short": "Modelos Atómicos y De Broglie", "icon": "⚛️", "kw": "de broglie"}'
)
code = code.replace(
    '{"title": "Número y Estado de Oxidación: Reglas Fundamentales", "short": "Estados de Oxidación", "icon": "🔢", "kw": "oxidación"}',
    '{"title": "Estados de Oxidación y Sistemas de Nomenclatura: Clásica/Tradicional, Stock y Sistemática IUPAC", "short": "Nomenclatura Tradicional y Stock", "icon": "🔢", "kw": "nomenclatura"}'
)

# 8. RAZ. LÓGICO: Paradojas y Enunciados no proposicionales
code = code.replace(
    '{"title": "Enunciados Abiertos, Pseudo-proposiciones y Oraciones Expresivas", "short": "Enunciados Abiertos", "icon": "❓", "kw": "enunciado"}',
    '{"title": "Enunciados no Proposicionales (Directivos, Interrogativos, Exclamativos) y Paradojas Lógicas", "short": "Enunciados y Paradojas", "icon": "❓", "kw": "paradojas"}'
)

# 9. INGLÉS: Greetings, Farewells e Imperativos
code = code.replace(
    '{"title": "Personal Pronouns (Subject & Object) and Basic Sentence Structure", "short": "Personal Pronouns", "icon": "👤", "kw": "pronouns"}',
    '{"title": "Personal Pronouns, Greetings, Farewells & Basic Imperatives (Giving Instructions)", "short": "Pronouns, Greetings & Imperatives", "icon": "👤", "kw": "greetings"}'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Actualizado scripts/cepreunsa_syllabus_data.py con todos los temas de profundización académica!")
