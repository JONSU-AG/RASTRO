import json
import re

with open(r'C:\Users\Usuario\.gemini\antigravity-ide\brain\2fe153c8-8942-404c-970d-fa849ffe2450\scratch\complete_tocs_15_courses.json', 'r', encoding='utf-8') as f:
    tocs = json.load(f)

for subj, data in tocs.items():
    toc_text = data.get('toc', '')
    # find TEMA or CAPITULO
    temas = re.findall(r'(?:TEMA|CAP[ÍI]TULO)\s*(\d+|[IVXLCDM]+)[\s:\.\-]+([^\.\n\r]+)', toc_text, re.IGNORECASE)
    print(f"\n=== {subj} (Total Páginas: {data.get('pages', 0)}) ===")
    print(f"Capítulos/Temas encontrados en TOC del Tomo: {len(temas)}")
    for t in temas[:8]:
        print(f"  - {t[0]}: {t[1].strip()[:60]}")
    if len(temas) > 8:
        print(f"  ... y {len(temas)-8} temas más")
