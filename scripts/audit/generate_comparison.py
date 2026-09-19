import json
import sys

sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

with open(r'C:\Users\Usuario\.gemini\antigravity-ide\brain\2fe153c8-8942-404c-970d-fa849ffe2450\scratch\complete_tocs_15_courses.json', 'r', encoding='utf-8') as f:
    tocs = json.load(f)

syllabus = cepreunsa_syllabus_data.SYLLABUS

# Mapping subject names in syllabus to tocs keys
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

with open("comparison_report.txt", "w", encoding="utf-8") as out:
    for syl_name, toc_key in name_map.items():
        out.write(f"\n=======================================================\n")
        out.write(f"ASIGNATURA: {syl_name} (Tomo Key: {toc_key})\n")
        out.write(f"=======================================================\n")
        
        toc_info = tocs.get(toc_key, {})
        toc_text = toc_info.get('toc', '')
        
        # Syllabus weeks
        syl_data = syllabus.get(syl_name, {})
        weeks = syl_data.get('weeks', [])
        out.write(f"Syllabus implementado: {len(weeks)} semanas, {sum(len(w['topics']) for w in weeks)} subtemas\n\n")
        
        for w in weeks:
            out.write(f"  [Semana {w['sem']}] {w['title']}\n")
            for top in w['topics']:
                out.write(f"      - {top['title']}\n")
        
        out.write(f"\n--- Extracto del Índice del Tomo Original ({toc_info.get('pages', 0)} págs) ---\n")
        lines = [l.strip() for l in toc_text.split('\n') if l.strip() and not l.strip().startswith('[PAG')]
        for l in lines[:25]:
            out.write(f"  > {l}\n")
        if len(lines) > 25:
            out.write(f"  > ... ({len(lines)-25} líneas más en el tomo)\n")

print("Generated comparison_report.txt successfully!")
