import json
import sys
import re

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

for name, t_key in name_map.items():
    toc = tocs.get(t_key, {})
    toc_text = toc.get('toc', '')
    
    # Extract all lines in toc that look like chapters or topics
    raw_lines = [l.strip() for l in toc_text.split('\n') if l.strip()]
    chapter_lines = []
    for l in raw_lines:
        if re.search(r'^(?:CAP[ÍI]TULO|TEMA|\d+\.|\d+\.\d+)', l, re.IGNORECASE):
            # clean dots and page numbers
            cleaned = re.sub(r'[\.\s\-_]+\s*\d+$', '', l).strip()
            chapter_lines.append(cleaned)
    
    # Gather all subtopic titles in syllabus
    syl = syllabus.get(name, {})
    syl_topics = []
    for w in syl.get('weeks', []):
        for t in w.get('topics', []):
            syl_topics.append(t['title'])
            
    print(f"\n=======================================================")
    print(f"ASIGNATURA: {name} (Tomo: {len(chapter_lines)} entradas TOC vs Syllabus: {len(syl_topics)} subtemas)")
    print(f"=======================================================")
    # Print chapters from Tomo
    for cl in chapter_lines[:15]:
        print(f"  [Tomo] {cl}")
    if len(chapter_lines) > 15:
        print(f"  ... y {len(chapter_lines)-15} entradas más en el tomo")
