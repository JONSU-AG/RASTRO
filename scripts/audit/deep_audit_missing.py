import json
import re
import sys
import os

# Set UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

with open(r'C:\Users\Usuario\.gemini\antigravity-ide\brain\2fe153c8-8942-404c-970d-fa849ffe2450\scratch\complete_tocs_15_courses.json', 'r', encoding='utf-8') as f:
    tocs = json.load(f)

syllabus = cepreunsa_syllabus_data.SYLLABUS

name_map = {
    "Biología": "BIOLOGIA",
    "Física": "FISICA",
    "Química": "QUIMICA",
    "Matemática": "MATEMATICA",
    "Filosofía": "FILOSOFIA",
    "Historia": "HISTORIA",
    "Cívica": "CIVICA",
    "Geografía": "GEOGRAFIA",
    "Psicología": "PSICOLOGIA",
    "Lenguaje": "LENGUAJE",
    "Literatura": "LITERATURA",
    "Raz. Lógico": "RAZONAMIENTO LOGICO",
    "Raz. Matemático": "RAZONAMIENTO MATEMATICO",
    "Raz. Verbal": "RAZONAMIENTO VERBAL",
    "Inglés": "INGLES"
}

missing_findings = {}

for s_name, t_key in name_map.items():
    toc_data = tocs.get(t_key, {})
    toc_text = toc_data.get('toc', '')
    
    # Extract sections from TOC text
    raw_lines = [l.strip() for l in toc_text.split('\n') if l.strip() and not l.strip().startswith('[PAG')]
    
    # Get all syllabus text for this course
    syl = syllabus.get(s_name, {})
    syl_text = ""
    for w in syl.get('weeks', []):
        syl_text += " " + w.get('title', '')
        for t in w.get('topics', []):
            syl_text += " " + t.get('title', '') + " " + t.get('short', '') + " " + t.get('kw', '')
    syl_text_lower = syl_text.lower()
    
    # Filter major chapters or themes from TOC
    chapters = []
    for l in raw_lines:
        if re.search(r'^(?:TEMA|CAP[ÍI]TULO|\d+\.|\d+\.\d+)', l, re.IGNORECASE):
            # remove page number at end
            clean = re.sub(r'[\.\s\-_]+\s*\d+$', '', l).strip()
            # extract main keyword
            if len(clean) > 5 and not clean.startswith('PAG'):
                chapters.append(clean)
                
    # Check coverage of key concepts from the tomo
    uncovered = []
    for ch in chapters:
        # extract words > 4 letters
        words = re.findall(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ]{5,}', ch)
        # if none of the significant words is in syllabus text, flag it
        significant_words = [w for w in words if w.lower() not in ['capítulo', 'tema', 'sobre', 'parte', 'clases', 'tipos', 'algunos', 'aspectos']]
        if significant_words:
            matches = [w for w in significant_words if w.lower() in syl_text_lower]
            if len(matches) == 0:
                uncovered.append((ch, significant_words))
                
    missing_findings[s_name] = {
        "total_toc_entries": len(chapters),
        "uncovered": uncovered
    }

print("=== REPORTE DE ANÁLISIS DE TEMAS FALTANTES O BRECHAS ===")
for s_name, res in missing_findings.items():
    print(f"\n📚 {s_name}: {len(res['uncovered'])} temas/secciones con potencial brecha de {res['total_toc_entries']} entradas")
    for u in res['uncovered'][:6]:
        print(f"   [!] {u[0]} (palabras: {', '.join(u[1])})")
    if len(res['uncovered']) > 6:
        print(f"   ... y {len(res['uncovered'])-6} temas específicos más")
